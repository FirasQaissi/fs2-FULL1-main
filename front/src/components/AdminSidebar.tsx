import { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Avatar,
  Stack,
  Chip,
  Paper,
  CircularProgress,
} from '@mui/material';
import {
  Close as CloseIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Inventory as InventoryIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  AdminPanelSettings as AdminIcon,
  ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { authStorage } from '../services/authStorage';
import { dashboardService, type DashboardStats } from '../services/dashboardService';

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const user = authStorage.getUser<{ name?: string; email?: string; isAdmin?: boolean }>();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setLoading(true);
      dashboardService.getStats()
        .then(setStats)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [open]);

  const adminMenuItems = [
    {
      label: 'Dashboard Overview',
      path: '/admin',
      icon: <DashboardIcon />,
      description: 'System overview & stats',
      primary: true,
    },
    {
      label: 'User Management',
      path: '/admin?tab=users',
      icon: <PeopleIcon />,
      description: 'Manage users & permissions',
      primary: true,
      highlight: true,
    },
    {
      label: 'Product Management',
      path: '/admin?tab=products',
      icon: <InventoryIcon />,
      description: 'Add, edit & remove products',
      primary: true,
      highlight: true,
    },
    {
      label: 'Analytics',
      path: '/analytics',
      icon: <AnalyticsIcon />,
      description: 'Sales & user analytics',
      disabled: true,
    },
    {
      label: 'Orders',
      path: '/admin/orders',
      icon: <ShoppingCartIcon />,
      description: 'Manage customer orders',
      disabled: true,
    },
    {
      label: 'System Settings',
      path: '/admin/settings',
      icon: <SettingsIcon />,
      description: 'Configure system settings',
      disabled: true,
    },
  ];

  const quickStats = stats ? [
    { 
      label: 'Total Users', 
      value: stats.totalUsers.toLocaleString(), 
      trend: `+${stats.recentUsers}`, 
      color: 'primary',
      subtitle: 'new this month'
    },
    { 
      label: 'Products', 
      value: stats.totalProducts.toString(), 
      trend: 'Active', 
      color: 'success',
      subtitle: 'in catalog'
    },
    { 
      label: 'Orders Today', 
      value: stats.ordersToday.toString(), 
      trend: '+Live', 
      color: 'warning',
      subtitle: 'processed today'
    },
    {
      label: 'Admin Users',
      value: stats.adminUsers.toString(),
      trend: 'Active',
      color: 'error',
      subtitle: 'with admin access'
    },
  ] : [];

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100vw', sm: 420 },
          background: (theme) => theme.palette.mode === 'dark'
            ? 'linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 100%)'
            : 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
          backdropFilter: 'blur(20px)',
          borderLeft: (theme) => `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header - Compact */}
        <Box
          sx={{
            p: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
            background: (theme) => theme.palette.mode === 'dark'
              ? 'rgba(0, 212, 170, 0.1)'
              : 'rgba(102, 126, 234, 0.05)',
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Avatar
                sx={{
                  bgcolor: 'primary.main',
                  width: 36,
                  height: 36,
                }}
              >
                <AdminIcon sx={{ fontSize: '1.5rem' }} />
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight={700}>
                  Admin Panel
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.name || 'Administrator'}
                </Typography>
              </Box>
            </Stack>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Stack>

          <Chip
            label="Administrator"
            color="primary"
            variant="outlined"
            size="small"
            sx={{
              fontWeight: 600,
              borderRadius: '8px',
              fontSize: '0.75rem',
              height: 24,
            }}
          />
        </Box>

        {/* Quick Stats - Compact */}
        <Box sx={{ p: 1 }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ mb: 1.0 }}>
            Quick Overview
          </Typography>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1 }}>
              {quickStats.map((stat) => (
                <Box key={stat.label}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 0.35,
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      background: (theme) => theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.02)'
                        : 'rgba(255, 255, 255, 0.8)',
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                      {stat.label}
                    </Typography>
                    <Typography variant="h6" fontWeight={700} sx={{ fontSize: '1.1rem', my: 0.5 }}>
                      {stat.value}
                    </Typography>
                    <Chip
                      label={stat.trend}
                      size="small"
                      color={stat.color as 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'default'}
                      variant="outlined"
                      sx={{ fontSize: '0.6rem', height: 18 }}
                    />
                  </Paper>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        <Divider />

        {/* Navigation Menu - Compact */}
        <Box sx={{ flex: 1, overflow: 'hidden' }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ p: 2, pb: 1 }}>
            Admin Tools
          </Typography>
          
          {/* Primary Admin Tools - Compact Highlighted */}
          <Box sx={{ px: 2, mb: 1.5 }}>
            <Typography variant="caption" color="text.secondary" sx={{ px: 1, mb: 1, display: 'block', fontSize: '0.7rem' }}>
              CORE MANAGEMENT
            </Typography>
            {adminMenuItems.filter(item => item.highlight).map((item) => (
              <Paper
                key={item.path}
                elevation={0}
                sx={{
                  mb: 1,
                  borderRadius: 2,
                  background: (theme) => theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, rgba(0, 212, 170, 0.1) 0%, rgba(124, 77, 255, 0.1) 100%)'
                    : 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                  border: '1px solid',
                  borderColor: 'primary.main',
                  borderOpacity: 0.2,
                }}
              >
                <ListItem
                  component={RouterLink}
                  to={item.path}
                  onClick={onClose}
                  sx={{
                    borderRadius: 2,
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                      transform: 'translateX(2px)',
                    },
                    transition: 'all 0.2s ease-in-out',
                    textDecoration: 'none',
                    color: 'inherit',
                    py: 1.5,
                    minHeight: 'auto',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: 'primary.main',
                      minWidth: 36,
                      '& svg': {
                        fontSize: '1.25rem',
                      },
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" fontWeight={700} color="primary" sx={{ fontSize: '0.9rem' }}>
                        {item.label}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', lineHeight: 1.2 }}>
                        {item.description}
                      </Typography>
                    }
                  />
                </ListItem>
              </Paper>
            ))}
          </Box>

          {/* Other Admin Tools - More Compact */}
          <Box sx={{ px: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ px: 1, mb: 1, display: 'block', fontSize: '0.7rem' }}>
              ADDITIONAL TOOLS
            </Typography>
            {adminMenuItems.filter(item => !item.highlight).map((item) => (
              <ListItem
                key={item.path}
                component={item.disabled ? 'div' : RouterLink}
                to={item.disabled ? undefined : item.path}
                onClick={item.disabled ? undefined : onClose}
                sx={{
                  borderRadius: 1.5,
                  mb: 0.5,
                  opacity: item.disabled ? 0.5 : 1,
                  cursor: item.disabled ? 'not-allowed' : 'pointer',
                  '&:hover': {
                    backgroundColor: item.disabled ? 'transparent' : 'action.hover',
                    transform: item.disabled ? 'none' : 'translateX(2px)',
                  },
                  transition: 'all 0.2s ease-in-out',
                  textDecoration: 'none',
                  color: 'inherit',
                  py: 1,
                  minHeight: 'auto',
                }}
              >
                <ListItemIcon
                  sx={{
                    color: item.disabled ? 'text.disabled' : 'text.secondary',
                    minWidth: 32,
                    '& svg': {
                      fontSize: '1.1rem',
                    },
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.85rem' }}>
                      {item.label}
                      {item.disabled && (
                        <Chip
                          label="Soon"
                          size="small"
                          color="default"
                          variant="outlined"
                          sx={{ ml: 1, fontSize: '0.55rem', height: 16 }}
                        />
                      )}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                      {item.description}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </Box>
        </Box>

        <Divider />

        {/* Footer - Compact */}
        <Box sx={{ p: 2 }}>
          <Paper
            elevation={0}
            sx={{
              p: 1.5,
              borderRadius: 2,
              background: (theme) => theme.palette.mode === 'dark'
                ? 'rgba(0, 212, 170, 0.1)'
                : 'rgba(102, 126, 234, 0.05)',
              border: '1px solid',
              borderColor: 'primary.main',
              borderOpacity: 0.2,
            }}
          >
            <Typography variant="caption" color="text.secondary" align="center" display="block" sx={{ fontSize: '0.7rem' }}>
              SmartGate Admin v2.0
            </Typography>
            <Typography variant="caption" color="text.secondary" align="center" display="block" sx={{ fontSize: '0.65rem' }}>
              Updated: {new Date().toLocaleDateString()}
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Drawer>
  );
}
