/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import { Box, Container, Typography, Card, CardContent, Button, IconButton, Divider } from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import Navbar from '../components/Navbar';
import AuthModal from '../components/auth/AuthModal';
import { authStorage } from '../services/authStorage';

// Mock cart data - in a real app, this would come from a cart service
const mockCartItems = [
  {
    id: '1',
    name: 'Allegion Schlage Omnia Smart Lock',
    price: 299.99,
    quantity: 1,
    image: '/images/AllegionShlageOmnia_SatinNickel_Front_DigitsOn_Final_02.png.thumb.1280.1280_394x.webp'
  },
  {
    id: '2',
    name: 'Ultra-Secure Smart Lock Pro',
    price: 449.99,
    quantity: 2,
    image: '/images/Hd43ab953807844cf9cabc6346c167e89V.avif'
  }
];

export default function MyCard() {
  const [cartItems, setCartItems] = useState(mockCartItems);
  const isAuthenticated = authStorage.getToken();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  const openAuthModal = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  if (!isAuthenticated) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>
        <Navbar onLoginClick={() => openAuthModal('login')} onRegisterClick={() => openAuthModal('register')} />
        <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Please sign in to view your cart
          </Typography>
          <Typography variant="body1" color="text.secondary">
            You need to be logged in to access your shopping cart.
          </Typography>
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
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      <Navbar onLoginClick={() => openAuthModal('login')} onRegisterClick={() => openAuthModal('register')} />
      
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" fontWeight={700} gutterBottom sx={{ color: '#1a1a1a', mb: 4 }}>
          My Shopping Cart
        </Typography>

        {cartItems.length === 0 ? (
          <Card sx={{ p: 6, textAlign: 'center', borderRadius: '16px' }}>
            <Typography variant="h5" gutterBottom>
              Your cart is empty
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Add some products to get started!
            </Typography>
            <Button
              variant="contained"
              href="/products"
              sx={{
                backgroundColor: '#00d4aa',
                color: 'white',
                borderRadius: '12px',
                px: 4,
                py: 1.5,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: '#00b894',
                },
              }}
            >
              Browse Products
            </Button>
          </Card>
        ) : (
          <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', lg: 'row' } }}>
            {/* Cart Items */}
            <Box sx={{ flex: 2 }}>
              {cartItems.map((item, _index) => (
                <Card
                  key={item.id}
                  sx={{
                    mb: 2,
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                      <Box
                        sx={{
                          width: 100,
                          height: 100,
                          borderRadius: '12px',
                          backgroundImage: `url(${item.image})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundColor: '#f5f5f5',
                        }}
                      />
                      
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom sx={{ color: '#1a1a1a' }}>
                          {item.name}
                        </Typography>
                        <Typography variant="h5" color="primary" fontWeight={700}>
                          ${item.price}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          sx={{ border: '1px solid #ddd' }}
                        >
                          <RemoveIcon />
                        </IconButton>
                        <Typography variant="h6" sx={{ minWidth: 40, textAlign: 'center' }}>
                          {item.quantity}
                        </Typography>
                        <IconButton
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          sx={{ border: '1px solid #ddd' }}
                        >
                          <AddIcon />
                        </IconButton>
                      </Box>

                      <Typography variant="h6" fontWeight={700} sx={{ minWidth: 100, textAlign: 'right' }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </Typography>

                      <IconButton
                        onClick={() => removeItem(item.id)}
                        sx={{ color: 'error.main' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>

            {/* Order Summary */}
            <Box sx={{ flex: 1 }}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                  position: 'sticky',
                  top: 100,
                }}
              >
                <Typography variant="h5" fontWeight={600} gutterBottom sx={{ color: '#1a1a1a' }}>
                  Order Summary
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  {cartItems.map((item) => (
                    <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {item.name} x{item.quantity}
                      </Typography>
                      <Typography variant="body2">
                        ${(item.price * item.quantity).toFixed(2)}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6" fontWeight={600} sx={{ color: '#1a1a1a' }}>
                    Total
                  </Typography>
                  <Typography variant="h5" fontWeight={700} color="primary">
                    ${getTotalPrice().toFixed(2)}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: '#00d4aa',
                    color: 'white',
                    borderRadius: '12px',
                    py: 2,
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: '#00b894',
                    },
                  }}
                >
                  Proceed to Checkout
                </Button>
              </Card>
            </Box>
          </Box>
        )}
      </Container>
      <AuthModal 
        open={authModalOpen}
        onClose={closeAuthModal}
        initialMode={authModalMode}
      />
    </Box>
  );
}
