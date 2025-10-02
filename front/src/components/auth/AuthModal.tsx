import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  Box, 
  Typography, 
  Button, 
  IconButton,
  Fade,
  Backdrop,
  Select,
  MenuItem
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useSettings } from '../../providers/SettingsProvider';
import { useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';

import RegisterForm from './RegisterForm';
import type { User } from '../../types/auth';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export default function AuthModal({ open, onClose, initialMode = 'login' }: AuthModalProps) {
  const { t, setLanguage, lang } = useSettings();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const navigate = useNavigate();

  function getRouteForUser(user: User) {
    if (user?.isAdmin) return '/admin';
    if (user?.isBusiness) return '/business';
    return '/';
  }

  const handleSuccess = (user: User) => {
    onClose();
    navigate(getRouteForUser(user));
  };

  const handleModeSwitch = (newMode: 'login' | 'register') => {
    setMode(newMode);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '20px',
          border: '3px solid #000',
          bgcolor: 'white',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          overflow: 'hidden',
          maxWidth: '900px',
          margin: 2
        }
      }}
      BackdropComponent={Backdrop}
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(102, 126, 234, 0.4)',
          backdropFilter: 'blur(8px)'
        }
      }}
      TransitionComponent={Fade}
      transitionDuration={300}
    >
      <DialogContent sx={{ p: 0, position: 'relative' }}>
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            zIndex: 10,
            bgcolor: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(10px)',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,1)',
            }
          }}
        >
          <CloseIcon />
        </IconButton>

        <Box sx={{ display: 'flex', minHeight: '600px' }}>
          {/* Left Side - Illustration */}
          <Box
            sx={{
              bgcolor: '#f8f7ff',
              display: { xs: 'none', md: 'flex' },
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              p: 6,
              gap: 3,
              flex: 1,
              position: 'relative'
            }}
            
          >
            {/* Smart Gate Icon */}
          <Box id="logo1" sx={{ position: 'absolute', top: 8, left: 20, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box component="img" src="/src/images/logo5.png" alt="Smart Gate" sx={{ height: 28, width: 'auto' }} />
            <Typography variant="h6" sx={{ fontWeight: 200, color: 'black', fontSize: '16px', fontFamily: 'cursive' }}>
              SmartGate
            </Typography>
          </Box>

        
            {/* Language Selector inside modal */}
            <Box sx={{ position: 'absolute', top: 20, right: 20 }}>
              <Select
                size="small"
                value={lang}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'ar' | 'he')}
                variant="outlined"
                sx={{
                  minWidth: 80,
                  bgcolor: 'rgba(255,255,255,0.9)'
                }}
              >
                <MenuItem value="en">EN</MenuItem>
                <MenuItem value="ar">AR</MenuItem>
                <MenuItem value="he">HE</MenuItem>
              </Select>
            </Box>

            <Typography variant="h3" fontWeight={800} sx={{ lineHeight: 1.2, color: '#000', textAlign: 'center', mb: 4 }}>
              {t('home.cta')}
            </Typography>
            
            {/* Illustration */}
            <Box 
              sx={{ 
                width: '100%', 
                maxWidth: '350px', 
                height: '280px',
                bgcolor: '#e8e7ff',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Animated illustration */}
              <Box sx={{ textAlign: 'center', position: 'relative' }}>
                {/* Phone mockup */}
                <Box 
                  sx={{ 
                    width: 120, 
                    height: 200, 
                    bgcolor: '#fff', 
                    borderRadius: 3,
                    mx: 'auto', 
                    mb: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 32px rgba(108, 99, 255, 0.3)',
                    border: '2px solid #6c63ff',
                    position: 'relative'
                  }}
                >
                  {/* Screen */}
                  <Box sx={{ width: 80, height: 120, bgcolor: '#f0f0ff', borderRadius: 1, mb: 2 }}>
                    <Box sx={{ p: 1, textAlign: 'center' }}>
                      <Box 
                        sx={{ 
                          width: 40, 
                          height: 40, 
                          bgcolor: '#6c63ff', 
                          borderRadius: '50%', 
                          mx: 'auto', 
                          mb: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Typography variant="h6" sx={{ color: 'white' }}>👤</Typography>
                      </Box>
                      <Typography variant="caption" sx={{ color: '#6c63ff', fontWeight: 600, fontSize: '8px' }}>
                        WELCOME
                      </Typography>
                    </Box>
                  </Box>
                  
                  {/* Login button on phone */}
                  <Box sx={{ 
                    width: 60, 
                    height: 20, 
                    bgcolor: '#6c63ff', 
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Typography variant="caption" sx={{ color: 'white', fontSize: '8px', fontWeight: 600 }}>
                      LOGIN
                    </Typography>
                  </Box>
                </Box>

                {/* Character illustration */}
                <Box sx={{ position: 'absolute', left: -40, bottom: -20 }}>
                  <Box 
                    sx={{ 
                      width: 60, 
                      height: 80, 
                      bgcolor: '#6c63ff', 
                      borderRadius: '30px 30px 0 0',
                      position: 'relative'
                    }}
                  >
                    {/* Head */}
                    <Box 
                      sx={{ 
                        width: 30, 
                        height: 30, 
                        bgcolor: '#fdbcb4', 
                        borderRadius: '50%',
                        position: 'absolute',
                        top: -15,
                        left: '50%',
                        transform: 'translateX(-50%)'
                      }}
                    />
                  </Box>
                </Box>

                {/* Decorative elements */}
                <Box sx={{ position: 'absolute', top: 20, right: 20 }}>
                  <Box sx={{ width: 8, height: 8, bgcolor: '#6c63ff', borderRadius: '50%', mb: 1 }} />
                  <Box sx={{ width: 6, height: 6, bgcolor: '#a29bfe', borderRadius: '50%', ml: 1, mb: 1 }} />
                  <Box sx={{ width: 4, height: 4, bgcolor: '#fd79a8', borderRadius: '50%' }} />
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Right Side - Form */}
          <Box sx={{ p: { xs: 4, md: 6 }, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {/* Tab Buttons */}
            <Box sx={{ display: 'flex', gap: 0, mb: 4, bgcolor: '#f5f5f5', borderRadius: '12px', p: 1 }}>
              <Button 
                onClick={() => handleModeSwitch('login')}
                variant={mode === 'login' ? 'contained' : 'text'}
                disableElevation 
                sx={{ 
                  borderRadius: '8px', 
                  bgcolor: mode === 'login' ? '#000' : 'transparent',
                  color: mode === 'login' ? 'white' : '#666',
                  flex: 1,
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': { 
                    bgcolor: mode === 'login' ? '#2d2d2d' : 'rgba(0,0,0,0.04)'
                  } 
                }}
              >
                {t('auth.login')}
              </Button>
              <Button 
                onClick={() => handleModeSwitch('register')}
                variant={mode === 'register' ? 'contained' : 'text'}
                disableElevation 
                sx={{ 
                  borderRadius: '8px', 
                  bgcolor: mode === 'register' ? '#000' : 'transparent',
                  color: mode === 'register' ? 'white' : '#666',
                  flex: 1,
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': { 
                    bgcolor: mode === 'register' ? '#2d2d2d' : 'rgba(0,0,0,0.04)'
                  } 
                }}
              >
                {t('auth.register')}
              </Button>
            </Box>
            
            <Typography variant="h5" fontWeight={600} sx={{ mb: 4, color: '#000' }}>
              {mode === 'login' ? t('auth.loginTitle') : t('auth.registerTitle')}
            </Typography>
            
            {mode === 'login' ? (
              <LoginForm onSuccess={handleSuccess} />
            ) : (
              <RegisterForm onSuccess={handleSuccess} />
            )}
            
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                <Button
                  onClick={() => handleModeSwitch(mode === 'login' ? 'register' : 'login')}
                  sx={{ 
                    color: '#6c63ff', 
                    fontWeight: 600, 
                    textDecoration: 'none',
                    textTransform: 'none',
                    p: 0,
                    minWidth: 'auto',
                    '&:hover': {
                      backgroundColor: 'transparent',
                      textDecoration: 'underline'
                    }
                  }}
                >
                  {mode === 'login' ? 'Register' : 'Login'}
                </Button>
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
