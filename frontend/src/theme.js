import { createTheme } from '@mui/material/styles';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import createCache from '@emotion/cache';

// Create rtl cache
export function createRtlCache() {
  return createCache({
    key: 'muirtl',
    stylisPlugins: [prefixer, rtlPlugin],
  });
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#1B4332', // Deep forest green
      light: '#2D6A4F',
      dark: '#081C15',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#B87D4B', // Saddle brown
      light: '#DDA15E',
      dark: '#96591E',
      contrastText: '#ffffff',
    },
    background: {
      default: '#F8F9FA',
      paper: '#ffffff',
    },
    success: {
      main: '#40916C',
      light: '#52B788',
      dark: '#2D6A4F',
    },
    error: {
      main: '#BC4749',
      light: '#D46A6A',
      dark: '#9B2226',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      'Noto Kufi Arabic',
      'Noto Sans Arabic',
      'Noto Naskh Arabic',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '-0.01562em',
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      letterSpacing: '-0.00833em',
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      letterSpacing: '0em',
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      letterSpacing: '0.00735em',
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      letterSpacing: '0em',
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      letterSpacing: '0.0075em',
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          transition: 'all 0.3s ease',
          scrollBehavior: 'smooth',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '8px 16px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          },
        },
        contained: {
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: 'box-shadow 0.2s ease-in-out',
        },
        elevation1: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        },
        elevation2: {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
            },
            '&.Mui-focused': {
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            },
          },
        },
      },
    },
  },
  direction: 'ltr', // Default direction
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0 2px 4px rgba(0, 0, 0, 0.05)',
    '0 4px 8px rgba(0, 0, 0, 0.08)',
    '0 6px 12px rgba(0, 0, 0, 0.1)',
    '0 8px 16px rgba(0, 0, 0, 0.12)',
    '0 10px 20px rgba(0, 0, 0, 0.14)',
    '0 12px 24px rgba(0, 0, 0, 0.16)',
    '0 14px 28px rgba(0, 0, 0, 0.18)',
    '0 16px 32px rgba(0, 0, 0, 0.2)',
    '0 18px 36px rgba(0, 0, 0, 0.22)',
    '0 20px 40px rgba(0, 0, 0, 0.24)',
    '0 22px 44px rgba(0, 0, 0, 0.26)',
    '0 24px 48px rgba(0, 0, 0, 0.28)',
    '0 26px 52px rgba(0, 0, 0, 0.3)',
    '0 28px 56px rgba(0, 0, 0, 0.32)',
    '0 30px 60px rgba(0, 0, 0, 0.34)',
    '0 32px 64px rgba(0, 0, 0, 0.36)',
    '0 34px 68px rgba(0, 0, 0, 0.38)',
    '0 36px 72px rgba(0, 0, 0, 0.4)',
    '0 38px 76px rgba(0, 0, 0, 0.42)',
    '0 40px 80px rgba(0, 0, 0, 0.44)',
    '0 42px 84px rgba(0, 0, 0, 0.46)',
    '0 44px 88px rgba(0, 0, 0, 0.48)',
    '0 46px 92px rgba(0, 0, 0, 0.5)',
    '0 48px 96px rgba(0, 0, 0, 0.52)',
  ],
});

// Create RTL theme
export const createRtlTheme = () => {
  return createTheme({
    ...theme,
    direction: 'rtl',
  });
};

export default theme;
