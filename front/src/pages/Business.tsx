import { Box, Container, Typography } from '@mui/material';
import Navbar from '../components/Navbar';

export default function Business() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      <Navbar onLoginClick={() => {}} onRegisterClick={() => {}} />
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" fontWeight={800}>Business Dashboard</Typography>
        <Typography sx={{ mt: 2 }}>
          Business users can manage their content here.
        </Typography>
      </Container>
    </Box>
  );
}


