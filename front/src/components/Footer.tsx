import {
  Box,
  Container,
  Typography,
  Link,
  IconButton,
  Stack,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useSettings } from '../providers/SettingsProvider';

export default function Footer() {
  const theme = useTheme();
  const { t } = useSettings();

  const footerLinks = {
    company: [
      { label: t('footer.about'), path: '/about' },
      { label: t('footer.features'), path: '/features' },
      { label: t('footer.services'), path: '/services' },
      { label: t('footer.contact'), path: '/contact' },
    ],
    products: [
      { label: t('footer.smartLocks'), path: '/products' },
      { label: t('footer.accessories'), path: '/products?category=accessories' },
      { label: t('footer.installation'), path: '/services' },
      { label: t('footer.support'), path: '/support' },
    ],
    legal: [
      { label: t('footer.privacy'), path: '/privacy' },
      { label: t('footer.terms'), path: '/terms' },
      { label: t('footer.warranty'), path: '/warranty' },
      { label: t('footer.returns'), path: '/returns' },
    ],
  };

  const socialLinks = [
    { icon: <FacebookIcon />, url: 'https://www.facebook.com/profile.php?id=61580187693674', label: 'Facebook' },
    { icon: <TwitterIcon />, url: 'https://www.facebook.com/profile.php?id=61580187693674', label: 'Twitter' },
    { icon: <InstagramIcon />, url: 'https://www.instagram.com/qaissifiras/', label: 'Instagram' },
    { icon: <LinkedInIcon />, url: 'https://www.facebook.com/profile.php?id=61580187693674', label: 'LinkedIn' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: theme.palette.mode === 'dark' ? '#0a0a0a' : '#1a1a1a',
        color: 'white',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        {/* Main Footer Content */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {/* Company Info */}
            <Box sx={{ flex: '1 1 300px', minWidth: 300 }}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box 
                  component="img" 
                  src="/src/images/logo5.png" 
                  alt="SmartGate" 
                  sx={{ height: 40, width: 'auto', mr: 1.5 }} 
                />
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: 'white',
                    fontFamily: '"Poppins", "Inter", "Roboto", sans-serif',
                  }}
                >
                  SmartGate
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 3, lineHeight: 1.6 }}>
                {t('footer.description')}
              </Typography>
              
              {/* Contact Info */}
              <Stack spacing={1.5}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmailIcon sx={{ fontSize: 18, color: '#00d4aa' }} />
                  <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                    smartgate.service@outlook.com
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PhoneIcon sx={{ fontSize: 18, color: '#00d4aa' }} />
                  <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                    +972-054-3536044
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationIcon sx={{ fontSize: 18, color: '#00d4aa' }} />
                  <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                    Jerusalem, Israel
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Box>

          {/* Company Links */}
          <Box sx={{ flex: '1 1 200px', minWidth: 200 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'white' }}>
              {t('footer.company')}
            </Typography>
            <Stack spacing={1}>
              {footerLinks.company.map((link) => (
                <Link
                  key={link.path}
                  component={RouterLink}
                  to={link.path}
                  sx={{
                    color: '#b0b0b0',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    '&:hover': {
                      color: '#00d4aa',
                      textDecoration: 'none',
                    },
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Stack>
          </Box>

          {/* Products Links */}
          <Box sx={{ flex: '1 1 200px', minWidth: 200 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'white' }}>
              {t('footer.products')}
            </Typography>
            <Stack spacing={1}>
              {footerLinks.products.map((link) => (
                <Link
                  key={link.path}
                  component={RouterLink}
                  to={link.path}
                  sx={{
                    color: '#b0b0b0',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    '&:hover': {
                      color: '#00d4aa',
                      textDecoration: 'none',
                    },
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Stack>
          </Box>

          {/* Legal Links */}
          <Box sx={{ flex: '1 1 200px', minWidth: 200 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'white' }}>
              {t('footer.legal')}
            </Typography>
            <Stack spacing={1}>
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.path}
                  component={RouterLink}
                  to={link.path}
                  sx={{
                    color: '#b0b0b0',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    '&:hover': {
                      color: '#00d4aa',
                      textDecoration: 'none',
                    },
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Stack>
          </Box>

          {/* Social Media & Newsletter */}
          <Box sx={{ flex: '1 1 200px', minWidth: 200 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'white' }}>
              {t('footer.connect')}
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {socialLinks.map((social) => (
                  <IconButton
                    key={social.label}
                    component="a"
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: '#b0b0b0',
                      '&:hover': {
                        color: '#00d4aa',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.2s ease-in-out',
                    }}
                    aria-label={social.label}
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Box>
              <Typography variant="body2" sx={{ color: '#b0b0b0', fontSize: '0.75rem' }}>
                {t('footer.followUs')}
              </Typography>
            </Stack>
          </Box>
        </Box>

        <Divider sx={{ my: 4, borderColor: '#333' }} />

        {/* Bottom Footer */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Box component="img" src="/src/images/qaissifiras_qr.png" alt="Smart Gate" sx={{ height: 150, width: 'auto' }} />
            <Typography variant="body2" sx={{ color: '#b0b0b0', fontSize: '0.875rem', textAlign: 'center' }}>
              ❤️ {t('אתר זה נבנה באהבה ע"פ ')} <br />
              © {new Date().getFullYear()} SmartGate. {t('footer.allRightsReserved')}
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
