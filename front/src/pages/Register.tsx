import { Box, Card, Container, Typography, Link, Button } from '@mui/material';

import RegisterForm from '../components/auth/RegisterForm';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import type { User } from '../types/auth';

export default function Register() {
  const navigate = useNavigate();
  function getRouteForUser(user: User) {
    if (user?.isAdmin) return '/admin';
    if (user?.isBusiness) return '/business';
    return '/';
  }

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <Container maxWidth="lg">
        <Card 
          sx={{ 
            borderRadius: '20px', 
            overflow: 'hidden', 
            boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
            border: '3px solid #000',
            bgcolor: 'black'
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, minHeight: '600px' }}>
            {/* Left Side - Illustration */}
            <Box
              sx={{
                bgcolor: '#f8f7ff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                p: { xs: 4, md: 6 },
                gap: 3,
                flex: 1,
                position: 'relative'
              }}
            >
              {/* Taskly Logo */}
              <Box sx={{ position: 'absolute', top: 20, left: 20 }}>
                <Typography variant="h6" fontWeight={700} sx={{ color: '#000' }}>
                  Taskly
                </Typography>
              </Box>
              
              {/* Language Selector */}
              <Box sx={{ position: 'absolute', top: 20, right: 20, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box component="img" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='15'%3E%3Crect width='20' height='15' fill='%23012169'/%3E%3Cpath d='M0 0l20 15M20 0L0 15' stroke='%23fff' stroke-width='3'/%3E%3Cpath d='M0 0l20 15M20 0L0 15' stroke='%23c8102e' stroke-width='2'/%3E%3Cpath d='M10 0v15M0 7.5h20' stroke='%23fff' stroke-width='5'/%3E%3Cpath d='M10 0v15M0 7.5h20' stroke='%23c8102e' stroke-width='3'/%3E%3C/svg%3E" alt="English" sx={{ width: 20, height: 15 }} />
                <Typography variant="body2" sx={{ color: '#000' }}>English</Typography>
              </Box>

              <Typography variant="h3" fontWeight={800} sx={{ lineHeight: 1.2, color: '#000', textAlign: 'center', mb: 4 }}>
                Stay Organized, Achieve More
                <br />
                With Taskly.
              </Typography>
              
              {/* Illustration placeholder */}
              <Box 
                sx={{ 
                  width: '100%', 
                  maxWidth: '400px', 
                  height: '300px',
                  bgcolor: '#e8e7ff',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Simple illustration representation */}
                <Box sx={{ textAlign: 'center' }}>
                  <Box 
                    sx={{ 
                      width: 80, 
                      height: 80, 
                      bgcolor: '#6c63ff', 
                      borderRadius: '50%', 
                      mx: 'auto', 
                      mb: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Typography variant="h4" sx={{ color: 'white' }}>👤</Typography>
                  </Box>
                  <Typography variant="body1" sx={{ color: '#6c63ff', fontWeight: 600 }}>
                    WELCOME
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Right Side - Form */}
            <Box sx={{ p: { xs: 4, md: 6 }, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              {/* Tab Buttons */}
              <Box sx={{ display: 'flex', gap: 0, mb: 4, bgcolor: '#f5f5f5', borderRadius: '12px', p: 1 }}>
                <Button 
                  component={RouterLink} 
                  to="/login" 
                  variant="text" 
                  sx={{ 
                    borderRadius: '8px', 
                    color: '#666',
                    flex: 1,
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 600,
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
                  }}
                >
                  Login
                </Button>
                <Button 
                  variant="contained" 
                  disableElevation 
                  sx={{ 
                    borderRadius: '8px', 
                    bgcolor: '#000', 
                    color: 'white',
                    flex: 1,
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 600,
                    '&:hover': { bgcolor: '#2d2d2d' } 
                  }}
                >
                  Register
                </Button>
              </Box>
              
              <Typography variant="h5" fontWeight={600} sx={{ mb: 4, color: '#000' }}>
                Let's create your account.
              </Typography>
              
              <RegisterForm onSuccess={(u: User) => navigate(getRouteForUser(u))} />
              
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{' '}
                  <Link component={RouterLink} to="/login" sx={{ color: '#6c63ff', fontWeight: 600, textDecoration: 'none' }}>
                    Login
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Card>
      </Container>
    </Box>
  );
}


