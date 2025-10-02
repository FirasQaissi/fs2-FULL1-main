
import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Stack,
  IconButton,
  Snackbar,
  Alert,
  Button
} from '@mui/material';
import { 
  Favorite as FavoriteIcon, 
  FavoriteBorder as FavoriteBorderIcon,
  ShoppingCart as ShoppingCartIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../types/product';
import { favoritesService } from '../services/favoritesService';
import { authStorage } from '../services/authStorage';
import { cartService } from '../services/cartService';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ 
    open: false, message: '', severity: 'success' 
  });
  
  const isAuthenticated = authStorage.isAuthenticated();
  
  useEffect(() => {
    const productId = product.id || (product as { _id?: string })._id;
    if (isAuthenticated && productId) {
      favoritesService.isFavorite(productId)
        .then(({ isFavorite }) => setIsFavorite(isFavorite))
        .catch(() => {}); // Silently fail for favorites check
    }
  }, [product, isAuthenticated]);

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      setSnack({ open: true, message: 'Please login to add favorites', severity: 'error' });
      return;
    }

    const productId = product.id || (product as { _id?: string })._id;
    if (loading || !productId) return;
    
    setLoading(true);
    try {
      if (isFavorite) {
        await favoritesService.removeFromFavorites(productId);
        setIsFavorite(false);
        setSnack({ open: true, message: 'Removed from favorites', severity: 'success' });
      } else {
        await favoritesService.addToFavorites(productId);
        setIsFavorite(true);
        setSnack({ open: true, message: 'Added to favorites', severity: 'success' });
      }
    } catch {
      setSnack({ open: true, message: 'Failed to update favorites', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = () => {
    const productId = product.id || (product as { _id?: string })._id;
    if (productId) {
      navigate(`/products/${productId}`);
    }
  };

  return (
    <>
      <Card
        sx={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          cursor: 'pointer',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 25px rgba(37, 20, 168, 0.58)',
          },
        }}
        onClick={handleCardClick}
      >
        {/* Favorite Button */}
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            handleFavoriteToggle();
          }}
          disabled={loading}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'rgba(242, 237, 237, 0.06)',
            backdropFilter: 'blur(4px)',
            zIndex: 1,
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 1)',
            },
          }}
        >
          {isFavorite ? (
            <FavoriteIcon color="error" />
          ) : (
            <FavoriteBorderIcon />
          )}
        </IconButton>

        <CardMedia
          component="img"
          height="320"
          image={product.image}
          alt={product.name}
          sx={{
            objectFit: 'contain',
            backgroundColor: '#f8f9fa',
            padding: '16px',
            borderRadius: '8px 8px 0 0',
          }}
        />
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', textAlign: 'center', p: 2 }}>
          <Typography 
            variant="h6" 
            component="h2" 
            gutterBottom
            sx={{ 
              fontWeight: 800,
              fontSize: '1.1rem',
              lineHeight: 1.3,
              mb: 1,
              fontFamily: '"Poppins", "Inter", cursive',
            }}
          >
            {product.name}
          </Typography>
          
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 2, 
              flexGrow: 1,
              fontSize: '0.875rem',
              lineHeight: 1.4,
              fontFamily: '"Inter",cursive',
            }}
          >
            {product.descriptions}
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="primary" fontWeight="600" sx={{ fontSize: '0.8rem' }}>
              Version: {product.version}
            </Typography>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" fontWeight="600" gutterBottom sx={{ fontSize: '0.8rem' }}>
              Features:
            </Typography>
            <Stack direction="row" spacing={0.5} useFlexGap flexWrap="wrap" justifyContent="center">
              {product.features.slice(0, 3).map((feature, index) => (
                <Chip
                  key={index}
                  label={feature}
                  size="small"
                  variant="outlined"
                  sx={{ 
                    fontSize: '0.7rem',
                    height: '24px',
                    fontFamily: '"Inter",cursive',
                  }}
                />
              ))}
              {product.features.length > 3 && (
                <Chip
                  label={`+${product.features.length - 3} more`}
                  size="small"
                  variant="outlined"
                  color="primary"
                  sx={{ fontSize: '0.7rem', height: '24px' }}
                />
              )}
            </Stack>
          </Box>
          
          <Box sx={{ mt: 'auto' }}>
            <Typography 
              variant="h5" 
              color="primary" 
              fontWeight="bold" 
              sx={{ 
                mb: 2,
                fontSize: '1.5rem',
                fontFamily: '"Poppins", cursive',
              }}
            >
              ${product.price}
            </Typography>
            
            <Button
              variant="contained"
              startIcon={<ShoppingCartIcon />}
              fullWidth
              onClick={() => {
                try {
                  cartService.addToCart(product);
                  setSnack({ open: true, message: 'Added to cart!', severity: 'success' });
                } catch {
                  setSnack({ open: true, message: 'Failed to add to cart', severity: 'error' });
                }
              }}
              sx={{
                py: 1,
                fontWeight: 900,
                textTransform: 'none',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontFamily: '"Inter", cursive',
              }}
            >
              Add to Cart
            </Button>
          </Box>
        </CardContent>
      </Card>
      
      {/* Snackbar for feedback */}
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
    </>
  );
}
