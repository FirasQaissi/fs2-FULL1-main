import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Chip
} from '@mui/material';
import {
  Lock as LockIcon,
  Delete as DeleteIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { authStorage } from '../services/authStorage';
import { http, API_BASE } from '../services/http';

interface SecureDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  itemName: string;
  itemType: 'user' | 'product';
}

export default function SecureDeleteDialog({
  open,
  onClose,
  onConfirm,
  title,
  itemName,
  itemType
}: SecureDeleteDialogProps) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleClose = () => {
    setPassword('');
    setError('');
    setSuccess(false);
    onClose();
  };

  const verifyPassword = async (): Promise<boolean> => {
    const user = authStorage.getUser<{ email: string }>();
    if (!user?.email) {
      throw new Error('User email not found');
    }

    try {
      await http(`${API_BASE}/api/auth/verify-password`, {
        method: 'POST',
        body: JSON.stringify({
          email: user.email,
          password: password
        }),
      });
      return true;
    } catch (error: any) {
      throw new Error(error.message || 'Password verification failed');
    }
  };

  const handleConfirm = async () => {
    if (!password.trim()) {
      setError('Password is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // First verify the admin's password
      await verifyPassword();
      
      // If password is correct, proceed with deletion
      await onConfirm();
      
      setSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error: any) {
      setError(error.message || 'Failed to delete item');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Dialog open={open} onClose={() => {}} maxWidth="sm" fullWidth>
        <DialogContent sx={{ textAlign: 'center', py: 6 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: 'success.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'checkmark 0.5s ease-in-out',
                '@keyframes checkmark': {
                  '0%': { transform: 'scale(0)', opacity: 0 },
                  '100%': { transform: 'scale(1)', opacity: 1 }
                }
              }}
            >
              <Typography sx={{ color: 'white', fontSize: '2rem' }}>✓</Typography>
            </Box>
            <Typography variant="h5" fontWeight={700} color="success.main">
              Item has been deleted successfully
            </Typography>
            <Typography variant="body1" color="text.secondary">
              The {itemType} "{itemName}" has been permanently removed.
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          border: '2px solid',
          borderColor: 'error.main',
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 70,
              height: 70,
              borderRadius: '50%',
              bgcolor: 'error.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <WarningIcon sx={{ fontSize: '2rem', color: 'white' }} />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={700} color="error.main" gutterBottom>
              {title}
            </Typography>
            <Chip 
              label="Admin Authentication Required"
              color="error"
              size="small"
              sx={{ fontWeight: 600 }}
            />
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        <Alert severity="warning" sx={{ mb: 3, borderRadius: '12px' }}>
          <Typography fontWeight={600}>
            You are about to permanently delete "{itemName}"
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            This action cannot be undone. Please confirm your password to proceed.
          </Typography>
        </Alert>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <LockIcon color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Confirm Admin Password
            </Typography>
          </Box>
          
          <TextField
            fullWidth
            type="password"
            label="Your Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            error={!!error}
            helperText={error || 'Enter your admin password to confirm deletion'}
            disabled={loading}
            autoFocus
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
              }
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ 
        justifyContent: 'center', 
        gap: 2, 
        pb: 3,
        px: 3 
      }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          size="large"
          startIcon={<CancelIcon />}
          disabled={loading}
          sx={{
            minWidth: 120,
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          Cancel
        </Button>

        <Button
          onClick={handleConfirm}
          variant="contained"
          size="large"
          color="error"
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon />}
          disabled={loading || !password.trim()}
          sx={{
            minWidth: 120,
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          {loading ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
