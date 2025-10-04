import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { authStorage } from '../services/authStorage';
import { useSettings } from '../providers/SettingsProvider';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useSettings();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const token = searchParams.get('token');
        const userParam = searchParams.get('user');

        if (!token || !userParam) {
          setError('Missing authentication data');
          return;
        }

        // Parse user data
        const user = JSON.parse(decodeURIComponent(userParam));

        // Store authentication data
        authStorage.setToken(token);
        authStorage.setUser(user);

        console.log('OAuth authentication successful:', {
          userId: user._id,
          email: user.email,
          name: user.name
        });

        // Redirect to dashboard or home immediately
        navigate('/dashboard');

      } catch (err) {
        console.error('OAuth callback error:', err);
        setError('Failed to process authentication');
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate]);

  if (error) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        p: 3
      }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {t('auth.errorMessage') || 'We encountered an issue while signing you in. Please try again.'}
        </Typography>
        <button 
          onClick={() => navigate('/')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {t('auth.goHome') || 'Go to Home'}
        </button>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      p: 3
    }}>
      <CircularProgress size={60} sx={{ mb: 3 }} />
      <Typography variant="h5" sx={{ mb: 2, textAlign: 'center' }}>
        {t('auth.signingIn') || 'Signing you in...'}
      </Typography>
      <Typography variant="body1" sx={{ textAlign: 'center', color: '#6b7280' }}>
        {t('auth.pleaseWait') || 'Please wait while we complete your authentication.'}
      </Typography>
    </Box>
  );
}
