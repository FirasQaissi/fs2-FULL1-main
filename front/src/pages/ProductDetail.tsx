import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Stack,
  IconButton,
  Snackbar,
  Alert,
  Divider,
  Card,
  CardContent,
  Rating,
  Breadcrumbs,
  Link,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ShoppingCart as ShoppingCartIcon,
  Share as ShareIcon,
  Security as SecurityIcon,
  Smartphone as SmartphoneIcon,
  Wifi as WifiIcon,
  Fingerprint as FingerprintIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { productService } from '../services/productService';
import { favoritesService } from '../services/favoritesService';
import { cartService } from '../services/cartService';
import { authStorage } from '../services/authStorage';
import { useSettings } from '../providers/SettingsProvider';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AuthModal from '../components/auth/AuthModal';
import type { Product } from '../types/product';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useSettings();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [snack, setSnack] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false, message: '', severity: 'success'
  });

  const isAuthenticated = authStorage.isAuthenticated();

  useEffect(() => {
    if (!id) {
      navigate('/products');
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const fetchedProduct = await productService.getProductById(id);
        setProduct(fetchedProduct);

        // Check if product is in favorites
        if (isAuthenticated) {
          const { isFavorite: favoriteStatus } = await favoritesService.isFavorite(id);
          setIsFavorite(favoriteStatus);
        }
      } catch (err) {
        setError('Product not found');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate, isAuthenticated]);

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }

    if (!product || !id) return;

    try {
      if (isFavorite) {
        await favoritesService.removeFromFavorites(id);
        setIsFavorite(false);
        setSnack({ open: true, message: t('favorites.removedFromFavorites'), severity: 'success' });
      } else {
        await favoritesService.addToFavorites(id);
        setIsFavorite(true);
        setSnack({ open: true, message: t('favorites.addedToFavorites'), severity: 'success' });
      }
    } catch (err) {
      setSnack({ open: true, message: t('favorites.failedToUpdate'), severity: 'error' });
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    try {
      cartService.addToCart(product, 1);
      setSnack({ open: true, message: t('products.addedToCart'), severity: 'success' });
      
      // Dispatch custom event to update cart count
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      setSnack({ open: true, message: 'Failed to add to cart', severity: 'error' });
    }
  };

  const openAuthModal = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const getFeatureIcon = (feature: string) => {
    const featureLower = feature.toLowerCase();
    if (featureLower.includes('fingerprint') || featureLower.includes('biometric')) {
      return <FingerprintIcon />;
    }
    if (featureLower.includes('wifi') || featureLower.includes('wireless')) {
      return <WifiIcon />;
    }
    if (featureLower.includes('app') || featureLower.includes('mobile')) {
      return <SmartphoneIcon />;
    }
    if (featureLower.includes('security') || featureLower.includes('encryption')) {
      return <SecurityIcon />;
    }
    return <LockIcon />;
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Navbar onLoginClick={() => openAuthModal('login')} onRegisterClick={() => openAuthModal('register')} />
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <Typography variant="h6">Loading product...</Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Navbar onLoginClick={() => openAuthModal('login')} onRegisterClick={() => openAuthModal('register')} />
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h4" gutterBottom>
              Product Not Found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              The product you're looking for doesn't exist or has been removed.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/products')}
              startIcon={<ArrowBackIcon />}
            >
              Back to Products
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar onLoginClick={() => openAuthModal('login')} onRegisterClick={() => openAuthModal('register')} />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 4 }}>
          <Link 
            component="button" 
            variant="body2" 
            onClick={() => navigate('/')}
            sx={{ textDecoration: 'none' }}
          >
            Home
          </Link>
          <Link 
            component="button" 
            variant="body2" 
            onClick={() => navigate('/products')}
            sx={{ textDecoration: 'none' }}
          >
            Products
          </Link>
          <Typography variant="body2" color="text.primary">
            {product.name}
          </Typography>
        </Breadcrumbs>

        {/* Back Button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/products')}
          sx={{ mb: 4 }}
          variant="outlined"
        >
          Back to All Products
        </Button>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 6 }}>
          {/* Product Image */}
          <Box>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 3,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                textAlign: 'center',
              }}
            >
              <Box
                component="img"
                src={product.image}
                alt={product.name}
                sx={{
                  width: '100%',
                  maxWidth: 400,
                  height: 'auto',
                  objectFit: 'contain',
                  borderRadius: 2,
                }}
              />
            </Paper>
          </Box>

          {/* Product Details */}
          <Box>
            <Stack spacing={3}>
              {/* Product Header */}
              <Box>
                <Typography variant="h3" fontWeight={700} gutterBottom>
                  {product.name}
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                  Version {product.version}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Rating value={4.5} precision={0.5} readOnly />
                  <Typography variant="body2" color="text.secondary">
                    (4.5/5 based on 127 reviews)
                  </Typography>
                </Box>
                <Typography variant="h4" color="primary" fontWeight={700}>
                  ₪{product.price.toFixed(2)}
                </Typography>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingCartIcon />}
                  onClick={handleAddToCart}
                  sx={{ flex: 1, minWidth: 200 }}
                >
                  Add to Cart
                </Button>
                <IconButton
                  onClick={handleFavoriteToggle}
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    p: 1.5,
                  }}
                >
                  {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                </IconButton>
                <IconButton
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    p: 1.5,
                  }}
                >
                  <ShareIcon />
                </IconButton>
              </Box>

              {/* Product Description */}
              <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Product Description
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {product.descriptions}
                  </Typography>
                </CardContent>
              </Card>

              {/* Features */}
              <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Key Features
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                    {product.features.map((feature, index) => (
                      <Box key={index}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1 }}>
                          <Box sx={{ color: 'primary.main' }}>
                            {getFeatureIcon(feature)}
                          </Box>
                          <Typography variant="body2" fontWeight={500}>
                            {feature}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>

              {/* Specifications */}
              <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Specifications
                  </Typography>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                      <Typography variant="body2" color="text.secondary">Model</Typography>
                      <Typography variant="body2" fontWeight={500}>{product.name}</Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                      <Typography variant="body2" color="text.secondary">Version</Typography>
                      <Typography variant="body2" fontWeight={500}>{product.version}</Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                      <Typography variant="body2" color="text.secondary">Price</Typography>
                      <Typography variant="body2" fontWeight={500} color="primary">
                        ₪{product.price.toFixed(2)}
                      </Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                      <Typography variant="body2" color="text.secondary">Warranty</Typography>
                      <Typography variant="body2" fontWeight={500}>2 Years</Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                      <Typography variant="body2" color="text.secondary">Shipping</Typography>
                      <Typography variant="body2" fontWeight={500} color="success.main">
                        Free Shipping
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Box>
        </Box>
      </Container>

      {/* Footer */}
      <Footer />

      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
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
