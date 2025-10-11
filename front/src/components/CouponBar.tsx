import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton
} from '@mui/material';
import {
  Close as CloseIcon,
  LocalOffer as OfferIcon,
  Timer as TimerIcon
} from '@mui/icons-material';
import { useSettings } from '../providers/SettingsProvider';

export default function CouponBar() {
  const { t } = useSettings();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Set countdown to 7 days from now
    const targetTime = new Date().getTime() + (7 * 24 * 60 * 60 * 1000);
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText('SMARTGATE20');
    // You could add a toast notification here
  };

  if (!isVisible) return null;

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
        color: 'white',
        py: 1.5,
        px: 2,
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        animation: 'slideDown 0.5s ease-out',
        '@keyframes slideDown': {
          'from': {
            transform: 'translateY(-100%)',
            opacity: 0
          },
          'to': {
            transform: 'translateY(0)',
            opacity: 1
          }
        }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '1200px',
          mx: 'auto',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1, sm: 0 }
        }}
      >
        {/* Left side - Offer info */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <OfferIcon sx={{ fontSize: 24, color: 'white' }} />
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '1rem', sm: '1.1rem' },
                lineHeight: 1.2
              }}
            >
              🎉 {t('coupon.specialDiscount')}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                opacity: 0.9,
                fontSize: { xs: '0.8rem', sm: '0.9rem' }
              }}
            >
              {t('coupon.code')}: SMARTGATE20
            </Typography>
          </Box>
        </Box>

        {/* Center - Countdown timer */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TimerIcon sx={{ fontSize: 20 }} />
          <Typography variant="body2" sx={{ fontWeight: 600, mr: 1 }}>
            הזמן שנותר:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {Object.entries(timeLeft).map(([unit, value]) => (
              <Box
                key={unit}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: 40,
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  p: 0.5,
                  backdropFilter: 'blur(10px)'
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    lineHeight: 1
                  }}
                >
                  {value.toString().padStart(2, '0')}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: '0.7rem',
                    opacity: 0.8,
                    textTransform: 'uppercase'
                  }}
                >
                  {unit === 'days' ? 'ימים' : 
                   unit === 'hours' ? 'שעות' : 
                   unit === 'minutes' ? 'דקות' : 'שניות'}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Right side - Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            variant="contained"
            onClick={handleCopyCode}
            sx={{
              backgroundColor: 'white',
              color: '#ff6b6b',
              fontWeight: 600,
              borderRadius: '20px',
              px: 2,
              py: 0.5,
              textTransform: 'none',
              fontSize: { xs: '0.8rem', sm: '0.9rem' },
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                transform: 'scale(1.05)'
              },
              transition: 'all 0.2s ease'
            }}
          >
            העתק קוד
          </Button>
          <IconButton
            onClick={handleClose}
            size="small"
            sx={{
              color: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.3)'
              }
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
