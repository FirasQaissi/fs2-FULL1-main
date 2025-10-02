import { useState, useEffect } from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';

export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    // Hide the loading screen after 3 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'black',
        display: 'flex',
        borderRadius: '100px solid #white',
        border: '10px solid #000',
        boxShadow: '0 20px 60px rgba(14, 211, 66, 0.56)',
        padding: '10px',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        animation: 'fadeOut 0.5s ease-in-out 2.5s forwards',
        '@keyframes fadeOut': {
          '0%': { opacity: 1 },
          '100%': { opacity:0, visibility: 'hidden' }
        }
      }}
    >
      <Box
        component="img"
        src="/images/sec (1).gif"
        alt="Loading..."
        
        sx={{
          width: 'auto',
          height: 'auto',
          maxWidth: isMobile ? '90vw' : '800px',
          maxHeight: isMobile ? '90vh' : '800px',
          backgroundColor: 'transparent',
          borderRadius: '100px solid white',
          boxShadow: '0 20px 60px rgba(17, 166, 57, 0.97)',
          animation: 'smoothPulse 2s ease-in-out infinite',
          '@keyframes smoothPulse': {
            '0%, 100%': {
              transform: 'scale(0.95)',
              opacity: 0.9
            },
            '50%': {
              transform: 'scale(1.05)',
              opacity: 1
            }
          }
        }}
      />
    </Box>
  );
}
