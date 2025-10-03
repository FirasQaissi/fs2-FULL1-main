import { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Alert,
  CircularProgress,
  Paper,
} from '@mui/material';
import {
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { API_BASE } from '../services/http';

interface SmartLockLeadPopupProps {
  open: boolean;
  onClose: () => void;
}

export default function SmartLockLeadPopup({ open, onClose }: SmartLockLeadPopupProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });
  const [doorPhoto, setDoorPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('אנא בחר קובץ תמונה בלבד');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('גודל הקובץ חייב להיות פחות מ-5MB');
        return;
      }

      setDoorPhoto(file);
      setError(null);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    // Validation
    if (!formData.name.trim()) {
      setError('אנא הכנס את שמך המלא');
      return;
    }

    if (!formData.phone.trim()) {
      setError('אנא הכנס מספר טלפון');
      return;
    }

    const ISRAELI_PHONE_REGEX = /^05[0-9]{8}$/;
    if (!ISRAELI_PHONE_REGEX.test(formData.phone)) {
      setError('אנא הכנס מספר טלפון ישראלי תקין (05XXXXXXXX)');
      return;
    }

    if (!doorPhoto) {
      setError('אנא העלה תמונה של דלת הבית שלך');
      return;
    }

    setLoading(true);

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('phone', formData.phone.trim());
      formDataToSend.append('doorPhoto', doorPhoto);
      formDataToSend.append('source', 'smart-lock-lead');

      console.log('Sending form data:', {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        file: doorPhoto ? {
          name: doorPhoto.name,
          size: doorPhoto.size,
          type: doorPhoto.type
        } : 'No file',
        source: 'smart-lock-lead'
      });

      const response = await fetch(`${API_BASE}/api/leads`, {
        method: 'POST',
        body: formDataToSend,
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.ok) {
        setSuccess(true);
        // Reset form
        setFormData({ name: '', phone: '' });
        setDoorPhoto(null);
        setPhotoPreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        let errorMessage = 'שגיאה בשליחת הנתונים';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (parseError) {
          console.error('Error parsing response:', parseError);
        }
        setError(errorMessage);
      }
    } catch (error) {
      console.error('Network error:', error);
      setError('שגיאה בחיבור לשרת. אנא נסה שוב');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setFormData({ name: '', phone: '' });
    setDoorPhoto(null);
    setPhotoPreview(null);
    setError(null);
    setSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removePhoto = () => {
    setDoorPhoto(null);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiPaper-root': {
          borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
        },
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <HomeIcon color="primary" sx={{ fontSize: 32 }} />
          <Typography variant="h5" fontWeight={700} sx={{ color: 'primary.main' }}>
            אני גם רוצה מנעול חכם
          </Typography>
        </Box>
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {success ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CheckCircleIcon 
              sx={{ 
                fontSize: 80, 
                color: 'success.main', 
                mb: 3 
              }} 
            />
            <Typography variant="h6" fontWeight={600} color="success.main" gutterBottom>
              תודה רבה!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              קיבלנו את הפרטים שלך ואת תמונת הדלת. נחזור אליך בהקדם עם הצעה מותאמת אישית!
            </Typography>
            <Alert severity="success" sx={{ textAlign: 'right' }}>
              <Typography variant="body2">
                <strong>מה קורה עכשיו?</strong><br />
                • נבחן את הדלת שלך<br />
                • נכין הצעה מותאמת<br />
                • נחזור אליך תוך 24 שעות
              </Typography>
            </Alert>
          </Box>
        ) : (
          <Box>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
              מלא את הפרטים הבאים ונחזור אליך עם הצעה מותאמת אישית למנעול החכם שלך
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3, textAlign: 'right' }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} dir="rtl">
              <TextField
                fullWidth
                label="שם מלא"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                variant="outlined"
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                  },
                }}
                InputProps={{
                  startAdornment: <PersonIcon sx={{ color: 'text.secondary', mr: 1 }} />,
                }}
              />

              <TextField
                fullWidth
                label="מספר טלפון"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                variant="outlined"
                placeholder="05XXXXXXXX"
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                  },
                }}
                InputProps={{
                  startAdornment: <PhoneIcon sx={{ color: 'text.secondary', mr: 1 }} />,
                }}
              />

              {/* Photo Upload Section */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, textAlign: 'right' }}>
                  תמונה של דלת הבית שלך
                </Typography>
                
                {photoPreview ? (
                  <Paper
                    elevation={2}
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      borderRadius: '12px',
                      border: '2px dashed',
                      borderColor: 'primary.main',
                    }}
                  >
                    <Box
                      component="img"
                      src={photoPreview}
                      alt="Door preview"
                      sx={{
                        maxWidth: '100%',
                        maxHeight: 200,
                        borderRadius: '8px',
                        mb: 2,
                      }}
                    />
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => fileInputRef.current?.click()}
                        startIcon={<CloudUploadIcon />}
                      >
                        החלף תמונה
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={removePhoto}
                      >
                        הסר
                      </Button>
                    </Box>
                  </Paper>
                ) : (
                  <Paper
                    elevation={1}
                    sx={{
                      p: 4,
                      textAlign: 'center',
                      borderRadius: '12px',
                      border: '2px dashed',
                      borderColor: 'divider',
                      cursor: 'pointer',
                      '&:hover': {
                        borderColor: 'primary.main',
                        backgroundColor: 'action.hover',
                      },
                    }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                      לחץ כאן להעלאת תמונה
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      JPG, PNG עד 5MB
                    </Typography>
                  </Paper>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  style={{ display: 'none' }}
                />
              </Box>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  py: 2,
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  textTransform: 'none',
                  background: 'linear-gradient(135deg, #00d4aa, #00a8cc)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #00a8cc, #00d4aa)',
                  },
                }}
              >
                {loading ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                    שולח...
                  </>
                ) : (
                  'שלח פרטים וקבל הצעה'
                )}
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>

      {!success && (
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{
              borderRadius: '12px',
              px: 3,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            ביטול
          </Button>
        </DialogActions>
      )}

      {success && (
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            onClick={handleClose}
            variant="contained"
            sx={{
              borderRadius: '12px',
              px: 3,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            סגור
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}
