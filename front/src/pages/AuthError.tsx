import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Typography, Alert, Button } from '@mui/material';
import { useSettings } from '../providers/SettingsProvider';

export default function AuthError() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useSettings();
  const [errorMessage, setErrorMessage] = useState<string>('Authentication failed');

  useEffect(() => {
    const message = searchParams.get('message');
    if (message) {
      setErrorMessage(decodeURIComponent(message));
    }
  }, [searchParams]);

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      p: 3
    }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
        {t('auth.errorTitle') || 'Authentication Error'}
      </Typography>
      
      <Alert severity="error" sx={{ mb: 3, maxWidth: 500 }}>
        {errorMessage}
      </Alert>
      
      <Typography variant="body1" sx={{ mb: 3, textAlign: 'center', color: '#6b7280' }}>
        {t('auth.errorMessage') || 'We encountered an issue while signing you in. Please try again.'}
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/')}
          sx={{ minWidth: 120 }}
        >
          {t('auth.goHome') || 'Go to Home'}
        </Button>
        
        <Button 
          variant="contained" 
          onClick={() => navigate('/login')}
          sx={{ minWidth: 120 }}
        >
          {t('auth.tryAgain') || 'Try Again'}
        </Button>
      </Box>
    </Box>
  );
}
