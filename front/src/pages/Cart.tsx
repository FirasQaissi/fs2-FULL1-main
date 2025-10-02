import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  TextField,
  Divider,
  Card,
  CardContent,
  Snackbar,
  Alert,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  ShoppingCart as ShoppingCartIcon,
  ShoppingBag as ShoppingBagIcon
} from '@mui/icons-material';
import Navbar from '../components/Navbar';
import AuthModal from '../components/auth/AuthModal';
import { cartService, type CartItem } from '../services/cartService';

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [snack, setSnack] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ 
    open: false, message: '', severity: 'success' 
  });

  useEffect(() => {
    setCartItems(cartService.getCart());
  }, []);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    const updatedCart = cartService.updateQuantity(productId, newQuantity);
    setCartItems(updatedCart);
  };

  const handleRemoveItem = (productId: string) => {
    const updatedCart = cartService.removeFromCart(productId);
    setCartItems(updatedCart);
    setSnack({ open: true, message: 'Item removed from cart', severity: 'success' });
  };

  const handleClearCart = () => {
    cartService.clearCart();
    setCartItems([]);
    setSnack({ open: true, message: 'Cart cleared', severity: 'success' });
  };

  const openAuthModal = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const total = cartService.getCartTotal();
  const itemCount = cartService.getCartCount();

  if (cartItems.length === 0) {
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
            <ShoppingCartIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Your Cart is Empty
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              Add some products to get started!
            </Typography>
            <Button 
              variant="contained" 
              href="/products"
              size="large"
              sx={{ px: 4, py: 1.5 }}
            >
              Browse Products
            </Button>
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <ShoppingBagIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Box>
            <Typography variant="h3" fontWeight={700} gutterBottom>
              Shopping Cart
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {itemCount} item{itemCount !== 1 ? 's' : ''} in your cart
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={4}>
          {/* Cart Items */}
              {/* Cart Items */}
          <Grid item xs={12} md={8}>
            <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="center">Quantity</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Total</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cartItems.map((item) => {
                      const productId = item.id || item._id;
                      return (
                        <TableRow key={productId}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Box
                                component="img"
                                src={item.image}
                                alt={item.name}
                                sx={{
                                  width: 60,
                                  height: 60,
                                  objectFit: 'contain',
                                  borderRadius: 1,
                                  border: '1px solid',
                                  borderColor: 'divider',
                                }}
                              />
                              <Box>
                                <Typography variant="subtitle1" fontWeight={600}>
                                  {item.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Version: {item.version}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                              <IconButton
                                size="small"
                                onClick={() => handleQuantityChange(productId, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <RemoveIcon />
                              </IconButton>
                              <TextField
                                size="small"
                                value={item.quantity}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value);
                                  if (!isNaN(value) && value > 0) {
                                    handleQuantityChange(productId, value);
                                  }
                                }}
                                sx={{ width: 60 }}
                                inputProps={{ 
                                  style: { textAlign: 'center' },
                                  min: 1
                                }}
                              />
                              <IconButton
                                size="small"
                                onClick={() => handleQuantityChange(productId, item.quantity + 1)}
                              >
                                <AddIcon />
                              </IconButton>
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Typography fontWeight={600}>
                              ${item.price.toFixed(2)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography fontWeight={600} color="primary">
                              ${(item.price * item.quantity).toFixed(2)}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              color="error"
                              onClick={() => handleRemoveItem(productId)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button 
                  variant="outlined" 
                  color="error"
                  onClick={handleClearCart}
                >
                  Clear Cart
                </Button>
                <Button variant="text" href="/products">
                  Continue Shopping
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Cart Summary */}
          <Grid item xs={12} md={4}>
            <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', position: 'sticky', top: 20 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Order Summary
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography>Subtotal ({itemCount} items)</Typography>
                  <Typography fontWeight={600}>${total.toFixed(2)}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography>Shipping</Typography>
                  <Typography fontWeight={600} color="success.main">Free</Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6" fontWeight={700}>Total</Typography>
                  <Typography variant="h6" fontWeight={700} color="primary">
                    ${total.toFixed(2)}
                  </Typography>
                </Box>
                
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{ mb: 2, py: 1.5 }}
                  onClick={() => setSnack({ open: true, message: 'Checkout functionality coming soon!', severity: 'success' })}
                >
                  Proceed to Checkout
                </Button>
                
                <Typography variant="body2" color="text.secondary" align="center">
                  Secure checkout with SSL encryption
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
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

      {/* Auth Modal */}
      <AuthModal 
        open={authModalOpen}
        onClose={closeAuthModal}
        initialMode={authModalMode}
      />
    </Box>
  );
}
