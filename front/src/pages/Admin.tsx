import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Stack,
  Button,
  TextField,
  Chip,
  Divider,
  Snackbar,
  Alert,
  Card,
  CardContent,
  useTheme,
} from '@mui/material';
import { 
  DataGrid, 
  GridActionsCellItem, 
  type GridColDef, 
  type GridRowParams
} from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import BusinessIcon from '@mui/icons-material/Business';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BlockIcon from '@mui/icons-material/Block';
import SearchIcon from '@mui/icons-material/Search';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import Navbar from '../components/Navbar';
import SecureDeleteDialog from '../components/SecureDeleteDialog';
import { adminService, type AdminUser } from '../services/adminService';
import { productService } from '../services/productService';
import type { Product, ProductCreateRequest } from '../types/product';

type TabKey = 'users' | 'products';

export default function Admin() {
  const theme = useTheme();
  const [tab, setTab] = useState<TabKey>('users');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [snack, setSnack] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({ open: false, message: '', severity: 'success' });

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [newProduct, setNewProduct] = useState<ProductCreateRequest>({ name: '', descriptions: '', version: '', features: [], price: 0, image: '' });
  const [featuresInput, setFeaturesInput] = useState('');
  const [creatingProduct, setCreatingProduct] = useState(false);
  
  // New user creation state
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    isAdmin: false,
    isBusiness: false,
    isUser: true
  });
  const [creatingUser, setCreatingUser] = useState(false);
  
  // Secure delete dialog state
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    type: 'user' as 'user' | 'product',
    id: '',
    name: '',
    onConfirm: async () => {}
  });

  useEffect(() => {
    setLoadingUsers(true);
    adminService
      .listUsers()
      .then((users) => {
        setUsers(users);
        setFilteredUsers(users);
      })
      .catch((e) => setSnack({ open: true, message: e.message || 'Failed to load users', severity: 'error' }))
      .finally(() => setLoadingUsers(false));
  }, []);

  useEffect(() => {
    setLoadingProducts(true);
    productService
      .getAllProducts()
      .then((products) => {
        setProducts(products);
        setFilteredProducts(products);
      })
      .catch((e) => setSnack({ open: true, message: e.message || 'Failed to load products', severity: 'error' }))
      .finally(() => setLoadingProducts(false));
  }, []);

  // Filter users based on search query
  useEffect(() => {
    if (!userSearchQuery.trim()) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        user.name?.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
        user.phone?.toLowerCase().includes(userSearchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [userSearchQuery, users]);

  // Filter products based on search query
  useEffect(() => {
    if (!productSearchQuery.trim()) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.name?.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
        product.descriptions?.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
        product.version?.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
        product.features?.some(feature => feature.toLowerCase().includes(productSearchQuery.toLowerCase()))
      );
      setFilteredProducts(filtered);
    }
  }, [productSearchQuery, products]);

  const userColumns: GridColDef[] = useMemo(() => [
      { 
        field: 'name', 
        headerName: 'Name', 
        flex: 1, 
        editable: true,
        renderCell: (params: { value?: string; id: string | number }) => {
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" fontWeight={600}>
                {params.value}
              </Typography>
            </Box>
          );
        }
      },
      { 
        field: 'email', 
        headerName: 'Email', 
        flex: 1.2, 
        editable: true,
        renderCell: (params: { value?: string }) => {
          return (
            <Typography variant="body2" color="primary">
              {params.value}
            </Typography>
          );
        }
      },
      { 
        field: 'phone', 
        headerName: 'Phone', 
        flex: 0.8,
        editable: true,
        renderCell: (params: { value?: string }) => {
          return (
            <Typography variant="body2">
              {params.value || 'Not provided'}
            </Typography>
          );
        }
      },
      {
        field: 'createdAt',
        headerName: 'Registered At',
        flex: 1,
        renderCell: (params: { value?: string }) => {
          if (!params.value) return 'N/A';
          try {
            return new Date(params.value).toLocaleString();
          } catch {
            return 'Invalid Date';
          }
        },
      },
      {
        field: 'tempAdminExpiry',
        headerName: 'Temp Admin Expires',
        flex: 1,
        renderCell: (params: { value?: string }) => {
          if (!params.value) return 'N/A';
          try {
            const date = new Date(params.value);
            const now = new Date();
            if (date < now) {
              return <span style={{ color: 'red' }}>Expired</span>;
            }
            return date.toLocaleString();
          } catch {
            return 'Invalid Date';
          }
        },
      },
      {
        field: 'isOnline',
        headerName: 'Status',
        width: 100,
        renderCell: (params: { value?: boolean }) => {
          const isOnline = !!params.value;
          return (
            <Chip
              label={isOnline ? 'Online' : 'Offline'}
              size="small"
              sx={{
                bgcolor: isOnline ? 'success.main' : 'error.main',
                color: 'white',
                fontWeight: 600,
                '&::before': {
                  content: '""',
                  display: 'inline-block',
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: 'white',
                  mr: 0.5,
                  animation: isOnline ? 'pulse 2s infinite' : 'none',
                },
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 1 },
                  '50%': { opacity: 0.5 },
                },
              }}
            />
          );
        },
      },
      {
        field: 'lastLogin',
        headerName: 'Last Login',
        flex: 1,
        renderCell: (params: { value?: string }) => {
          if (!params.value) return <Typography variant="body2" color="text.secondary">Never</Typography>;
          try {
            const date = new Date(params.value);
            const now = new Date();
            const diffMs = now.getTime() - date.getTime();
            const diffMins = Math.floor(diffMs / (1000 * 60));
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            
            let timeAgo;
            if (diffMins < 1) timeAgo = 'Just now';
            else if (diffMins < 60) timeAgo = `${diffMins}m ago`;
            else if (diffHours < 24) timeAgo = `${diffHours}h ago`;
            else timeAgo = `${diffDays}d ago`;
            
            return (
              <Box>
                <Typography variant="body2" fontWeight={500}>
                  {date.toLocaleDateString()}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {timeAgo}
                </Typography>
              </Box>
            );
          } catch {
            return 'Invalid Date';
          }
        },
      },
      {
        field: 'isAdmin',
        headerName: 'Admin',
        type: 'boolean',
        editable: true,
        width: 110,
      },
      {
        field: 'isBusiness',
        headerName: 'Business',
        type: 'boolean',
        editable: true,
        width: 120,
      },
      {
        field: 'isUser',
        headerName: 'User',
        type: 'boolean',
        editable: true,
        width: 110,
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
        getActions: (params: GridRowParams) => {
          const id = String(params.id);
          const row = params.row as AdminUser;
                        return [
                          <GridActionsCellItem
                            key="edit"
                            icon={<EditIcon />}
                            label="Edit User Details"
                            onClick={() => {
                              setSnack({ open: true, message: 'Double-click any cell to edit user details', severity: 'info' });
                            }}
                            showInMenu
                          />,
                          <GridActionsCellItem
                            key="save"
                            icon={<SaveIcon />}
                            label="Save Changes"
                            onClick={async () => {
                              try {
                                const updated = await adminService.updateUser(id, {
                                  name: row.name,
                                  email: row.email,
                                  phone: row.phone,
                                  isAdmin: !!row.isAdmin,
                                  isBusiness: !!row.isBusiness,
                                  isUser: row.isUser !== false,
                                });
                                setUsers((list) => list.map((u) => (u._id === id ? updated : u)));
                                setSnack({ open: true, message: 'User updated successfully!', severity: 'success' });
                              } catch (e: unknown) {
                                setSnack({ open: true, message: (e as Error).message || 'Update failed', severity: 'error' });
                              }
                            }}
                            showInMenu
                          />,
            <GridActionsCellItem
              key="promote-business"
              icon={<BusinessIcon />}
              label="Promote to Business"
              onClick={async () => {
                try {
                  const updated = await adminService.promoteToBusinessAccount(id);
                  setUsers((list) => list.map((u) => (u._id === id ? updated : u)));
                  setSnack({ open: true, message: 'User promoted to business account', severity: 'success' });
                } catch (e: unknown) {
                  setSnack({ open: true, message: (e as Error).message || 'Promotion failed', severity: 'error' });
                }
              }}
              showInMenu
            />,
            <GridActionsCellItem
              key="temp-admin-1day"
              icon={<AccessTimeIcon />}
              label="Temp Admin (1 Day)"
              onClick={async () => {
                try {
                  const updated = await adminService.assignTempAdminPrivileges(id, '1day');
                  setUsers((list) => list.map((u) => (u._id === id ? updated : u)));
                  setSnack({ open: true, message: 'Temporary admin privileges assigned for 1 day', severity: 'success' });
                } catch (e: unknown) {
                  setSnack({ open: true, message: (e as Error).message || 'Failed to assign temp admin', severity: 'error' });
                }
              }}
              showInMenu
            />,
            <GridActionsCellItem
              key="temp-admin-1week"
              icon={<AccessTimeIcon />}
              label="Temp Admin (1 Week)"
              onClick={async () => {
                try {
                  const updated = await adminService.assignTempAdminPrivileges(id, '1week');
                  setUsers((list) => list.map((u) => (u._id === id ? updated : u)));
                  setSnack({ open: true, message: 'Temporary admin privileges assigned for 1 week', severity: 'success' });
                } catch (e: unknown) {
                  setSnack({ open: true, message: (e as Error).message || 'Failed to assign temp admin', severity: 'error' });
                }
              }}
              showInMenu
            />,
            <GridActionsCellItem
              key="temp-admin-1month"
              icon={<AccessTimeIcon />}
              label="Temp Admin (1 Month)"
              onClick={async () => {
                try {
                  const updated = await adminService.assignTempAdminPrivileges(id, '1month');
                  setUsers((list) => list.map((u) => (u._id === id ? updated : u)));
                  setSnack({ open: true, message: 'Temporary admin privileges assigned for 1 month', severity: 'success' });
                } catch (e: unknown) {
                  setSnack({ open: true, message: (e as Error).message || 'Failed to assign temp admin', severity: 'error' });
                }
              }}
              showInMenu
            />,
            <GridActionsCellItem
              key="revoke-permissions"
              icon={<BlockIcon />}
              label="Revoke All Permissions"
              onClick={async () => {
                if (window.confirm('Are you sure you want to revoke all permissions for this user? This will remove admin and business privileges.')) {
                  try {
                    const updated = await adminService.updateUser(id, {
                      name: row.name,
                      email: row.email,
                      phone: row.phone,
                      isAdmin: false,
                      isBusiness: false,
                      isUser: true,
                    });
                    setUsers((list) => list.map((u) => (u._id === id ? updated : u)));
                    setSnack({ open: true, message: 'All permissions revoked successfully', severity: 'success' });
                  } catch (e: unknown) {
                    setSnack({ open: true, message: (e as Error).message || 'Failed to revoke permissions', severity: 'error' });
                  }
                }
              }}
              showInMenu
            />,
            <GridActionsCellItem
              key="delete"
              icon={<DeleteIcon />}
              label="Delete"
              onClick={() => {
                setDeleteDialog({
                  open: true,
                  type: 'user',
                  id,
                  name: row.name || row.email || 'Unknown User',
                  onConfirm: async () => {
                    await adminService.deleteUser(id);
                    setUsers((list) => list.filter((u) => u._id !== id));
                    setFilteredUsers((list) => list.filter((u) => u._id !== id));
                  }
                });
              }}
              showInMenu
            />,
          ];
        },
      },
    ], []);

  // Enhanced product validation
  const productValidation = useMemo(() => {
    const errors: { [key: string]: string } = {};
    
    if (!newProduct.name.trim()) {
      errors.name = 'Product name is required';
    } else if (newProduct.name.trim().length < 3) {
      errors.name = 'Product name must be at least 3 characters';
    }
    
    if (!newProduct.descriptions.trim()) {
      errors.descriptions = 'Product description is required';
    } else if (newProduct.descriptions.trim().length < 10) {
      errors.descriptions = 'Description must be at least 10 characters';
    }
    
    if (!newProduct.version.trim()) {
      errors.version = 'Version is required';
    } else if (!/^\d+\.\d+(\.\d+)?$/.test(newProduct.version.trim())) {
      errors.version = 'Version must be in format X.Y or X.Y.Z (e.g., 1.0, 1.2.3)';
    }
    
    if (!newProduct.image.trim()) {
      errors.image = 'Image URL is required';
    } else {
      try {
        new URL(newProduct.image);
      } catch {
        errors.image = 'Please enter a valid URL';
      }
    }
    
    if (newProduct.price < 0) {
      errors.price = 'Price must be zero or positive';
    } else if (newProduct.price > 999999) {
      errors.price = 'Price must be less than $1,000,000';
    }
    
    if (newProduct.features.length === 0) {
      errors.features = 'At least one feature is required';
    }
    
    return {
      errors,
      isValid: Object.keys(errors).length === 0
    };
  }, [newProduct]);

  const productFormValid = productValidation.isValid;

  const handleAddFeature = () => {
    const parts = featuresInput
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);
    if (parts.length) {
      setNewProduct((p) => ({ ...p, features: Array.from(new Set([...(p.features || []), ...parts])) }));
      setFeaturesInput('');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar onLoginClick={() => {}} onRegisterClick={() => {}} />
      
      {/* Hero Section */}
      <Box
        sx={{
          background: (theme) => theme.palette.mode === 'dark' 
            ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 6,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="xl">
          {/* Enhanced Dashboard Header */}
          <Paper
            elevation={8}
            sx={{
              p: { xs: 3, md: 5 },
              mb: 4,
              borderRadius: '24px',
              background: `linear-gradient(135deg, 
                ${theme.palette.primary.main} 0%, 
                ${theme.palette.secondary.main} 100%)`,
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                animation: 'float 20s ease-in-out infinite',
              },
              '@keyframes float': {
                '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                '33%': { transform: 'translateY(-10px) rotate(120deg)' },
                '66%': { transform: 'translateY(5px) rotate(240deg)' },
              },
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ position: 'relative', zIndex: 1 }}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: '16px',
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backdropFilter: 'blur(10px)',
                      animation: 'pulse 2s ease-in-out infinite',
                      '@keyframes pulse': {
                        '0%, 100%': { transform: 'scale(1)' },
                        '50%': { transform: 'scale(1.05)' },
                      },
                    }}
                  >
                    <DashboardIcon sx={{ fontSize: 32, color: 'white' }} />
                  </Box>
                  <Box>
                    <Typography 
                      variant="h2" 
                      sx={{
                        fontWeight: 900,
                        fontSize: { xs: '2rem', md: '3rem' },
                        lineHeight: 1.1,
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      Admin Dashboard
                    </Typography>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        opacity: 0.95,
                        fontWeight: 500,
                        fontSize: '1.2rem',
                        textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                      }}
                    >
                      Comprehensive system management & analytics
                    </Typography>
                  </Box>
                </Box>
                
                {/* Quick Stats Row */}
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={3} 
                  sx={{ mt: 3 }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      borderRadius: '12px',
                      px: 2.5,
                      py: 1.5,
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    <PeopleIcon sx={{ fontSize: 24 }} />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1 }}>
                        {users.length}
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        Total Users
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      borderRadius: '12px',
                      px: 2.5,
                      py: 1.5,
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    <InventoryIcon sx={{ fontSize: 24 }} />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1 }}>
                        {products.length}
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        Products
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      borderRadius: '12px',
                      px: 2.5,
                      py: 1.5,
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    <RadioButtonCheckedIcon sx={{ fontSize: 24 }} />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1 }}>
                        {users.filter(u => u.isOnline).length}
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        Online Now
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </Box>

              {/* Action Button */}
              <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    borderRadius: '16px',
                    px: 4,
                    py: 2,
                    fontWeight: 700,
                    textTransform: 'none',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease-in-out',
                  }}
                >
                  View Analytics
                </Button>
              </Box>
            </Stack>
          </Paper>

          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            <Box>
            </Box>
            <Chip 
              color="primary" 
              icon={<AdminPanelSettingsIcon />} 
              label="Administrator" 
              sx={{ 
                fontWeight: 700,
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                backdropFilter: 'blur(10px)',
                fontSize: '1rem',
                height: 40,
                px: 2
              }} 
            />
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Quick Action Cards */}
        <Box sx={{ display: 'flex', gap: 3, mb: 4, flexDirection: { xs: 'column', md: 'row' } }}>
          <Box sx={{ flex: 1 }}>
            <Card
              elevation={0}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                borderRadius: 3,
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 30px rgba(102, 126, 234, 0.3)',
                },
              }}
              onClick={() => setTab('users')}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '12px',
                      p: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <PersonAddIcon sx={{ fontSize: '2rem' }} />
                  </Box>
                  <Box>
                    <Typography variant="h5" fontWeight={700} gutterBottom>
                      👥 User Management
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Create, edit, and manage user accounts, roles, and permissions
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Box>
          
          <Box sx={{ flex: 1 }}>
            <Card
              elevation={0}
              sx={{
                background: 'linear-gradient(135deg, #00d4aa 0%, #00b894 100%)',
                color: 'white',
                borderRadius: 3,
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 30px rgba(0, 212, 170, 0.3)',
                },
              }}
              onClick={() => setTab('products')}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '12px',
                      p: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <AddIcon sx={{ fontSize: '2rem' }} />
                  </Box>
                  <Box>
                    <Typography variant="h5" fontWeight={700} gutterBottom>
                      📦 Product Management
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Add, edit, and manage product catalog, pricing, and inventory
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </Box>

        <Paper 
          elevation={0} 
          sx={{ 
            borderRadius: 3, 
            overflow: 'hidden', 
            border: '1px solid', 
            borderColor: 'divider', 
            bgcolor: 'background.paper',
            boxShadow: (theme) => theme.palette.mode === 'dark' 
              ? '0 4px 20px rgba(0, 0, 0, 0.3)' 
              : '0 4px 20px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tab} 
              onChange={(_e, v) => setTab(v)} 
              variant="scrollable" 
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': {
                  minHeight: 64,
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  px: 4,
                },
                '& .Mui-selected': {
                  color: 'primary.main',
                },
              }}
            >
              <Tab 
                value="users" 
                label="👥 User Management" 
                sx={{ minWidth: 200 }}
              />
              <Tab 
                value="products" 
                label="📦 Product Management" 
                sx={{ minWidth: 200 }}
              />
            </Tabs>
          </Box>

          <Divider />

          {tab === 'users' && (
            <Box sx={{ p: 2 }}>
              {/* Create New User Form */}
              <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Create New User</Typography>
                <Stack spacing={2}>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    />
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    />
                  </Stack>
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    helperText="Password must be at least 8 characters and include a special character"
                  />
                  <TextField
                    fullWidth
                    label="Israeli Mobile Number"
                    type="tel"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                    placeholder="05XXXXXXXX"
                    helperText="Format: 05XXXXXXXX (Israeli mobile number) - Optional"
                  />
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Button
                      variant="contained"
                      startIcon={<PersonAddIcon />}
                      onClick={async () => {
                        setCreatingUser(true);
                        try {
                          const created = await adminService.createUser(newUser);
                          setUsers((list) => [created, ...list]);
                          setNewUser({ name: '', email: '', password: '', phone: '', isAdmin: false, isBusiness: false, isUser: true });
                          setSnack({ open: true, message: 'User created successfully', severity: 'success' });
                        } catch (e: unknown) {
                          setSnack({ open: true, message: (e as Error).message || 'Failed to create user', severity: 'error' });
                        } finally {
                          setCreatingUser(false);
                        }
                      }}
                      disabled={!newUser.name || !newUser.email || !newUser.password || creatingUser}
                    >
                      Create User
                    </Button>
                  </Stack>
                </Stack>
              </Paper>

              {/* Search Field for Users */}
              <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Search Users</Typography>
                <TextField
                  fullWidth
                  label="Search by name, email, or phone"
                  placeholder="Start typing to filter users..."
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'background.default',
                      borderRadius: '12px',
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                    ),
                  }}
                />
                {userSearchQuery && (
                  <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Found {filteredUsers.length} users matching "{userSearchQuery}"
                    </Typography>
                    <Button
                      size="small"
                      onClick={() => setUserSearchQuery('')}
                      sx={{ minWidth: 'auto', px: 1 }}
                    >
                      Clear
                    </Button>
                  </Box>
                )}
              </Paper>

              <Box sx={{ mb: 2 }}>
                <Alert severity="info" sx={{ borderRadius: 2 }}>
                  💡 <strong>Tip:</strong> Double-click any cell in Name, Email, or Phone columns to edit. Phone format: 05XXXXXXXX (leave empty if not available).
                </Alert>
              </Box>
              
              <DataGrid
                density="comfortable"
                autoHeight
                rows={filteredUsers.map((u) => ({ id: u._id, ...u }))}
                columns={userColumns}
                loading={loadingUsers}
                disableRowSelectionOnClick
                sx={{ 
                  '& .MuiDataGrid-cell': { outline: 'none' },
                  '& .MuiDataGrid-cell--editable': {
                    backgroundColor: 'action.hover',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'action.selected',
                    },
                    '&::after': {
                      content: '"✏️"',
                      position: 'absolute',
                      top: 2,
                      right: 2,
                      fontSize: '0.7rem',
                      opacity: 0.6,
                    },
                  },
                }}
                processRowUpdate={async (newRow: AdminUser & { id: string }) => {
                  try {
                    // Updating user data
                    
                    const updateData = {
                      name: newRow.name || '',
                      email: newRow.email || '',
                      phone: newRow.phone || '',
                      isAdmin: !!newRow.isAdmin,
                      isBusiness: !!newRow.isBusiness,
                      isUser: newRow.isUser !== false,
                    };
                    
                    const updated = await adminService.updateUser(newRow.id, updateData);
                    // Update successful
                    
                    setUsers((list) => list.map((u) => (u._id === newRow.id ? updated : u)));
                    setSnack({ open: true, message: '✅ User updated successfully!', severity: 'success' });
                    
                    // Return the updated data for the DataGrid
                    return { ...newRow, ...updated };
                  } catch (e: any) {
                    console.error('❌ Frontend update error:', e);
                    
                    let errorMessage = 'Update failed';
                    if (e?.message) {
                      errorMessage = e.message;
                    }
                    
                    // Error occurred during update
                    setSnack({ open: true, message: `❌ ${errorMessage}`, severity: 'error' });
                    
                    // Re-throw to prevent DataGrid from updating
                    throw new Error(errorMessage);
                  }
                }}
                onProcessRowUpdateError={(error) => {
                  console.error('🔴 DataGrid update error:', error);
                  // Don't show additional error message here as it's already handled in processRowUpdate
                }}
              />
            </Box>
          )}

          {tab === 'products' && (
            <Box sx={{ p: 4 }}>
              {/* Create New Product Form */}
              <Paper elevation={1} sx={{ p: 4, mb: 4, borderRadius: 3, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h5" fontWeight={700} sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AddIcon color="primary" />
                  Create New Product
                </Typography>
                
                <Stack spacing={3}>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    <TextField 
                      fullWidth 
                      label="Product Name" 
                      value={newProduct.name} 
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      variant="outlined"
                      required
                      error={!!productValidation.errors.name}
                      helperText={productValidation.errors.name || 'Enter a descriptive product name'}
                    />
                    <TextField 
                      fullWidth 
                      label="Version" 
                      value={newProduct.version} 
                      onChange={(e) => setNewProduct({ ...newProduct, version: e.target.value })}
                      variant="outlined"
                      required
                      error={!!productValidation.errors.version}
                      helperText={productValidation.errors.version || 'e.g., 1.0, 2.1.3'}
                      placeholder="1.0"
                    />
                  </Stack>
                  
                  <TextField 
                    fullWidth 
                    multiline 
                    minRows={4} 
                    label="Product Description" 
                    value={newProduct.descriptions} 
                    onChange={(e) => setNewProduct({ ...newProduct, descriptions: e.target.value })}
                    variant="outlined"
                    required
                    error={!!productValidation.errors.descriptions}
                    helperText={productValidation.errors.descriptions || 'Provide a detailed description of the product'}
                  />
                  
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    <TextField 
                      fullWidth 
                      type="number" 
                      label="Price ($)" 
                      value={newProduct.price} 
                      onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                      variant="outlined"
                      required
                      error={!!productValidation.errors.price}
                      helperText={productValidation.errors.price || 'Enter price in USD'}
                      inputProps={{ min: 0, step: 0.01 }}
                    />
                    <TextField 
                      fullWidth 
                      label="Image URL" 
                      value={newProduct.image} 
                      onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                      variant="outlined"
                      required
                      error={!!productValidation.errors.image}
                      helperText={productValidation.errors.image || 'Enter the full URL to the product image'}
                      placeholder="https://example.com/image.jpg"
                    />
                  </Stack>
                  
                  <Box>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="flex-start">
                      <TextField 
                        fullWidth 
                        label="Features (comma separated)" 
                        value={featuresInput} 
                        onChange={(e) => setFeaturesInput(e.target.value)}
                        variant="outlined"
                        placeholder="e.g. Bluetooth, Fingerprint, Mobile App"
                        helperText="Add features separated by commas"
                      />
                      <Button 
                        variant="outlined" 
                        startIcon={<AddIcon />} 
                        onClick={handleAddFeature}
                        sx={{ minWidth: 120, height: 56 }}
                      >
                        Add Features
                      </Button>
                    </Stack>
                    
                    {(newProduct.features || []).length > 0 ? (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                          Product Features:
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                          {(newProduct.features || []).map((f) => (
                            <Chip 
                              key={f} 
                              label={f} 
                              onDelete={() => setNewProduct((p) => ({ ...p, features: (p.features || []).filter((x) => x !== f) }))}
                              color="primary"
                              variant="outlined"
                            />
                          ))}
                        </Stack>
                      </Box>
                    ) : productValidation.errors.features && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="error">
                          {productValidation.errors.features}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 2, pt: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<SaveIcon />}
                      disabled={!productFormValid || creatingProduct}
                      onClick={async () => {
                        setCreatingProduct(true);
                        try {
                          const created = await productService.createProduct(newProduct);
                          setProducts((list) => [created, ...list]);
                          setNewProduct({ name: '', descriptions: '', version: '', features: [], price: 0, image: '' });
                          setFeaturesInput('');
                          setSnack({ open: true, message: 'Product created successfully!', severity: 'success' });
                        } catch (e: unknown) {
                          setSnack({ open: true, message: (e as Error).message || 'Failed to create product', severity: 'error' });
                        } finally {
                          setCreatingProduct(false);
                        }
                      }}
                      size="large"
                      sx={{ minWidth: 150 }}
                    >
                      {creatingProduct ? 'Creating...' : 'Create Product'}
                    </Button>
                    
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setNewProduct({ name: '', descriptions: '', version: '', features: [], price: 0, image: '' });
                        setFeaturesInput('');
                      }}
                      size="large"
                    >
                      Clear Form
                    </Button>
                  </Box>
                </Stack>
              </Paper>

              {/* Existing Products Table */}
              <Paper elevation={1} sx={{ borderRadius: 3, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
                <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
                  <Typography variant="h5" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    📦 Product Inventory ({filteredProducts.length}{productSearchQuery ? ` of ${products.length}` : ''})
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Manage your existing products, edit details, or remove items
                  </Typography>
                </Box>

                {/* Search Field for Products */}
                <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Search Products</Typography>
                  <TextField
                    fullWidth
                    label="Search by name, description, version, or features"
                    placeholder="Start typing to filter products..."
                    value={productSearchQuery}
                    onChange={(e) => setProductSearchQuery(e.target.value)}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'background.default',
                        borderRadius: '12px',
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                      ),
                    }}
                  />
                  {productSearchQuery && (
                    <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Found {filteredProducts.length} products matching "{productSearchQuery}"
                      </Typography>
                      <Button
                        size="small"
                        onClick={() => setProductSearchQuery('')}
                        sx={{ minWidth: 'auto', px: 1 }}
                      >
                        Clear
                      </Button>
                    </Box>
                  )}
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Alert severity="info" sx={{ borderRadius: 2 }}>
                    💡 <strong>Tip:</strong> Double-click any cell in Name, Version, Price, or Description columns to edit. Click the Save icon to apply changes.
                  </Alert>
                </Box>
                
                <DataGrid
                  density="comfortable"
                  autoHeight
                  rows={filteredProducts.map((p, index) => ({ 
                    ...p,
                    id: (p as Product & { _id?: string })._id || p.id || `product-${index}`
                  }))}
                  columns={[
                    { 
                      field: 'name', 
                      headerName: 'Product Name', 
                      flex: 1.2,
                      minWidth: 200,
                      editable: true,
                      renderCell: (params) => (
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {params.value}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            v{params.row.version}
                          </Typography>
                        </Box>
                      )
                    },
                    { 
                      field: 'version', 
                      headerName: 'Version', 
                      width: 100,
                      editable: true,
                      renderCell: (params) => (
                        <Chip 
                          label={`v${params.value}`} 
                          size="small" 
                          color="secondary"
                          variant="outlined"
                        />
                      )
                    },
                    { 
                      field: 'price', 
                      headerName: 'Price', 
                      width: 120,
                      editable: true,
                      type: 'number',
                      renderCell: (params) => (
                        <Typography variant="subtitle2" color="primary" fontWeight={600}>
                          ${Number(params.value || 0).toFixed(2)}
                        </Typography>
                      )
                    },
                    { 
                      field: 'descriptions', 
                      headerName: 'Description', 
                      flex: 2,
                      minWidth: 300,
                      editable: true,
                      renderCell: (params) => (
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            lineHeight: 1.4
                          }}
                        >
                          {params.value}
                        </Typography>
                      )
                    },
                    {
                      field: 'features',
                      headerName: 'Features',
                      flex: 1,
                      minWidth: 200,
                      renderCell: (params) => (
                        <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                          {(params.value || []).slice(0, 2).map((feature: string) => (
                            <Chip 
                              key={feature}
                              label={feature} 
                              size="small" 
                              variant="outlined"
                              sx={{ fontSize: '0.75rem' }}
                            />
                          ))}
                          {(params.value || []).length > 2 && (
                            <Chip 
                              label={`+${(params.value || []).length - 2}`} 
                              size="small" 
                              color="primary"
                              sx={{ fontSize: '0.75rem' }}
                            />
                          )}
                        </Stack>
                      )
                    },
                    {
                      field: 'actions',
                      type: 'actions',
                      headerName: 'Actions',
                      width: 140,
                      getActions: (params: GridRowParams) => {
                        const id = String(params.id);
                        const row = params.row as Product;
                        return [
                          <GridActionsCellItem
                            key="edit"
                            icon={<EditIcon />}
                            label="Edit Product Details"
                            onClick={() => {
                              setSnack({ open: true, message: 'Double-click any cell to edit product details', severity: 'info' });
                            }}
                            showInMenu
                          />,
                          <GridActionsCellItem
                            key="save"
                            icon={<SaveIcon />}
                            label="Save Changes"
                            onClick={async () => {
                              try {
                                await productService.updateProduct(id, {
                                  name: row.name,
                                  version: row.version,
                                  price: row.price,
                                  descriptions: row.descriptions,
                                  features: row.features,
                                  image: row.image
                                });
                                setSnack({ open: true, message: 'Product updated successfully!', severity: 'success' });
                                // Refresh products list
                                const updatedProducts = await productService.getAllProducts();
                                setProducts(updatedProducts);
                              } catch (e: unknown) {
                                setSnack({ open: true, message: (e as Error).message || 'Failed to update product', severity: 'error' });
                              }
                            }}
                            showInMenu
                          />,
                          <GridActionsCellItem
                            key="delete"
                            icon={<DeleteIcon />}
                            label="Delete Product"
                            onClick={() => {
                              setDeleteDialog({
                                open: true,
                                type: 'product',
                                id,
                                name: row.name || 'Unknown Product',
                                onConfirm: async () => {
                                  await productService.deleteProduct(id);
                                  setProducts((list) => list.filter((p) => ((p as Product & { _id?: string })._id || `product-${list.indexOf(p)}`) !== id));
                                  setFilteredProducts((list) => list.filter((p) => ((p as Product & { _id?: string })._id || `product-${list.indexOf(p)}`) !== id));
                                }
                              });
                            }}
                          />,
                        ];
                      },
                    },
                  ]}
                  loading={loadingProducts}
                  disableRowSelectionOnClick
                  sx={{
                    border: 'none',
                    '& .MuiDataGrid-cell': { 
                      outline: 'none',
                      py: 1
                    },
                    '& .MuiDataGrid-cell--editable': {
                      backgroundColor: 'action.hover',
                      '&:hover': {
                        backgroundColor: 'action.selected',
                      },
                    },
                    '& .MuiDataGrid-row': {
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    },
                    '& .MuiDataGrid-columnHeaders': {
                      backgroundColor: 'action.hover',
                      fontWeight: 600,
                    },
                  }}
                  processRowUpdate={async (newRow: Product & { id: string }) => {
                    try {
                      const updated = await productService.updateProduct(newRow.id, {
                        name: newRow.name,
                        version: newRow.version,
                        price: newRow.price,
                        descriptions: newRow.descriptions,
                        features: newRow.features,
                        image: newRow.image
                      });
                      setProducts((list) => list.map((p) => {
                        const productId = (p as Product & { _id?: string })._id || p.id;
                        return productId === newRow.id ? { ...p, ...updated } : p;
                      }));
                      setSnack({ open: true, message: 'Product updated successfully!', severity: 'success' });
                      return { ...newRow, ...updated };
                    } catch (e: unknown) {
                      setSnack({ open: true, message: (e as Error).message || 'Failed to update product', severity: 'error' });
                      throw e;
                    }
                  }}
                  onProcessRowUpdateError={(error) => {
                    setSnack({ open: true, message: error?.message || 'Failed to update product', severity: 'error' });
                  }}
                />
              </Paper>
            </Box>
          )}
        </Paper>
      </Container>
      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack((s) => ({ ...s, open: false }))}>
        <Alert onClose={() => setSnack((s) => ({ ...s, open: false }))} severity={snack.severity} variant="filled" sx={{ width: '100%' }}>
          {snack.message}
        </Alert>
      </Snackbar>

      {/* Secure Delete Dialog */}
      <SecureDeleteDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog(prev => ({ ...prev, open: false }))}
        onConfirm={deleteDialog.onConfirm}
        title={`Delete ${deleteDialog.type === 'user' ? 'User' : 'Product'}`}
        itemName={deleteDialog.name}
        itemType={deleteDialog.type}
      />
    </Box>
  );
}


