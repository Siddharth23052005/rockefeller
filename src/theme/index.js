import { createTheme } from '@mui/material/styles';

export const brandTokens = {
  risk: {
    green: '#2E7D32',
    yellow: '#F9A825',
    orange: '#E65100',
    red: '#B71C1C',
  },
  brand: {
    dark: '#0D1B2A',
    midnight: '#1A2B3C',
    slate: '#263545',
    white: '#F5F7FA',
    gray: '#E0E4EA',
    accent: '#1565C0',
    accentAlt: '#0288D1',
  },
  text: {
    primary: '#1A1A2E',
    secondary: '#546E7A',
  },
};

export const geoAlertTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: brandTokens.brand.accent,
      light: brandTokens.brand.accentAlt,
      dark: '#0D47A1',
    },
    background: {
      default: brandTokens.brand.white,
      paper: '#FFFFFF',
    },
    text: {
      primary: brandTokens.text.primary,
      secondary: brandTokens.text.secondary,
    },
    success: { main: brandTokens.risk.green },
    warning: { main: brandTokens.risk.yellow },
    error: { main: brandTokens.risk.red },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 600, fontSize: '1.5rem' },
    h5: { fontWeight: 600, fontSize: '1.25rem' },
    h6: { fontWeight: 600, fontSize: '1.125rem' },
    subtitle1: { fontWeight: 500, fontSize: '0.875rem' },
    subtitle2: { fontWeight: 500, fontSize: '0.8125rem' },
    body1: { fontWeight: 400, fontSize: '0.875rem' },
    body2: { fontWeight: 400, fontSize: '0.75rem' },
    button: { fontWeight: 600, textTransform: 'none' },
    caption: { fontWeight: 400, fontSize: '0.75rem' },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

export default geoAlertTheme;
