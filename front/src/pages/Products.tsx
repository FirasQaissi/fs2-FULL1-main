import { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography,
  CircularProgress,
  Alert,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Avatar,
  Fade,
  Slide,
  Grow
} from '@mui/material';
import {
  ViewModule as CardViewIcon,
  TableRows as TableViewIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Favorite as FavoriteIcon,
  ShoppingCart as ShoppingCartIcon
} from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AuthModal from '../components/auth/AuthModal';
import { productService } from '../services/productService';
import { favoritesService } from '../services/favoritesService';
import { cartService } from '../services/cartService';
import { authStorage } from '../services/authStorage';
import { useSettings } from '../providers/SettingsProvider';
import type { Product } from '../types/product';

export default function Products() {
  const { t } = useSettings();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [searchParams] = useSearchParams();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [favoritesLoading, setFavoritesLoading] = useState<Set<string>>(new Set());
  
  const isAuthenticated = authStorage.isAuthenticated();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await productService.getAllProducts();
        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts);
        
        // Load favorites if user is authenticated
        if (isAuthenticated) {
          try {
            const favoriteProducts = new Set<string>();
            for (const product of fetchedProducts) {
              const productId = product.id || product._id;
              if (productId) {
                const { isFavorite } = await favoritesService.isFavorite(productId);
                if (isFavorite) {
                  favoriteProducts.add(productId);
                }
              }
            }
            setFavorites(favoriteProducts);
          } catch (error) {
            console.error('Failed to load favorites:', error);
          }
        }
      } catch (err) {
        setError('Failed to load products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [isAuthenticated]);

  useEffect(() => {
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.descriptions.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.features.some(feature => 
          feature.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchParams, products]);

  const openAuthModal = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const handleFavoriteToggle = async (productId: string) => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }

    if (favoritesLoading.has(productId)) {
      return; // Prevent multiple simultaneous requests
    }

    setFavoritesLoading(prev => new Set(prev).add(productId));

    try {
      const isFavorite = favorites.has(productId);
      
      if (isFavorite) {
        await favoritesService.removeFromFavorites(productId);
        setFavorites(prev => {
          const newFavorites = new Set(prev);
          newFavorites.delete(productId);
          return newFavorites;
        });
      } else {
        await favoritesService.addToFavorites(productId);
        setFavorites(prev => new Set(prev).add(productId));
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    } finally {
      setFavoritesLoading(prev => {
        const newLoading = new Set(prev);
        newLoading.delete(productId);
        return newLoading;
      });
    }
  };

  const handleAddToCart = (product: Product) => {
    try {
      cartService.addToCart(product);
      // Trigger cart update event
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh',   bgcolor: 'background.default'   }}>
      <Navbar onLoginClick={() => openAuthModal('login')} onRegisterClick={() => openAuthModal('register')} />

      {/* Hero Section */}
      <Box
        sx={{
          background: (theme) => theme.palette.mode === 'dark' 
            ? 'linear-gradient(135deg,rgb(0, 0, 0) 0%,rgb(78, 73, 73) 100%)'
            : 'linear-gradient(135deg,rgb(253, 254, 253) 0%,rgb(235, 235, 235) 100%)',
          py: 8,
          position: 'relative',
          overflow: 'hidden'

        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1, width: '100%', height: '100%' }}>
            <Typography 
              variant="h1" 
              fontWeight={900}
              fontSize={{ xs: '2.5rem', md: '4rem' }}
              sx={{ 
                mb: 3,
                background: (theme) => theme.palette.mode === 'dark'
                  ? 'linear-gradient(45deg,rgb(255, 255, 255),rgb(246, 248, 248))'
                  : 'linear-gradient(45deg,rgb(5, 6,rgb(98, 107, 105)d4aa)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                maxWidth: '800px',
                mx: 'auto'
              }}
            >
              {t('products.title')}
            </Typography>
            <Typography 
              variant="h3" 
              sx={{ 
                color: 'text.primary',
            
                maxWidth: '1000px',
                mx: 'auto',
                fontWeight: 400,
                lineHeight: 1.6
              }}
            >
              {t('products.subtitle')}
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : (
            <Box>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 4,
                flexWrap: 'wrap',
                gap: 3
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                  <Typography variant="h4" fontWeight={700}>
                    {t('products.count')} ({filteredProducts.length})
                  </Typography>
                  {searchParams.get('search') && (
                    <Box sx={{ 
                      px: 3, 
                      py: 1, 
                      bgcolor: 'primary.main',
                      color: 'white',
                      borderRadius: '25px',
                      fontSize: '0.875rem',
                      fontWeight: 500
                    }}>
                      Search: "{searchParams.get('search')}"
                    </Box>
                  )}
                </Box>
                
                {/* View Mode Switcher */}
                <ToggleButtonGroup
                  value={viewMode}
                  exclusive
                  onChange={(_, newView) => newView && setViewMode(newView)}
                  aria-label="view mode"
                  sx={{
                    bgcolor: 'background.paper',
                    borderRadius: '12px',
                    '& .MuiToggleButton-root': {
                      border: 'none',
                      borderRadius: '12px !important',
                      px: 3,
                      py: 1,
                      textTransform: 'none',
                      fontWeight: 600,
                      '&.Mui-selected': {
                        bgcolor: 'primary.main',
                        color: 'white',
                        '&:hover': {
                          bgcolor: 'primary.dark',
                        },
                      },
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    },
                  }}
                >
                  <ToggleButton value="card" aria-label="card view">
                    <CardViewIcon sx={{ mr: 1 }} />
                    Card View
                  </ToggleButton>
                  <ToggleButton value="table" aria-label="table view">
                    <TableViewIcon sx={{ mr: 1 }} />
                    Table View
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
              
              {/* Card View */}
              {viewMode === 'card' && (
                <Fade in={viewMode === 'card'} timeout={500}>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(3, 1fr)',
                        lg: 'repeat(5, 1fr)', // 5 cards per row as requested
                      },
                      gap: { xs: 3, md: 4 },
                      width: '100%',
                    }}
                  >
                    {filteredProducts.map((product, index) => (
                      <Slide
                        key={product.id || product._id}
                        direction="down"
                        in={true}
                        timeout={300 + index * 100} // Staggered animation
                        style={{ transitionDelay: `${index * 50}ms` }}
                      >
                        <Box
                          sx={{
                            transform: 'translateZ(0)', // Enable hardware acceleration
                            transition: 'transform 0.3s ease-in-out',
                            '&:hover': {
                              transform: 'translateY(-12px) scale(1.02)',
                            },
                          }}
                        >
                          <ProductCard product={product} />
                        </Box>
                      </Slide>
                    ))}
                  </Box>
                </Fade>
              )}

              {/* Table View */}
              {viewMode === 'table' && (
                <Fade in={viewMode === 'table'} timeout={500}>
                  <Paper
                    elevation={0}
                    sx={{
                      borderRadius: '16px',
                      overflow: 'hidden',
                      border: '1px solid',
                      borderColor: 'divider',
                      width: '100%',
                    }}
                  >
                    <TableContainer>
                      <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                          <TableRow sx={{ bgcolor: 'action.hover' }}>
                            <TableCell sx={{ fontWeight: 700, fontSize: '1.1rem' }}>Product</TableCell>
                            <TableCell sx={{ fontWeight: 700, fontSize: '1.1rem' }}>Version</TableCell>
                            <TableCell sx={{ fontWeight: 700, fontSize: '1.1rem' }}>Price</TableCell>
                            <TableCell sx={{ fontWeight: 700, fontSize: '1.1rem' }}>Features</TableCell>
                            <TableCell sx={{ fontWeight: 700, fontSize: '1.1rem' }}>Description</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredProducts.map((product, index) => (
                            <Grow
                              key={product.id || product._id}
                              in={true}
                              timeout={300 + index * 100}
                              style={{ transitionDelay: `${index * 50}ms` }}
                            >
                              <TableRow
                                sx={{
                                  '&:hover': {
                                    bgcolor: 'action.hover',
                                    transform: 'scale(1.01)',
                                  },
                                  transition: 'all 0.2s ease-in-out',
                                  cursor: 'pointer',
                                }}
                                onClick={() => window.open(`/products/${product.id || product._id}`, '_blank')}
                              >
                                <TableCell>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar
                                      src={product.image}
                                      alt={product.name}
                                      sx={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: '12px',
                                        border: '2px solid',
                                        borderColor: 'divider',
                                      }}
                                    />
                                    <Box>
                                      <Typography
                                        variant="h6"
                                        sx={{
                                          fontWeight: 700,
                                          fontSize: '1.1rem',
                                          lineHeight: 1.3,
                                          mb: 0.5,
                                        }}
                                      >
                                        {product.name}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary">
                                        ID: {(product.id || product._id)?.slice(-8)}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <Chip
                                    label={`v${product.version}`}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                    sx={{ fontWeight: 600 }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    variant="h6"
                                    color="primary"
                                    sx={{ fontWeight: 700, fontSize: '1.2rem' }}
                                  >
                                    ${product.price}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {product.features.slice(0, 3).map((feature, idx) => (
                                      <Chip
                                        key={idx}
                                        label={feature}
                                        size="small"
                                        variant="outlined"
                                        sx={{ fontSize: '0.75rem' }}
                                      />
                                    ))}
                                    {product.features.length > 3 && (
                                      <Chip
                                        label={`+${product.features.length - 3}`}
                                        size="small"
                                        color="secondary"
                                        sx={{ fontSize: '0.75rem' }}
                                      />
                                    )}
                                  </Box>
                                </TableCell>
                                <TableCell sx={{ maxWidth: 300 }}>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      display: '-webkit-box',
                                      WebkitLineClamp: 2,
                                      WebkitBoxOrient: 'vertical',
                                      lineHeight: 1.4,
                                    }}
                                  >
                                    {product.descriptions}
                                  </Typography>
                                </TableCell>
                                <TableCell align="center">
                                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                    <IconButton
                                      size="small"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const productId = product.id || product._id;
                                        if (productId) {
                                          handleFavoriteToggle(productId);
                                        }
                                      }}
                                      disabled={favoritesLoading.has(product.id || product._id || '')}
                                      sx={{
                                        color: favorites.has(product.id || product._id || '') ? 'error.main' : 'text.secondary',
                                        '&:hover': {
                                          bgcolor: 'error.main',
                                          color: 'white',
                                        },
                                        '&:disabled': {
                                          opacity: 0.6,
                                        },
                                      }}
                                    >
                                      {favorites.has(product.id || product._id || '') ? (
                                        <FavoriteIcon />
                                      ) : (
                                        <FavoriteBorderIcon />
                                      )}
                                    </IconButton>
                                    <IconButton
                                      size="small"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleAddToCart(product);
                                      }}
                                      sx={{
                                        '&:hover': {
                                          bgcolor: 'primary.main',
                                          color: 'white',
                                        },
                                      }}
                                    >
                                      <ShoppingCartIcon />
                                    </IconButton>
                                  </Box>
                                </TableCell>
                              </TableRow>
                            </Grow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Fade>
              )}
              {filteredProducts.length === 0 && !loading && (
                <Box 
                  sx={{
                    textAlign: 'center',
                    py: 8,
                    px: 4,
                    bgcolor: 'background.paper',
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Typography variant="h4" color="text.secondary" gutterBottom>
                    🔍
                  </Typography>
                  <Typography variant="h5" fontWeight={600} gutterBottom>
                    {searchParams.get('search') 
                      ? `${t('products.noSearchResults')} "${searchParams.get('search')}"`
                      : t('products.noProducts')
                    }
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    {searchParams.get('search')
                      ? 'Try adjusting your search terms or browse all products.'
                      : 'Check back soon for new products!'
                    }
                  </Typography>
                  {searchParams.get('search') && (
                    <Button
                      variant="outlined"
                      onClick={() => window.location.href = '/products'}
                      sx={{ mt: 2 }}
                    >
                      View All Products
                    </Button>
                  )}
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Container>

      {/* Footer */}
      <Footer />

      {/* Auth Modal */}
      <AuthModal 
        open={authModalOpen}
        onClose={closeAuthModal}
        initialMode={authModalMode}
      />
    </Box>
  );
}
