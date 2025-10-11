import { useState } from 'react';
import { Box, Button, Stack, Typography, CircularProgress } from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import { oauthService } from '../../services/oauthService';
import { useSettings } from '../../providers/SettingsProvider';
import { useNavigate } from 'react-router-dom';
import { authStorage } from '../../services/authStorage';

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
          authStorage.setToken(result.token as string);
          authStorage.setUser(result.user as unknown as Record<string, unknown>);
          setLoading(null);
          
          // ✅ Close the login/register popup first
          if (onClose) {
            onClose();
          }
          
          // Redirect to home page (or dashboard if user is admin/business)
          const user = result.user as { isAdmin?: boolean; isBusiness?: boolean };
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
        console.log('Popup flow failed, falling back to full-page redirect...');
        console.error('Popup error:', popupError);
        
        // Use full-page redirect as fallback
        setLoadingMessage('Preparing redirect...');
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
        '&:hover': {
          backgroundColor: `${color}10`,
          borderColor: color,
        },
        '&:disabled': {
          borderColor: '#e0e0e0',
          color: '#9e9e9e',
        },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1
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
          color="#4285F4"
        />
      </Stack>
      <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 2, color: '#9e9e9e' }}>
        {t('') || "We'll create your account if you don't have one"}
      </Typography>
    </Box>
  );
}