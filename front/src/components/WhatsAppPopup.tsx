import React, { useState } from 'react';
import {
  Box,
  Fab,
  Popover,
  Typography,
  Button,
  Paper,
  IconButton} from '@mui/material';
import {
  WhatsApp as WhatsAppIcon,
  Message as MessageIcon,
  Phone as PhoneIcon,
  Close as CloseIcon
} from '@mui/icons-material';

export default function WhatsAppPopup() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const phoneNumber = '+972543536044';
  
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMessage = () => {
    const message = encodeURIComponent('שלום! אני מעוניין לקבל מידע נוסף על המנעולים החכמים שלכם.');
    window.open(`https://wa.me/${phoneNumber.replace('+', '')}?text=${message}`, '_blank');
    handleClose();
  };

  const handleCall = () => {
    window.open(`tel:${phoneNumber}`, '_self');
    handleClose();
  };

  const open = Boolean(anchorEl);

  return (
    <>
      {/* WhatsApp Floating Button */}
      <Fab
        onClick={handleClick}
        sx={{
          position: 'fixed',
          bottom: 24,
          left: 24,
          backgroundColor: '#25D366',
          color: 'white',
          zIndex: 1000,
          width: 64,
          height: 64,
          boxShadow: '0 8px 32px rgba(37, 211, 102, 0.4)',
          '&:hover': {
            backgroundColor: '#128C7E',
            transform: 'scale(1.1)',
            boxShadow: '0 12px 40px rgba(37, 211, 102, 0.6)',
          },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          animation: 'pulse 2s infinite',
          '@keyframes pulse': {
            '0%': {
              boxShadow: '0 8px 32px rgba(37, 211, 102, 0.4)',
            },
            '50%': {
              boxShadow: '0 8px 32px rgba(37, 211, 102, 0.6), 0 0 0 10px rgba(37, 211, 102, 0.1)',
            },
            '100%': {
              boxShadow: '0 8px 32px rgba(37, 211, 102, 0.4)',
            },
          },
        }}
        aria-label="WhatsApp"
      >
        <WhatsAppIcon sx={{ fontSize: 32 }} />
      </Fab>

      {/* WhatsApp Popup */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        sx={{
          '& .MuiPopover-paper': {
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            border: 'none',
          },
        }}
      >
        <Paper
          sx={{
            width: 320,
            background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
            color: 'white',
            position: 'relative',
          }}
        >
          {/* Close Button */}
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
              },
              zIndex: 1,
            }}
            size="small"
          >
            <CloseIcon fontSize="small" />
          </IconButton>

          {/* Header */}
          <Box sx={{ p: 3, pb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <WhatsAppIcon sx={{ fontSize: 32, mr: 2 }} />
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  WhatsApp Support
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  תמיכה מהירה ונוחה
                </Typography>
              </Box>
            </Box>
            
            <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.5 }}>
              צור קשר איתנו דרך WhatsApp לקבלת מידע נוסף, תמיכה טכנית או הזמנת שירות.
            </Typography>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ p: 2, pt: 0 }}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<MessageIcon />}
              onClick={handleMessage}
              sx={{
                backgroundColor: 'white',
                color: '#25D366',
                mb: 2,
                py: 1.5,
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                },
              }}
            >
              שלח הודעה
            </Button>
            
            <Button
              fullWidth
              variant="outlined"
              startIcon={<PhoneIcon />}
              onClick={handleCall}
              sx={{
                borderColor: 'white',
                color: 'white',
                py: 1.5,
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'white',
                },
              }}
            >
              התקשר עכשיו
            </Button>
          </Box>

          {/* Footer */}
          <Box sx={{ 
            p: 2, 
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              זמינים 24/7 • תגובה מהירה
            </Typography>
          </Box>
        </Paper>
      </Popover>
    </>
  );
}
