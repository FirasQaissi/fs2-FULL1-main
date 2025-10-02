import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  Alert,
  Fade,
  useTheme,
  IconButton,
} from '@mui/material';
// Avoid Grid type issues on Vercel; use Box with CSS grid
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Send as SendIcon,
  WhatsApp as WhatsAppIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
} from '@mui/icons-material';
import { customerMessageService } from '../services/customerMessageService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Contact() {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Send message to backend
      const response = await customerMessageService.sendMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
      });

      if (response.success) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
      } else {
        setError('Failed to send message. Please try again.');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <EmailIcon />,
      title: 'Email',
      value: 'smartgate.service@outlook.com',
      action: 'mailto:smartgate.service@outlook.com',
    },
    {
      icon: <PhoneIcon />,
      title: 'Phone',
      value: '+972-054-3536044',
      action: 'tel:+972543536044',
    },
    {
      icon: <LocationIcon />,
      title: 'Location',
      value: 'Jerusalem, Israel',
      action: null,
    },
  ];

  const socialLinks = [
    {
      icon: <WhatsAppIcon />,
      label: 'WhatsApp',
      url: 'https://wa.me/972543536044',
      color: '#25D366',
    },
    {
      icon: <FacebookIcon />,
      label: 'Facebook',
      url: 'https://www.facebook.com/profile.php?id=61580187693674',
      color: '#1877F2',
    },
    {
      icon: <InstagramIcon />,
      label: 'Instagram',
      url: 'https://www.instagram.com/qaissifiras/',
      color: '#E4405F',
    },
  ];

  return (
    <>
      <Navbar />
       <Box
         sx={{
           minHeight: '100vh',
           background: `linear-gradient(135deg, 
             ${theme.palette.primary.main}08 0%, 
             ${theme.palette.secondary.main}05 50%, 
             ${theme.palette.primary.main}03 100%)`,
           pt: { xs: 10, md: 12 },
           pb: 8,
           direction: 'rtl', // RTL for Hebrew
         }}
       >
        <Container maxWidth="lg">
          {/* Header */}
          <Fade in timeout={600}>
            <Box sx={{ textAlign: 'center', mb: 8 }}>
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
                  mb: 2,
                }}
              >
                שלח לנו פניה ונענה לך בהקדם
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: 'text.secondary',
                  maxWidth: 600,
                  mx: 'auto',
                  lineHeight: 1.6,
                }}
              >
               במידה ויש לך שאלות בנוגע למנעולים שלנו, נשמח לעזור לך.
              </Typography>
            </Box>
          </Fade>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 6 }}>
            {/* Contact Form */}
            <Box>
              <Fade in timeout={800}>
                <Paper
                  elevation={8}
                  sx={{
                    p: { xs: 4, md: 6 },
                    borderRadius: '24px',
                    background: `linear-gradient(135deg, 
                      ${theme.palette.background.paper} 0%, 
                      ${theme.palette.background.default} 100%)`,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      mb: 4,
                      color: 'text.primary',
                    }}
                  >
                   שלח לנו פניה ונענה לך בהקדם
                  </Typography>

                  {success && (
                    <Alert
                      severity="success"
                      sx={{ mb: 3, borderRadius: '12px' }}
                      onClose={() => setSuccess(false)}
                    >
                     תודה על הפניה שלך, נענה לך בהקדם
                    </Alert>
                  )}

                  {error && (
                    <Alert
                      severity="error"
                      sx={{ mb: 3, borderRadius: '12px' }}
                      onClose={() => setError(null)}
                    >
                      {error}
                    </Alert>
                  )}

                   <Box component="form" onSubmit={handleSubmit} dir="rtl">
                     <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                       <Box>
                         <TextField
                           fullWidth
                           label="שם מלא"
                           name="name"
                           value={formData.name}
                           onChange={handleInputChange}
                           required
                           variant="outlined"
                           sx={{
                             '& .MuiOutlinedInput-root': {
                               borderRadius: '12px',
                             },
                           }}
                         />
                       </Box>
                      <Box>
                        <TextField
                          fullWidth
                          label="אימייל"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                            },
                          }}
                        />
                      </Box>
                      <Box>
                        <TextField
                          fullWidth
                          label="טלפון"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                            },
                          }}
                        />
                      </Box>
                      <Box>
                        <TextField
                          fullWidth
                          label="נושא"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                            },
                          }}
                        />
                      </Box>
                      <Box sx={{ gridColumn: '1 / -1' }}>
                        <TextField
                          fullWidth
                          label="הודעה"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          multiline
                          rows={6}
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                            },
                          }}
                        />
                      </Box>
                      <Box sx={{ gridColumn: '1 / -1' }}>
                        <Button
                          type="submit"
                          variant="contained"
                          size="large"
                          disabled={loading}
                          startIcon={<SendIcon />}
                          sx={{
                            py: 2,
                            px: 6,
                            borderRadius: '12px',
                            fontWeight: 600,
                            fontSize: '1.1rem',
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
                          {loading ? 'שולח...' : 'שלח פניה'}
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </Fade>
            </Box>

            {/* Contact Info */}
            <Box>
              <Stack spacing={4}>
                {/* Contact Information */}
                <Fade in timeout={1000}>
                  <Paper
                    elevation={8}
                    sx={{
                      p: 4,
                      borderRadius: '24px',
                      background: `linear-gradient(135deg, 
                        ${theme.palette.primary.main} 0%, 
                        ${theme.palette.secondary.main} 100%)`,
                      color: 'white',
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        mb: 3,
                      }}
                    >
                      פרטי פניה
                    </Typography>

                    <Stack spacing={3}>
                      {contactInfo.map((item, index) => (
                        <Box
                          key={index}
                          component={item.action ? 'a' : 'div'}
                          href={item.action || undefined}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            color: 'inherit',
                            textDecoration: 'none',
                            cursor: item.action ? 'pointer' : 'default',
                            '&:hover': item.action ? {
                              opacity: 0.8,
                            } : {},
                          }}
                        >
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: '12px',
                              backgroundColor: 'rgba(255, 255, 255, 0.2)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            {React.cloneElement(item.icon, { sx: { fontSize: 24 } })}
                          </Box>
                          <Box>
                            <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
                              {item.title}
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              {item.value}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  </Paper>
                </Fade>

                {/* Social Media */}
                <Fade in timeout={1200}>
                  <Paper
                    elevation={8}
                    sx={{
                      p: 4,
                      borderRadius: '24px',
                      background: `linear-gradient(135deg, 
                        ${theme.palette.background.paper} 0%, 
                        ${theme.palette.background.default} 100%)`,
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        mb: 3,
                        color: 'text.primary',
                      }}
                    >
                        עקבו אחרינו
                    </Typography>

                    <Stack direction="row" spacing={2}>
                      {socialLinks.map((social, index) => (
                        <IconButton
                          key={index}
                          component="a"
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            width: 56,
                            height: 56,
                            backgroundColor: `${social.color}15`,
                            color: social.color,
                            '&:hover': {
                              backgroundColor: social.color,
                              color: 'white',
                              transform: 'translateY(-4px)',
                            },
                            transition: 'all 0.3s ease-in-out',
                          }}
                        >
                          {social.icon}
                        </IconButton>
                      ))}
                    </Stack>
                  </Paper>
                </Fade>
              </Stack>
            </Box>
          </Box>
        </Container>
      </Box>
      <Footer />
    </>
  );
}
