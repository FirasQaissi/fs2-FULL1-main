import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { Alert, Box, Button, Checkbox, FormControlLabel, Stack, TextField } from '@mui/material';
import { authService } from '../../services/authService';
import { authStorage } from '../../services/authStorage';
import ForgotPasswordForm from './ForgotPasswordForm';
import OAuthButtons from './OAuthButtons';
import type { LoginRequest, User } from '../../types/auth';

type Props = {
  onSuccess?: (user: User) => void;
  onClose?: () => void;
};

export default function LoginForm({ onSuccess, onClose }: Props) {
  const [values, setValues] = useState<LoginRequest>({ email: '', password: '', isBusiness: false });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remember, setRemember] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  const emailError = useMemo(() => {
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return values.email.length > 0 && !EMAIL_REGEX.test(values.email) ? 'הכנס כתובת אימייל תקינה' : '';
  }, [values.email]);
  
  const passwordError = useMemo(() => {
    const PASSWORD_REGEX = /^(?=.*[!@%$#^&*\-_]).{8,}$/;
    return values.password.length > 0 && !PASSWORD_REGEX.test(values.password)
      ? 'לפחות 8 תווים, כולל !@%$#^&*-_'
      : '';
  }, [values.password]);
  
  const isValid = useMemo(() => {
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const PASSWORD_REGEX = /^(?=.*[!@%$#^&*\-_]).{8,}$/;
    return EMAIL_REGEX.test(values.email) && PASSWORD_REGEX.test(values.password);
  }, [values.email, values.password]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await authService.login(values);
      if (res.token) {
        authStorage.setToken(res.token);
        authStorage.setUser(res.user);
      }
      onSuccess?.(res.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
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
              backgroundColor: '#white',
              color: 'green',
            }}
          >
            {error}
          </Alert>
        )}
        <TextField
          label="אימייל"
          type="email"
          value={values.email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setValues((v: LoginRequest) => ({ ...v, email: e.target.value 
        
          }))}
          error={!!emailError}
          helperText={emailError}
          required
          fullWidth
          placeholder="example@gmail.com"
          
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
          label="סיסמה"
          type="password"
          value={values.password}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setValues((v: LoginRequest) => ({ ...v, password: e.target.value }))}
          error={!!passwordError}
          helperText={passwordError}
          required
          fullWidth
          placeholder="הכנס את הסיסמה שלך"
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
        <FormControlLabel
          control={
            <Checkbox 
              checked={remember} 
              onChange={(e: ChangeEvent<HTMLInputElement>) => setRemember(e.target.checked)}
              sx={{
                color: '#6c63ff',
                '&.Mui-checked': {
                  color: '#6c63ff',
                },
              }}
            />
          }
          label="זכור אותי"
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
            color: 'white',
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
          {submitting ? 'מתחבר...' : 'התחברות'}
        </Button>

        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button
            variant="text"
            onClick={() => setForgotPasswordOpen(true)}
            sx={{
              textTransform: 'none',
              fontSize: '0.875rem',
              color: '#6c63ff',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: 'transparent',
                textDecoration: 'underline',
              },
            }}
          >
            שכחת סיסמה?
          </Button>
        </Box>
      </Stack>

      {/* OAuth Buttons */}
      <OAuthButtons
        onError={setError}
        onClose={onClose}
      />

      <ForgotPasswordForm
        open={forgotPasswordOpen}
        onClose={() => setForgotPasswordOpen(false)}
      />
    </Box>
  );
}


