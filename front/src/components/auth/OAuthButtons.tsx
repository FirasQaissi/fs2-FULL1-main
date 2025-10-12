import { useState } from 'react';
import { Box, Button, Stack, Typography, CircularProgress } from '@mui/material';
import { oauthService } from '../../services/oauthService';
import { useSettings } from '../../providers/SettingsProvider';
import { useNavigate } from 'react-router-dom';
import { authStorage } from '../../services/authStorage';

// Original Google Icon Component
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

interface OAuthButtonsProps {
  onError?: (error: string) => void;
  onClose?: () => void;
}

export default function OAuthButtons({ onError, onClose }: OAuthButtonsProps) {
  const { t } = useSettings();
  const [loading, setLoading] = useState<'google' | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const navigate = useNavigate();

  const handleOAuthClick = async (provider: 'google') => {
    try {
      setLoading(provider);
      setLoadingMessage('Waking up server...');
      console.log(`Starting ${provider} OAuth flow...`);

      // ✅ Try popup first, fall back to full-page redirect
      try {
        console.log('Attempting popup OAuth flow...');
        setLoadingMessage('Opening authentication...');
        const result = await oauthService.openOAuthPopup(provider);

        if (result.success && result.token && result.user) {
          console.log('✅ OAuth success - closing popup and redirecting...');
          authStorage.setToken(result.token as string);
          authStorage.setUser(result.user as unknown as Record<string, unknown>);
          setLoading(null);
          
          // ✅ Close the login/register popup first
          if (onClose) {
            console.log('🔒 Closing login popup...');
            onClose();
          } else {
            console.log('⚠️ onClose function not provided');
          }
          
          // Redirect to home page (or dashboard if user is admin/business)
          const user = result.user as { isAdmin?: boolean; isBusiness?: boolean };
          console.log('🔄 Redirecting user:', { isAdmin: user.isAdmin, isBusiness: user.isBusiness });
          if (user.isAdmin) {
            navigate('/admin');
          } else if (user.isBusiness) {
            navigate('/business');
          } else {
            navigate('/');
          }
          return;
        }

        // If popup failed, try full-page redirect
        throw new Error(result.error || 'Popup authentication failed');

      } catch (popupError) {
        console.log('❌ Popup flow failed, falling back to full-page redirect...');
        console.error('Popup error:', popupError);
        
        // Use full-page redirect as fallback
        setLoadingMessage('Preparing redirect...');
        console.log('🔄 Using full-page redirect - popup will close automatically');
        await oauthService.initiateGoogleAuth();
        // initiateGoogleAuth will redirect the page, so we won't reach here
        return;
      }

    } catch (error) {
      console.error(`${provider} OAuth error:`, error);
      setLoading(null);
      setLoadingMessage('');
      onError?.(error instanceof Error ? error.message : `${provider} authentication failed`);
    }
  };

  const OAuthButton = ({
    provider,
    icon,
    label,
    color
  }: {
    provider: 'google';
    icon: React.ReactNode;
    label: string;
    color: string;
  }) => (
    <Button
      variant="outlined"
      fullWidth
      onClick={() => handleOAuthClick(provider)}
      disabled={loading !== null}
      sx={{
        borderColor: color,
        color: color,
        py: 1.5,
        borderRadius: '12px',
        textTransform: 'none',
        fontSize: '1rem',
        fontWeight: 600,
        borderWidth: '2px',
        '&:hover': {
          backgroundColor: `${color}15`,
          borderColor: color,
          transform: 'translateY(-1px)',
          boxShadow: `0 4px 12px ${color}30`,
        },
        '&:disabled': {
          borderColor: '#e0e0e0',
          color: '#9e9e9e',
        },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        transition: 'all 0.2s ease-in-out'
      }}
    >
      {loading === provider ? (
        <>
          <CircularProgress size={20} sx={{ color: color, mr: 1 }} />
          <Box component="span" sx={{ fontSize: '0.875rem' }}>
            {loadingMessage || 'Loading...'}
          </Box>
        </>
      ) : (
        <>
          {icon} {label}
        </>
      )}
    </Button>
  );

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="body2" sx={{ textAlign: 'center', mb: 2, color: '#6b7280' }}>
        {t('') || ''}
      </Typography>
      <Stack spacing={2}>
        <OAuthButton
          provider="google"
          icon={<GoogleIcon />}
          label={t('') || 'Continue with Google'}
          color="#1976d2"
        />
      </Stack>
      <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 2, color: '#9e9e9e' }}>
        {t('') || "We'll create your account if you don't have one"}
      </Typography>
    </Box>
  );
}