import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Stack,
  Fade,
  useTheme,
} from '@mui/material';
import {
  Construction as ConstructionIcon,
  Home as HomeIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ComingSoon() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  // Get page name from path
  const getPageName = (pathname: string) => {
    const path = pathname.substring(1);
    switch (path) {
      case 'about': return 'About Us';
      case 'features': return 'Features';
      case 'services': return 'Services';
      case 'support': return 'Support';
      case 'privacy': return 'Privacy Policy';
      case 'terms': return 'Terms of Service';
      case 'warranty': return 'Warranty Information';
      case 'returns': return 'Returns & Refunds';
      default: return 'Page';
    }
  };

  const pageName = getPageName(location.pathname);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, 
          ${theme.palette.primary.main}15 0%, 
          ${theme.palette.secondary.main}10 50%, 
          ${theme.palette.primary.main}05 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Fade in timeout={800}>
          <Paper
            elevation={12}
            sx={{
              p: { xs: 4, md: 6 },
              textAlign: 'center',
              borderRadius: '24px',
              background: `linear-gradient(135deg, 
                ${theme.palette.background.paper} 0%, 
                ${theme.palette.background.default} 100%)`,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: `0 20px 60px ${theme.palette.primary.main}20`,
            }}
          >
            <Stack spacing={4} alignItems="center">
              {/* Construction Icon */}
              <Box
                sx={{
                  position: 'relative',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    animation: 'pulse 2s ease-in-out infinite',
                    '@keyframes pulse': {
                      '0%, 100%': {
                        transform: 'scale(1)',
                        boxShadow: `0 0 0 0 ${theme.palette.primary.main}40`,
                      },
                      '50%': {
                        transform: 'scale(1.05)',
                        boxShadow: `0 0 0 20px ${theme.palette.primary.main}00`,
                      },
                    },
                  }}
                >
                  <ConstructionIcon
                    sx={{
                      fontSize: 60,
                      color: 'white',
                    }}
                  />
                </Box>
              </Box>

              {/* Main Content */}
              <Stack spacing={3} alignItems="center">
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 800,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    letterSpacing: '-0.02em',
                  }}
                >
                  Coming Soon
                </Typography>

                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 600,
                    color: 'text.primary',
                    fontSize: { xs: '1.5rem', md: '2rem' },
                  }}
                >
                  {pageName}
                </Typography>

                <Typography
                  variant="h6"
                  sx={{
                    color: 'text.secondary',
                    maxWidth: 600,
                    lineHeight: 1.6,
                    fontSize: { xs: '1rem', md: '1.25rem' },
                  }}
                >
                  We're working hard to bring you this page. Our team is crafting something amazing 
                  that will enhance your SmartGate experience. Stay tuned for exciting updates!
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    color: 'primary.main',
                    fontWeight: 600,
                    fontSize: '1.1rem',
                  }}
                >
                  🚀 This website is currently under construction
                </Typography>
              </Stack>

              {/* Action Buttons */}
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={2} 
                sx={{ mt: 4, width: '100%', maxWidth: 400 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<HomeIcon />}
                  onClick={() => navigate('/')}
                  sx={{
                    py: 1.5,
                    px: 4,
                    borderRadius: '12px',
                    fontWeight: 600,
                    fontSize: '1rem',
                    textTransform: 'none',
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    boxShadow: `0 8px 24px ${theme.palette.primary.main}40`,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: `0 12px 32px ${theme.palette.primary.main}50`,
                    },
                    transition: 'all 0.3s ease-in-out',
                  }}
                >
                  Go to Homepage
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<ArrowBackIcon />}
                  onClick={() => navigate(-1)}
                  sx={{
                    py: 1.5,
                    px: 4,
                    borderRadius: '12px',
                    fontWeight: 600,
                    fontSize: '1rem',
                    textTransform: 'none',
                    borderWidth: 2,
                    '&:hover': {
                      borderWidth: 2,
                      transform: 'translateY(-2px)',
                      backgroundColor: `${theme.palette.primary.main}10`,
                    },
                    transition: 'all 0.3s ease-in-out',
                  }}
                >
                  Go Back
                </Button>
              </Stack>

              {/* Footer Note */}
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  mt: 4,
                  fontStyle: 'italic',
                }}
              >
                Expected completion: Coming soon! We appreciate your patience.
              </Typography>
            </Stack>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
}
