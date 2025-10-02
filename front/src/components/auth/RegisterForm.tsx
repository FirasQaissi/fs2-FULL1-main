import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { Alert, Box, Button, Checkbox, FormControlLabel, Stack, TextField } from '@mui/material';
import { authService } from '../../services/authService';
import { authStorage } from '../../services/authStorage';
import type { RegisterRequest, User } from '../../types/auth';

type Props = {
  onSuccess?: (user: User) => void;
};

export default function RegisterForm({ onSuccess }: Props) {
  const [values, setValues] = useState<RegisterRequest>({ name: '', email: '', password : '', phone: '', isBusiness: false });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nameError = useMemo(() => {
    return values.name.length === 0 ? '' : values.name.trim().length < 2 ? 'Enter your full name' : '';
  }, [values.name]);
  
  const emailError = useMemo(() => {
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return values.email.length > 0 && !EMAIL_REGEX.test(values.email) ? 'Enter a valid email' : '';
  }, [values.email]);
  
  const passwordError = useMemo(() => {
    const PASSWORD_REGEX = /^(?=.*[!@%$#^&*\-_]).{8,}$/;
    return values.password.length > 0 && !PASSWORD_REGEX.test(values.password)
      ? 'Min 8 chars, include !@%$#^&*-_'
      : '';
  }, [values.password]);
  
  const phoneError = useMemo(() => {
    const ISRAELI_PHONE_REGEX = /^05[0-9]{8}$/;
    return values.phone && values.phone.length > 0 && !ISRAELI_PHONE_REGEX.test(values.phone)
      ? 'Enter valid Israeli mobile (05XXXXXXXX)'
      : '';
  }, [values.phone]);
  
  const isValid = useMemo(() => {
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const PASSWORD_REGEX = /^(?=.*[!@%$#^&*\-_]).{8,}$/;
    const ISRAELI_PHONE_REGEX = /^05[0-9]{8}$/;
    return values.name.trim().length >= 2 && 
           EMAIL_REGEX.test(values.email) && 
           PASSWORD_REGEX.test(values.password) &&
           (!values.phone || ISRAELI_PHONE_REGEX.test(values.phone));
  }, [values.name, values.email, values.password, values.phone]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await authService.register(values);
      if (res.token) {
        authStorage.setToken(res.token);
        authStorage.setUser(res.user);
      }
      onSuccess?.(res.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Stack spacing={3}>
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              borderRadius: '12px',
              backgroundColor: '#ffebee',
              color: '#c62828',
            }}
          >
            {error}
          </Alert>
        )}
        <TextField
          label="Full Name"
          value={values.name}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setValues((v: RegisterRequest) => ({ ...v, name: e.target.value }))}
          error={!!nameError}
          helperText={nameError}
          required
          fullWidth
          placeholder="Enter your full name"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              backgroundColor: '#f8f9fa',
              '& fieldset': {
                borderColor: nameError ? '#e53935' : '#e1e5e9',
              },
              '&:hover fieldset': {
                borderColor: nameError ? '#e53935' : '#6c63ff',
              },
              '&.Mui-focused fieldset': {
                borderColor: nameError ? '#e53935' : '#6c63ff',
              },
                   color: 'black',
            },
            '& .MuiInputLabel-root': {
              color: '#6b7280',
              fontWeight: 500,
            },
          }}
        />
        <TextField
          label="Email"
          type="email"
          value={values.email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setValues((v: RegisterRequest) => ({ ...v, email: e.target.value }))}
          error={!!emailError}
          helperText={emailError}
          required
          fullWidth
          placeholder="Example@gmail.com"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              backgroundColor: '#f8f9fa',
              '& fieldset': {
                borderColor: emailError ? '#e53935' : '#e1e5e9',
              },
              '&:hover fieldset': {
                borderColor: emailError ? '#e53935' : '#6c63ff',
              },
              '&.Mui-focused fieldset': {
                borderColor: emailError ? '#e53935' : '#6c63ff',
              },
                   color: 'black',
            },
            '& .MuiInputLabel-root': {
              color: '#6b7280',
              fontWeight: 500,
            },
          }}
        />
        <TextField
          label="Password"
          type="password"
          value={values.password}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setValues((v: RegisterRequest) => ({ ...v, password: e.target.value }))}
          error={!!passwordError}
          helperText={passwordError}
          required
          fullWidth
          placeholder="Enter your password"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              backgroundColor: '#f8f9fa',
              '& fieldset': {
                borderColor: passwordError ? '#e53935' : '#e1e5e9',
              },
              '&:hover fieldset': {
                borderColor: passwordError ? '#e53935' : '#6c63ff',
              },
              '&.Mui-focused fieldset': {
                borderColor: passwordError ? '#e53935' : '#6c63ff',
              },
                   color: 'black',
            },
            '& .MuiInputLabel-root': {
              color: '#6b7280',
              fontWeight: 500,
            },
          }}
        />
        <TextField
          label="Israeli Mobile Number"
          type="tel"
          value={values.phone}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setValues((v: RegisterRequest) => ({ ...v, phone: e.target.value }))}
          error={!!phoneError}
          helperText={phoneError || 'Format: 05XXXXXXXX (Optional)'}
          fullWidth
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              backgroundColor: '#f8f9fa',
              '& fieldset': {
                borderColor: phoneError ? '#e53935' : '#e1e5e9',
              },
              '&:hover fieldset': {
                borderColor: phoneError ? '#e53935' : '#6c63ff',
              },
              '&.Mui-focused fieldset': {
                borderColor: phoneError ? '#e53935' : '#6c63ff',
              },
              color: 'black',
            },
            '& .MuiInputLabel-root': {
              color: '#6b7280',
              fontWeight: 500,
            },
          }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={values.isBusiness}
              onChange={(e) => setValues((v) => ({ ...v, isBusiness: e.target.checked }))}
              sx={{
                color: '#6c63ff',
                '&.Mui-checked': {
                  color: '#6c63ff',
                },
              }}
            />
          }
          label="Business Account"
          sx={{
            '& .MuiFormControlLabel-label': {
              color: '#6b7280',
              fontSize: '0.875rem',
            },
          }}
        />
   
        <Button 
          type="submit" 
          variant="contained" 
          disabled={submitting || !isValid}
          fullWidth
          sx={{
            
            backgroundColor: '#6c63ff',
            
            borderRadius: '12px',
            py: 1.5,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 600,
            boxShadow: 'none',
            
            '&:hover': {
              backgroundColor: '#5a52f0',
              boxShadow: 'none',
            },
            '&:disabled': {
              backgroundColor: '#e0e0e0',
              color: '#9e9e9e',
            },
            
          }}
        >
          {submitting ? 'Creating account…' : 'Register'}
        </Button>
      </Stack>
    </Box>
  );
}


