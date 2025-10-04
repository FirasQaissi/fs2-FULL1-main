import { useState } from 'react';
import { Box, Button, Stack, Typography, CircularProgress } from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import { oauthService } from '../../services/oauthService';
import { authStorage } from '../../services/authStorage';
import { useSettings } from '../../providers/SettingsProvider';
import type { User } from '../../types/auth';

interface OAuthButtonsProps {
  onSuccess?: (user: User) => void;
  onError?: (error: string) => void;
}

export default function OAuthButtons({ onSuccess, onError }: OAuthButtonsProps) {
  const { t } = useSettings();
  const [loading, setLoading] = useState<'google' | null>(null);

  const handleOAuthClick = async (provider: 'google') => {
    try {
      setLoading(provider);
      console.log(`Starting ${provider} OAuth flow...`);

      const result = await oauthService.initiateGoogleAuth();
      
      if (result.success && result.user && result.token) {
        // Store authentication data
        authStorage.setToken(result.token);
        authStorage.setUser(result.user as User);
        
        console.log('OAuth authentication successful:', {
          userId: (result.user as User)._id,
          email: (result.user as User).email,
          name: (result.user as User).name
        });
        
        onSuccess?.(result.user as User);
      } else {
        throw new Error(result.error || 'Authentication failed');
      }

    } catch (error) {
      console.error(`${provider} OAuth error:`, error);
      onError?.(error instanceof Error ? error.message : `${provider} authentication failed`);
    } finally {
      setLoading(null);
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
        <CircularProgress size={24} sx={{ color: color }} />
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
        {t('auth.orContinueWith') || 'Or continue with'}
      </Typography>
      <Stack spacing={2}>
        <OAuthButton
          provider="google"
          icon={<GoogleIcon />}
          label={t('auth.continueWithGoogle') || 'Continue with Google'}
          color="#4285F4"
        />
      </Stack>
      <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 2, color: '#9e9e9e' }}>
        {t('auth.oauthInfo') || "We'll create your account if you don't have one"}
      </Typography>
    </Box>
  );
}