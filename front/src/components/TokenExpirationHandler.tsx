import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip
} from '@mui/material';
import {
  ExitToApp as LogoutIcon,
  ShoppingBag as ContinueIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { authStorage } from '../services/authStorage';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';

interface TokenExpirationHandlerProps {
  children: React.ReactNode;
}

export default function TokenExpirationHandler({ children }: TokenExpirationHandlerProps) {
  const [showExpiredDialog, setShowExpiredDialog] = useState(false);
  const navigate = useNavigate();
  const [timerId, setTimerId] = useState<number | null>(null);

  function getTokenExpiryMs(token: string | null): number | null {
    if (!token) return null;
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const payload = JSON.parse(atob(parts[1]));
      if (!payload?.exp) return null;
      return payload.exp * 1000;
    } catch {
      return null;
    }
  }

  function scheduleExpiryCheck() {
    // Clear previous timer
    if (timerId) {
      clearTimeout(timerId);
    }
    const token = authStorage.getToken();
    const expMs = getTokenExpiryMs(token);
    if (!token || !expMs) return;
    const now = Date.now();
    const leadMs = 5 * 60 * 1000; // show 5 minutes before expiry
    const delay = Math.max(0, expMs - now - leadMs);
    const id = window.setTimeout(() => {
      // If already expired or about to expire, show dialog
      setShowExpiredDialog(true);
    }, delay);
    setTimerId(id);
  }

  useEffect(() => {
    // Create a global error handler for token expiration
    const handleTokenExpiration = (event: CustomEvent) => {
      if (event.detail.status === 401 && authStorage.isAuthenticated()) {
        setShowExpiredDialog(true);
      }
    };

    // Listen for token expiration events
    window.addEventListener('tokenExpired', handleTokenExpiration as EventListener);

    // Schedule timer-based detection based on current token
    scheduleExpiryCheck();

    const onAuthRefreshed = () => {
      // reschedule when token changes
      scheduleExpiryCheck();
    };
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        // Recalculate on tab focus
        scheduleExpiryCheck();
        const token = authStorage.getToken();
        const expMs = getTokenExpiryMs(token);
        if (expMs && Date.now() >= expMs) {
          setShowExpiredDialog(true);
        }
      }
    };
    window.addEventListener('authRefreshed', onAuthRefreshed as EventListener);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.removeEventListener('tokenExpired', handleTokenExpiration as EventListener);
      window.removeEventListener('authRefreshed', onAuthRefreshed as EventListener);
      document.removeEventListener('visibilitychange', onVisibility);
      if (timerId) clearTimeout(timerId);
    };
  }, []);

  const handleContinue = async () => {
    try {
      (window as unknown as { __refreshingToken?: boolean }).__refreshingToken = true;
      console.log('🔄 Attempting to refresh token...');
      
      const { token } = await authService.refresh();
      if (token) {
        console.log('✅ Token refreshed successfully');
        authStorage.setToken(token);
        setShowExpiredDialog(false);
        // Notify app that auth state changed
        window.dispatchEvent(new CustomEvent('authRefreshed'));
        // Reschedule the expiry check with new token
        scheduleExpiryCheck();
        console.log('✅ Session extended successfully');
      } else {
        throw new Error('No token received from refresh');
      }
    } catch (e) {
      console.error('❌ Token refresh failed:', e);
      // If refresh fails, show error but don't automatically logout
      // Let user decide what to do
      setShowExpiredDialog(false);
      // Don't clear auth storage - let user try again or logout manually
      console.log('⚠️ Refresh failed, but keeping user logged in for now');
    }
    finally {
      (window as unknown as { __refreshingToken?: boolean }).__refreshingToken = false;
    }
  };

  const handleLogout = async () => {
    try {
      // Call logout API to update server-side status
      await authService.logout();
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API call failed:', error);
    }
    
    setShowExpiredDialog(false);
    authStorage.clear();
    navigate('/');
  };

  return (
    <>
      {children}
      
      <Dialog 
        open={showExpiredDialog}
        onClose={() => {}} // Prevent closing by clicking outside
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px',
            border: '2px solid',
            borderColor: 'warning.main',
            background: 'linear-gradient(135deg, rgba(18, 17, 17, 0.9) 0%, rgba(52, 46, 46, 0.95) 100%)',
            backdropFilter: 'blur(10px)',
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', pb: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: 'warning.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%, 100%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.05)' }
                }
              }}
            >
              <WarningIcon sx={{ fontSize: '2.5rem', color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight={700} color="white" gutterBottom>
                Session Expired
              </Typography>
              <Chip 
                label="Authentication Required"
                color="warning"
                size="small"
                sx={{ fontWeight: 600 }}
              />
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ textAlign: 'center', py: 3 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 2,
              fontWeight: 500,
              color: 'darkgray'
            }}
          >
            Your session will expire soon. Do you want to stay logged in?
          </Typography>
          
          <Typography 
            variant="body2" 
            sx={{ 
              fontSize: '1rem',
              lineHeight: 1.6,
              maxWidth: '400px',
              mx: 'auto',
              color: 'darkgray',
              opacity: 0.8
            }}
          >
            Click "Stay Logged In" to extend your session, or "Logout" to sign out now.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ 
          justifyContent: 'center', 
          gap: 2, 
          pb: 4,
          px: 4 
        }}>
          <Button
            onClick={handleContinue}
            variant="outlined"
            size="large"
            startIcon={<ContinueIcon />}
            sx={{
              minWidth: 140,
              borderRadius: '12px',
              py: 1.5,
              px: 3,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem',
              borderColor: 'primary.main',
              color: 'primary.main',
              '&:hover': {
                bgcolor: 'primary.main',
                color: 'white',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease'
            }}
          >
            Stay Logged In
          </Button>

          <Button
            onClick={handleLogout}
            variant="contained"
            size="large"
            startIcon={<LogoutIcon />}
            sx={{
              minWidth: 140,
              borderRadius: '12px',
              py: 1.5,
              px: 3,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem',
              bgcolor: 'error.main',
              '&:hover': {
                bgcolor: 'error.dark',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease'
            }}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
