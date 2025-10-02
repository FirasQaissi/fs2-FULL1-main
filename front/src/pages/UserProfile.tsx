import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Avatar,
  Stack,
  Divider,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  Person as PersonIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Lock as LockIcon,
  AdminPanelSettings as AdminIcon,
  Business as BusinessIcon,
  Person as UserIcon
} from '@mui/icons-material';
import Navbar from '../components/Navbar';
import AuthModal from '../components/auth/AuthModal';
import { userService } from '../services/userService';
import { authStorage } from '../services/authStorage';
import type { User } from '../types/auth';

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({ name: '', email: '', phone: '' });
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({ 
    currentPassword: '', 
    newPassword: '', 
    confirmPassword: '' 
  });
  const [snack, setSnack] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ 
    open: false, message: '', severity: 'success' 
  });
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  
  const isAuthenticated = authStorage.isAuthenticated();

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { user } = await userService.getProfile();
        setUser(user);
        setEditData({ name: user.name, email: user.email, phone: user.phone || '' });
      } catch (err) {
        console.error('Error fetching profile:', err);
        setSnack({ open: true, message: 'Failed to load profile', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated]);

  const handleEditSave = async () => {
    if (!user) return;
    
    try {
      const { user: updatedUser } = await userService.updateProfile(editData);
      setUser(updatedUser);
      setEditMode(false);
      setSnack({ open: true, message: 'Profile updated successfully', severity: 'success' });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
      setSnack({ open: true, message: errorMessage, severity: 'error' });
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setSnack({ open: true, message: 'Passwords do not match', severity: 'error' });
      return;
    }

    try {
      await userService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setPasswordDialog(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setSnack({ open: true, message: 'Password updated successfully', severity: 'success' });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to change password';
      setSnack({ open: true, message: errorMessage, severity: 'error' });
    }
  };

  const openAuthModal = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const getUserRoles = () => {
    if (!user) return [];
    const roles = [];
    if (user.isAdmin) roles.push({ label: 'Admin', icon: <AdminIcon />, color: 'error' as const });
    if (user.isBusiness) roles.push({ label: 'Business', icon: <BusinessIcon />, color: 'warning' as const });
    if (user.isUser) roles.push({ label: 'User', icon: <UserIcon />, color: 'primary' as const });
    return roles;
  };

  if (!isAuthenticated) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Navbar onLoginClick={() => openAuthModal('login')} onRegisterClick={() => openAuthModal('register')} />
        
        <Container maxWidth="md" sx={{ py: 6 }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            minHeight: '60vh',
            textAlign: 'center'
          }}>
            <PersonIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Login Required
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              Please login to view your profile.
            </Typography>
          </Box>
        </Container>

        <AuthModal 
          open={authModalOpen}
          onClose={closeAuthModal}
          initialMode={authModalMode}
        />
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Navbar onLoginClick={() => openAuthModal('login')} onRegisterClick={() => openAuthModal('register')} />
        <Container maxWidth="md" sx={{ py: 6 }}>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <CircularProgress />
          </Box>
        </Container>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Navbar onLoginClick={() => openAuthModal('login')} onRegisterClick={() => openAuthModal('register')} />
        <Container maxWidth="md" sx={{ py: 6 }}>
          <Alert severity="error">Failed to load user profile</Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar onLoginClick={() => openAuthModal('login')} onRegisterClick={() => openAuthModal('register')} />

      <Container maxWidth="sm" sx={{ py: 4, px: { xs: 2, sm: 3 } }}>
        <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, border: '1px solid', borderColor: 'divider', backgroundColor: 'background.default' }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, sm: 4 }, flexDirection: { xs: 'column', sm: 'row' }, textAlign: { xs: 'center', sm: 'left' } }}>
            <Avatar sx={{ width: 72, height: 72, mr: { xs: 0, sm: 3 }, mb: { xs: 1.5, sm: 0 }, bgcolor: 'primary.main' }}>
              <PersonIcon sx={{ fontSize: 40 }} />
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                User Profile
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                {getUserRoles().map((role, index) => (
                  <Chip
                    key={index}
                    icon={role.icon}
                    label={role.label}
                    color={role.color}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Stack>
              {user.tempAdminExpiry && (
                <Typography variant="caption" color="warning.main">
                  Temporary admin expires: {new Date(user.tempAdminExpiry).toLocaleString()}
                </Typography>
              )}
            </Box>
            {!editMode && (
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => setEditMode(true)}
                size="small"
              >
                Edit Profile
              </Button>
            )}
          </Box>

          <Divider sx={{ mb: 4 }} />

          {/* Profile Information */}
          <Stack spacing={2}>
            <Box>
              <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                Personal Information
              </Typography>
              <Stack spacing={2}>
                <TextField
                  label="Full Name"
                  value={editMode ? editData.name : user.name}
                  onChange={(e) => editMode && setEditData({ ...editData, name: e.target.value })}
                  disabled={!editMode}
                  fullWidth
                  variant="outlined"
                />
                <TextField
                  label="Email Address"
                  value={editMode ? editData.email : user.email}
                  onChange={(e) => editMode && setEditData({ ...editData, email: e.target.value })}
                  disabled={!editMode}
                  fullWidth
                  variant="outlined"
                  type="email"
                />
                <TextField
                  label="Phone Number"
                  value={editMode ? editData.phone : (user.phone || 'Not provided')}
                  onChange={(e) => editMode && setEditData({ ...editData, phone: e.target.value })}
                  disabled={!editMode}
                  fullWidth
                  variant="outlined"
                  type="tel"
                  placeholder="05XXXXXXXX"
                  helperText={editMode ? "Israeli mobile format: 05XXXXXXXX" : undefined}
                />
              </Stack>
            </Box>

            <Divider />

            <Box>
              <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                Account Details
              </Typography>
              <Stack spacing={2}>
                <TextField
                  label="User ID"
                  value={user._id}
                  disabled
                  fullWidth
                  variant="outlined"
                />
                <TextField
                  label="Member Since"
                  value={user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  disabled
                  fullWidth
                  variant="outlined"
                />
              </Stack>
            </Box>

            {editMode ? (
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pt: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleEditSave}
                  fullWidth
                >
                  Save Changes
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={() => {
                    setEditMode(false);
                    setEditData({ name: user.name, email: user.email, phone: user.phone || '' });
                  }}
                  fullWidth
                >
                  Cancel
                </Button>
              </Stack>
            ) : (
              <Button
                variant="outlined"
                startIcon={<LockIcon />}
                onClick={() => setPasswordDialog(true)}
                sx={{ mt: 1 }}
                size="small"
              >
                Change Password
              </Button>
            )}
          </Stack>
        </Paper>
      </Container>

      {/* Password Change Dialog */}
      <Dialog open={passwordDialog} onClose={() => setPasswordDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Current Password"
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              fullWidth
            />
            <TextField
              label="New Password"
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              fullWidth
              helperText="Password must be at least 8 characters and include a special character"
            />
            <TextField
              label="Confirm New Password"
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialog(false)}>Cancel</Button>
          <Button onClick={handlePasswordChange} variant="contained">
            Change Password
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar 
        open={snack.open} 
        autoHideDuration={6000} 
        onClose={() => setSnack(s => ({ ...s, open: false }))}
      >
        <Alert 
          onClose={() => setSnack(s => ({ ...s, open: false }))} 
          severity={snack.severity} 
          variant="filled"
        >
          {snack.message}
        </Alert>
      </Snackbar>

      {/* Auth Modal */}
      <AuthModal 
        open={authModalOpen}
        onClose={closeAuthModal}
        initialMode={authModalMode}
      />
    </Box>
  );
}
