import { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  Snackbar
} from '@mui/material';
// Avoid Grid type/version conflicts on Vercel; use Box grid
import { 
  FavoriteOutlined as FavoriteIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import ProductCard from '../components/ProductCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AuthModal from '../components/auth/AuthModal';
import { favoritesService } from '../services/favoritesService';
import { authStorage } from '../services/authStorage';
import { useSettings } from '../providers/SettingsProvider';
import type { Product } from '../types/product';

export default function Favorites() {
  const { t } = useSettings();
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [snack, setSnack] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ 
    open: false, message: '', severity: 'success' 
  });
  
  const isAuthenticated = authStorage.isAuthenticated();

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const { favorites } = await favoritesService.getFavorites();
        setFavorites(favorites);
      } catch (err) {
        setError('Failed to load favorites');
        console.error('Error fetching favorites:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [isAuthenticated]);

  const openAuthModal = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const handleRemoveFromFavorites = async (productId: string) => {
    try {
      await favoritesService.removeFromFavorites(productId);
      setFavorites(prevFavorites => prevFavorites.filter(product => 
        (product.id || (product as Product & { _id?: string })._id) !== productId
      ));
      setSnack({ open: true, message: t('favorites.removedFromFavorites'), severity: 'success' });
    } catch (err) {
      setSnack({ open: true, message: t('favorites.failedToUpdate'), severity: 'error' });
      console.error('Error removing from favorites:', err);
    }
  };

  if (!isAuthenticated) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Navbar onLoginClick={() => openAuthModal('login')} onRegisterClick={() => openAuthModal('register')} />
        
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            minHeight: '60vh',
            textAlign: 'center'
          }}>
            <FavoriteIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h4" fontWeight={700} gutterBottom>
              {t('favorites.loginRequired')}
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              {t('favorites.loginMessage')}
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

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar onLoginClick={() => openAuthModal('login')} onRegisterClick={() => openAuthModal('register')} />

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FavoriteIcon sx={{ fontSize: 40, color: 'error.main' }} />
            <Box>
              <Typography variant="h3" fontWeight={700} gutterBottom>
                {t('favorites.title')}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {t('favorites.subtitle')}
              </Typography>
            </Box>
          </Box>

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
              <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
                {t('favorites.title')} ({favorites.length})
              </Typography>
              
              {favorites.length === 0 ? (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  minHeight: '40vh',
                  textAlign: 'center'
                }}>
                  <FavoriteIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h5" fontWeight={600} gutterBottom>
                    {t('favorites.noFavorites')}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {t('favorites.noFavoritesMessage')}
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 3 }}>
                  {favorites.map((product) => {
                    const productId = product.id || (product as Product & { _id?: string })._id;
                    return (
                      <Box key={productId}>
                        <Box sx={{ position: 'relative' }}>
                          <ProductCard product={product} />
                          <IconButton
                            onClick={() => handleRemoveFromFavorites(String(productId))}
                            sx={{
                              position: 'absolute',
                              top: 8,
                              left: 8,
                              bgcolor: 'rgba(244, 67, 54, 0.9)',
                              color: 'white',
                              zIndex: 2,
                              '&:hover': {
                                bgcolor: 'rgba(244, 67, 54, 1)',
                              },
                            }}
                            title={t('favorites.removeFromFavorites')}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Container>

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
