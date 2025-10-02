
import { useState } from 'react';
import { Box, Container, Typography, Card, CardContent, Button } from '@mui/material';
import Navbar from '../components/Navbar';
import AuthModal from '../components/auth/AuthModal';

const services = [
  {
    title: "שירות מתקין מוסמך",
    description: "התקנה מקצועית על ידי טכנאים מוסמכים עם כיסוי אחריות.",
    price: "החל מ־ 99₪",
    features: ["טכנאים מוסמכים", "כיסוי אחריות", "שירות באותו יום", "ייעוץ חינם"]
  },
  {
    title: "תחזוקה ותמיכה",
    description: "תחזוקה שוטפת ותמיכה טכנית 24/7 לכל צרכי המנעול החכם.",
    price: "החל מ־ 49₪ לחודש",
    features: ["תמיכה 24/7", "תחזוקה סדירה", "עדכוני תוכנה", "אבחון מרחוק"]
  },
  {
    title: "אינטגרציה לבית חכם",
    description: "הקמה מלאה של בית חכם ושילוב עם מערכות קיימות.",
    price: "החל מ־ 199₪",
    features: ["שילוב מערכות", "תצורה מותאמת אישית", "הדרכה", "תמיכה מתמשכת"]
  },
  {
    title: " ייעוץ אבטחה מקצועי",
    description: "הערכת אבטחה מקצועית והמלצות לנכס שלך.",
    price: "החל מ־ 149₪",
    features: ["ביקורת אבטחה", "הערכת סיכונים", "פתרונות מותאמים", "תכנית יישום"]
  }
];

export default function Services() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  const openAuthModal = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar onLoginClick={() => openAuthModal('login')} onRegisterClick={() => openAuthModal('register')} />
      
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h2" fontWeight={ 700} gutterBottom sx={{ color: 'text.primary' }}>
            השירותים שלנו
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            מגוון שירותים למנעולים חכמים כדי להבטיח אבטחה ושקט נפשי.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(2, 1fr)',
              lg: 'repeat(4, 1fr)',
              textAlign: 'center',
              justifyContent: 'center',
              alignItems: 'center',
            },
            gap: 4,
          }}
        >
          {services.map((service, index) => (
            <Card
              key={index}
              sx={{
                height: '100%',
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                backgroundColor: 'background.default',
                textAlign: 'center',
                justifyContent: 'center',
              alignItems: 'center',
                '&:hover': {
                  transform: 'translateY(-18px)',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
                },
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h4" fontWeight={600} gutterBottom sx={{ color: 'text.primary' ,textAlign: 'center',justifyContent: 'center',alignItems: 'center'}} fontSize={{ xs: '1.2rem', md: '2.4rem' }} fontFamily='"Inter", "Roboto", sans-serif' align='center'>
                  {service.title}
                  
                </Typography>
                
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6,textAlign: 'center',justifyContent: 'center',alignItems: 'center'}}>
                  {service.description}
                </Typography>

                  <Typography variant="h5" fontWeight={700} color="primary" sx={{ mb: 3 ,textAlign: 'center',justifyContent: 'center',alignItems: 'center'}}>
                  {service.price}
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom sx={{ color: 'text.primary' ,textAlign: 'center',justifyContent: 'center',alignItems: 'center'}}>
                    מה כולל השירות:
                  </Typography>
                  {service.features.map((feature, featureIndex) => (
                    <Box key={featureIndex} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: '#00d4aa', mr: 1 ,textAlign: 'center',justifyContent: 'center',alignItems: 'center'}}>✓</Typography>
                      <Typography variant="body2" color="text.secondary"  sx={{textAlign: 'center'}}>
                        {feature}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: '#00d4aa',
                    color: 'white',
                    borderRadius: '12px',
                    py: 1.5,
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: '#00b894',
                    },
                  }}
                >
                  התחל עכשיו
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>

      {/* Auth Modal */}
      <AuthModal 
        open={authModalOpen}
        onClose={closeAuthModal}
        initialMode={authModalMode}
      />
    </Box>
  );
}
