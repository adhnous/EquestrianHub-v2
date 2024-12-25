import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  Alert,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import useAuthStore from '../store/authStore';
import './Login.css';

const Login = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { login, isLoading, error: authError, isAuthenticated, clearError } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    rememberMe: false,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app/dashboard');
    }
    return () => clearError();
  }, [isAuthenticated, navigate, clearError]);

  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await login({
        username: credentials.username,
        password: credentials.password,
      });

      if (response.data.success) {
        // Login successful, auth store will handle token storage
        navigate('/app/dashboard');
      } else {
        setError(t('auth.invalidCredentials'));
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(t('auth.loginError'));
    }
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: name === 'rememberMe' ? checked : value
    }));
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const isRTL = i18n.language === 'ar';

  return (
    <Box 
      className="login-container"
      sx={{
        background: `url('https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&q=80') center/cover no-repeat`,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        direction: isRTL ? 'rtl' : 'ltr',
      }}
    >
      <Card className="login-card" sx={{ maxWidth: 400, width: '90%' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography 
            variant="h5" 
            component="h1" 
            gutterBottom 
            align="center"
            sx={{ 
              fontFamily: isRTL ? 'Cairo, sans-serif' : 'inherit',
              mb: 3
            }}
          >
            {t('auth.login')}
          </Typography>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 2,
                '& .MuiAlert-message': {
                  fontFamily: isRTL ? 'Cairo, sans-serif' : 'inherit',
                }
              }}
            >
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label={t('auth.username')}
              name="username"
              value={credentials.username}
              onChange={handleChange}
              margin="normal"
              required
              autoFocus
              InputProps={{
                sx: {
                  fontFamily: isRTL ? 'Cairo, sans-serif' : 'inherit',
                  direction: isRTL ? 'rtl' : 'ltr',
                }
              }}
              InputLabelProps={{
                sx: {
                  fontFamily: isRTL ? 'Cairo, sans-serif' : 'inherit',
                  right: isRTL ? 14 : 'auto',
                  left: isRTL ? 'auto' : 14,
                  transformOrigin: isRTL ? 'right' : 'left'
                }
              }}
            />
            <TextField
              fullWidth
              label={t('auth.password')}
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={credentials.password}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                sx: {
                  fontFamily: isRTL ? 'Cairo, sans-serif' : 'inherit',
                  direction: isRTL ? 'rtl' : 'ltr',
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                sx: {
                  fontFamily: isRTL ? 'Cairo, sans-serif' : 'inherit',
                  right: isRTL ? 14 : 'auto',
                  left: isRTL ? 'auto' : 14,
                  transformOrigin: isRTL ? 'right' : 'left'
                }
              }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="rememberMe"
                  checked={credentials.rememberMe}
                  onChange={handleChange}
                  color="primary"
                />
              }
              label={
                <Typography sx={{ fontFamily: isRTL ? 'Cairo, sans-serif' : 'inherit' }}>
                  {t('auth.rememberMe')}
                </Typography>
              }
              sx={{ 
                mt: 1,
                mb: 2,
                mr: isRTL ? 0 : 'auto',
                ml: isRTL ? 'auto' : 0
              }}
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              disabled={isLoading}
              sx={{
                py: 1.5,
                fontFamily: isRTL ? 'Cairo, sans-serif' : 'inherit',
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                t('auth.loginButton')
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
