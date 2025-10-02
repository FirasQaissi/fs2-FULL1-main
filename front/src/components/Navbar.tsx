import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Box,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Avatar,
  Badge,
  Select,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Typography,
  Paper
} from '@mui/material';
import {
  Search as SearchIcon,
  ShoppingBasket as ShoppingBasketIcon,
  Favorite as FavoriteIcon,
  Menu as MenuIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  Inventory as ProductsIcon,
  Star as FeaturesIcon,
  Build as ServicesIcon,
  Info as AboutIcon,
  Login as LoginIcon,
  PersonAdd as SignUpIcon,
  Logout as LogoutIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Translate as TranslateIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { authStorage } from '../services/authStorage';
import { authService } from '../services/authService';
import { useSettings } from '../providers/SettingsProvider';
import { cartService } from '../services/cartService';
import { productService } from '../services/productService';
import AdminSidebar from './AdminSidebar';

interface NavbarProps {
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
}

export default function Navbar({ onLoginClick, onRegisterClick }: NavbarProps = {}) {
  const { mode, setLanguage, toggleMode, lang, t } = useSettings();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminSidebarOpen, setAdminSidebarOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [products, setProducts] = useState<{ id: string; name: string; price: number }[]>([]);
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  
  const isAuthenticated = authStorage.getToken();
  const user = authStorage.getUser<{ name?: string; isAdmin?: boolean; isBusiness?: boolean }>();

  // Update cart count on component mount and when storage changes
  useEffect(() => {
    const updateCartCount = () => setCartCount(cartService.getCartCount());
    updateCartCount();
    
    // Listen for storage changes to update cart count
    window.addEventListener('storage', updateCartCount);
    // Listen for custom cart update events
    window.addEventListener('cartUpdated', updateCartCount);
    
    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  // Load products for search
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productsData = await productService.getAllProducts();
        // Transform products to ensure consistent ID format
        const transformedProducts = productsData.map(product => ({
          id: product.id || product._id || '',
          name: product.name,
          price: product.price
        }));
        setProducts(transformedProducts);
      } catch (error) {
        console.error('Failed to load products for search:', error);
      }
    };
    loadProducts();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchDropdownOpen(false);
    }
  };

  const handleSearchFocus = () => {
    setSearchDropdownOpen(true);
  };

  const handleSearchBlur = () => {
    // Delay to allow clicking on dropdown items
    setTimeout(() => setSearchDropdownOpen(false), 200);
  };

  const handleProductSelect = (product: { id: string; name: string; price: number }) => {
    navigate(`/products/${product.id}`);
    setSearchQuery('');
    setSearchDropdownOpen(false);
  };

  // Get top 5 products for dropdown
  const topProducts = products.slice(0, 5);

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleSignOut = async () => {
    try {
      // Call logout API to update server-side status
      await authService.logout();
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API call failed:', error);
    }
    
    authStorage.clear();
    handleUserMenuClose();
    navigate('/');
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Dynamic order based on language - English: Home first, Hebrew/Arabic: maintain RTL order
  const navItems = lang === 'en' 
    ? [
        { label: t('nav.home'), path: '/', icon: <HomeIcon /> },
        { label: t('nav.products'), path: '/products', icon: <ProductsIcon /> },
        { label: t('nav.services'), path: '/services', icon: <ServicesIcon /> },
        { label: t('nav.features'), path: '/features', icon: <FeaturesIcon /> },
        { label: t('nav.about'), path: '/about', icon: <AboutIcon /> },
      ]
    : [
        { label: t('nav.home'), path: '/', icon: <HomeIcon /> },
        { label: t('nav.products'), path: '/products', icon: <ProductsIcon /> },
        { label: t('nav.services'), path: '/services', icon: <ServicesIcon /> },
        { label: t('nav.features'), path: '/features', icon: <FeaturesIcon /> },
        { label: t('nav.about'), path: '/about', icon: <AboutIcon /> },
      ];

  const MobileMenu = () => (
    <Drawer
      anchor="left"
      open={mobileMenuOpen}
      onClose={handleMobileMenuToggle}
      sx={{
        '& .MuiDrawer-paper': (theme) => ({
          width: 280,
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
        }),
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box component="img" src="/src/images/logo5.png" alt="SmartGate" sx={{ height: 40, width: 'auto' }} />
          <Typography sx={{ fontWeight: 800, letterSpacing: '0.5px' }}>
            SmartGate
          </Typography>
        </Box>
        
        
        {/* Search Bar */}
        <Box component="form" onSubmit={handleSearch} sx={{ mb: 2 }}>
          <TextField
            fullWidth
                  placeholder={t('common.searchProducts')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            sx={(theme) => ({
              '& .MuiOutlinedInput-root': {
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                borderRadius: '25px',
                '& fieldset': { borderColor: 'transparent' },
                '&:hover fieldset': { borderColor: theme.palette.divider },
                '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
              },
              '& .MuiInputBase-input': {
                color: theme.palette.text.primary,
                '&::placeholder': { color: theme.palette.text.secondary },
              },
            })}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton type="submit" size="small" sx={{ color: 'inherit' }}>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Divider sx={(theme) => ({ backgroundColor: theme.palette.divider, mb: 2 })} />

        {/* Navigation Items */}
        <List>
          {navItems.map((item) => (
            <ListItem
              key={item.path}
              component={RouterLink}
              to={item.path}
              onClick={handleMobileMenuToggle}
              sx={{
                borderRadius: '8px',
                mb: 0.5,
                backgroundColor: (theme) => location.pathname === item.path ? theme.palette.action.selected : 'transparent',
                '&:hover': (theme) => ({
                  backgroundColor: theme.palette.action.hover,
                }),
              }}
            >
              <ListItemIcon sx={{ color: 'green', minWidth: 35 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} sx={{ color: 'green' }} />
            </ListItem>
          ))}
        </List>

        <Divider sx={(theme) => ({ backgroundColor: theme.palette.divider, my: 2 })} />

        {/* Admin Tools for Mobile */}
        {user?.isAdmin && (
          <Box sx={{ px: 2, mb: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ px: 2, mb: 1, display: 'block' }}>
              ADMIN TOOLS
            </Typography>
            <ListItem
              onClick={() => {
                setAdminSidebarOpen(true);
                handleMobileMenuToggle();
              }}
              sx={{
                borderRadius: '12px',
                background: 'linear-gradient(135deg,rgb(115, 172, 93) 0%, #764ba2 100%)',
                color: 'white',
                mb: 1,
                cursor: 'pointer',
                '&:hover': {
                  background: 'linear-gradient(135deg,rgb(14, 185, 59) 0%,rgb(180, 160, 228) 100%)',
                  transform: 'translateX(4px)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 40}}>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText 
                primary={
                  <Typography variant="subtitle1" fontWeight={700}>
                    Admin Panel
                  </Typography>
                }
                secondary={
                  <Typography variant="caption" sx={{ color: 'rgba(252, 253, 252, 0.8)', fontWeight: 700 }}>
                    Manage users & products
                  </Typography>
                }
              />
            </ListItem>
          </Box>
        )}

        <Divider sx={(theme) => ({ backgroundColor: theme.palette.divider, my: 2 })} />

        {/* User Actions */}
        {isAuthenticated ? (
          <List>
            <ListItem
              component={RouterLink}
              to="/mycard"
              onClick={handleMobileMenuToggle}
              sx={{
                borderRadius: '8px',
                mb: 0.5,
                '&:hover': (theme) => ({
                  backgroundColor: theme.palette.action.hover,
                }),
              }}
            >
              <ListItemIcon sx={{ color: 'silver', minWidth: 40 }}>
                <ShoppingBasketIcon />
              </ListItemIcon>
              <ListItemText primary={t('nav.myCard')} sx={{ color: 'silver' }} />
            </ListItem>
            <ListItem
              onClick={async () => {
                await handleSignOut();
                handleMobileMenuToggle();
              }}
              sx={{
                borderRadius: '8px',
                cursor: 'pointer',
                '&:hover': (theme) => ({
                  backgroundColor: theme.palette.action.hover,
                }),
              }}
            >
              <ListItemIcon sx={{ color: 'red', minWidth: 40 }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary={t('nav.logout')} sx={{ color: 'red', fontSize: '1.2rem' }} />
            </ListItem>
          </List>
        ) : (
          <List>
            <ListItem
              onClick={() => {
                onLoginClick?.();
                handleMobileMenuToggle();
              }}
              sx={{
                borderRadius: '8px',
                mb: 0.5,
                cursor: 'pointer',
                '&:hover': (theme) => ({
                  backgroundColor: theme.palette.action.hover,
                }),
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                <LoginIcon />
              </ListItemIcon>
              <ListItemText primary={t('nav.login')} sx={{ color: 'inherit' }} />
            </ListItem>
            <ListItem
              onClick={() => {
                onRegisterClick?.();
                handleMobileMenuToggle();
              }}
              sx={{
                borderRadius: '8px',
                cursor: 'pointer',
                '&:hover': (theme) => ({
                  backgroundColor: theme.palette.action.hover,
                }),
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                <SignUpIcon />
              </ListItemIcon>
              <ListItemText primary={t('nav.signup')} sx={{ color: 'inherit' }} />
            </ListItem>
          </List>
        )}
      </Box>
    </Drawer>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={(theme) => ({ 
          backgroundColor: theme.palette.mode === 'dark' 
            ? 'rgba(18, 18, 18, 0.95)' 
            : 'rgba(255, 255, 255, 0.95)',
          color: theme.palette.text.primary,
          boxShadow: theme.palette.mode === 'dark'
            ? '0 2px 20px rgba(0, 0, 0, 0.3)'
            : '0 2px 20px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${theme.palette.divider}`,
          zIndex: theme.zIndex.appBar,
          top: 0,
        })}
      >
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          {/* Logo */}
          <Box
            component={RouterLink}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              gap: 1.5,
            }}
          >
            <Box component="img" src="/src/images/logo5.png" alt="Smart Gate" sx={{ height: 45, width: 'auto' }} />
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                fontFamily: 'inherit',
                letterSpacing: '0.5px',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              SmartGate
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              {/* Enhanced Search Bar with Dropdown */}
              <Box sx={{ minWidth: 350, position: 'relative' }}>
                <Box component="form" onSubmit={handleSearch}>
                  <TextField
                    fullWidth
                    placeholder={t('common.searchProducts')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={handleSearchFocus}
                    onBlur={handleSearchBlur}
                    size="medium"
                    sx={(theme) => ({
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
                        borderRadius: '30px',
                        fontSize: '1.1rem',
                        fontWeight: 500,
                        height: '50px',
                        '& fieldset': { 
                          borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)',
                          borderWidth: '2px'
                        },
                        '&:hover fieldset': { 
                          borderColor: theme.palette.mode === 'dark' ? '#00d4aa' : '#6c63ff',
                          borderWidth: '2px'
                        },
                        '&.Mui-focused fieldset': { 
                          borderColor: theme.palette.mode === 'dark' ? '#00d4aa' : '#6c63ff',
                          borderWidth: '2px'
                        },
                        transition: 'all 0.3s ease'
                      },
                      '& .MuiInputBase-input': {
                        color: theme.palette.text.primary,
                        fontWeight: 500,
                        '&::placeholder': { 
                          color: theme.palette.text.secondary,
                          fontWeight: 400
                        }
                      }
                    })}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ 
                            color: 'text.secondary',
                            fontSize: '1.4rem',
                            mr: 1
                          }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton 
                            type="submit" 
                            size="medium" 
                            sx={{ 
                              color: 'primary.main',
                              '&:hover': {
                                backgroundColor: 'primary.main',
                                color: 'white'
                              },
                              transition: 'all 0.3s ease'
                            }}
                          >
                            <SearchIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                {/* Search Dropdown */}
                {searchDropdownOpen && topProducts.length > 0 && (
                  <Paper
                    sx={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      zIndex: 1000,
                      mt: 1,
                      borderRadius: '12px',
                      boxShadow: (theme) => theme.palette.mode === 'dark'
                        ? '0 8px 32px rgba(0, 0, 0, 0.4)'
                        : '0 8px 32px rgba(0, 0, 0, 0.15)',
                      border: (theme) => `1px solid ${theme.palette.divider}`,
                      maxHeight: 300,
                      overflow: 'auto'
                    }}
                  >
                    <Box sx={{ p: 1 }}>
                      <Typography variant="subtitle2" sx={{ p: 2, color: 'text.secondary', fontWeight: 600 }}>
                        מוצרים מובילים
                      </Typography>
                      {topProducts.map((product) => (
                        <Box
                          key={product.id}
                          onClick={() => handleProductSelect(product)}
                          sx={{
                            p: 2,
                            cursor: 'pointer',
                            borderRadius: '8px',
                            '&:hover': {
                              backgroundColor: 'action.hover'
                            },
                            transition: 'background-color 0.2s ease'
                          }}
                        >
                          <Typography variant="body1" fontWeight={500} sx={{ mb: 0.5 }}>
                            {product.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            ₪{product.price}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Paper>
                )}
              </Box>

              {/* Navigation Links */}
              <Box sx={{ display: 'flex', gap: 1 }} dir={lang === 'en' ? 'ltr' : 'rtl'}>
                {navItems.map((item) => (
                  <Button
                    key={item.path}
                    component={RouterLink}
                    to={item.path}
                    sx={{
                      color: 'inherit',
                      textTransform: 'none',
                      fontWeight: location.pathname === item.path ? 700 : 500,
                      fontSize: '1rem',
                      letterSpacing: '0.015em',
                      backgroundColor: 'transparent',
                      borderRadius: '8px',
                      px: 2.5,
                      py: 1.25,
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            </Box>
          )}

          {/* Right Side Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Language Switcher - dropdown */}
            <Box sx={(theme) => ({ display: 'flex', alignItems: 'center', gap: 1, mr: 1, border: `1px solid ${theme.palette.divider}`, borderRadius: '20px', px: 1 })}>
              <TranslateIcon fontSize="small" sx={{ color: 'inherit' }} />
              <Select
                size="small"
                value={lang}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'ar' | 'he')}
                variant="standard"
                disableUnderline
                sx={{ minWidth: 72, color: 'inherit' }}
              >
                <MenuItem value="en">EN</MenuItem>
                <MenuItem value="ar">AR</MenuItem>
                <MenuItem value="he">HE</MenuItem>
              </Select>
            </Box>

            {/* Theme Toggle - icon only */}
            <IconButton onClick={toggleMode} sx={{ color: 'inherit' }} aria-label="toggle theme">
              {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
            {!isMobile && (
              <>
                {/* Admin Dashboard - Prominent Button for admin users */}
                {user?.isAdmin && (
                  <Button
                    onClick={() => setAdminSidebarOpen(true)}
                    variant="contained"
                    startIcon={<DashboardIcon />}
                    sx={{ 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      borderRadius: '12px',
                      px: 3,
                      py: 1,
                      textTransform: 'none',
                      fontWeight: 600,
                      position: 'relative',
                      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
                      },
                      transition: 'all 0.2s ease-in-out',
                    }}
                    title="Admin Management Panel"
                  >
                    Admin Panel
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -3,
                        right: -3,
                        width: 10,
                        height: 10,
                        bgcolor: '#00d4aa',
                        borderRadius: '50%',
                        border: '2px solid white',
                        animation: 'pulse 2s infinite',
                        '@keyframes pulse': {
                          '0%': {
                            transform: 'scale(1)',
                            opacity: 1,
                          },
                          '50%': {
                            transform: 'scale(1.3)',
                            opacity: 0.7,
                          },
                          '100%': {
                            transform: 'scale(1)',
                            opacity: 1,
                          },
                        },
                      }}
                    />
                  </Button>
                )}

                {/* Shopping Cart */}
                <IconButton
                  component={RouterLink}
                  to="/cart"
                  sx={{ color: 'inherit' }}
                  title="Shopping Cart"
                >
                  <Badge badgeContent={cartCount} color="error">
                    <ShoppingBasketIcon />
                  </Badge>
                </IconButton>

                {/* Favorites */}
                <IconButton
                  component={RouterLink}
                  to="/favorites"
                  sx={{ color: 'inherit' }}
                >
                  <FavoriteIcon />
                </IconButton>
              </>
            )}

            {/* User Menu */}
            {isAuthenticated ? (
              <IconButton onClick={handleUserMenuOpen} sx={{ color: 'inherit' }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: '#00d4aa' }}>
                  {user?.name ? user.name.charAt(0).toUpperCase() : <PersonIcon />}
                </Avatar>
              </IconButton>
            ) : (
              !isMobile && (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    onClick={onLoginClick}
                    sx={{
                      color: 'inherit',
                      textTransform: 'none',
                      border: (theme) => `1px solid ${theme.palette.divider}`,
                      borderRadius: '20px',
                      px: 2,
                      '&:hover': {
                        backgroundColor: 'action.hover',
                        borderColor: 'divider',
                      },
                    }}
                  >
                    {t('nav.login')}
                  </Button>
                  <Button
                    onClick={onRegisterClick}
                    variant="contained"
                    sx={{
                      backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#00b894' : '#00d4aa',
                      color: 'white',
                      textTransform: 'none',
                      borderRadius: '20px',
                      px: 2,
                      '&:hover': {
                        backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#00a884' : '#00b894',
                      },
                    }}
                  >
                    {t('nav.signup')}
                  </Button>
                </Box>
              )
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton onClick={handleMobileMenuToggle} sx={{ color: 'inherit' }}>
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* User Menu Dropdown */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        sx={{
          '& .MuiPaper-root': (theme) => ({
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            borderRadius: '12px',
            mt: 1,
          }),
        }}
      >
        <MenuItem 
          component={RouterLink}
          to="/profile"
          onClick={handleUserMenuClose} 
          sx={{ color: 'inherit' }}
        >
          <PersonIcon sx={{ mr: 1 }} />
          {t('nav.profile')}
        </MenuItem>
        <MenuItem 
          component={RouterLink}
          to="/mycard"
          onClick={handleUserMenuClose} 
          sx={{ color: 'inherit' }}
        >
          <ShoppingBasketIcon sx={{ mr: 1 }} />
          {t('nav.myCard')}
        </MenuItem>
        <MenuItem onClick={handleSignOut} sx={{ color: 'inherit' }}>
          <LogoutIcon sx={{ mr: 1 }} />
          {t('nav.logout')}
        </MenuItem>
      </Menu>

      {/* Mobile Menu */}
      <MobileMenu />

      {/* Admin Sidebar */}
      {user?.isAdmin && (
        <AdminSidebar 
          open={adminSidebarOpen}
          onClose={() => setAdminSidebarOpen(false)}
        />
      )}
    </>
  );
}
