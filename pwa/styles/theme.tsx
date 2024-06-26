import {
  Shadows,
  SimplePaletteColorOptions,
  createTheme,
  darken,
  lighten,
  responsiveFontSizes,
} from '@mui/material/styles';
import '@fontsource-variable/pathway-extreme';

declare module '@mui/material/styles' {
  // eslint-disable-next-line no-unused-vars
  interface Palette {
    lightsecondary: SimplePaletteColorOptions;
    black: SimplePaletteColorOptions;
    lightprimary: SimplePaletteColorOptions;
  }
  // eslint-disable-next-line no-unused-vars
  interface PaletteOptions {
    lightsecondary?: SimplePaletteColorOptions;
    lightprimary?: SimplePaletteColorOptions;
    black?: SimplePaletteColorOptions;
  }
}

const theme = createTheme({
  palette: {
    primary: {
      light: lighten('#ee721e', 0.2),
      main: '#ee721e',
      dark: darken('#ee721e', 0.2),
      contrastText: '#fff',
    },
    secondary: {
      light: lighten('#55267a', 0.2),
      main: '#55267a',
      dark: darken('#55267a', 0.4),
      contrastText: '#fff',
    },
    lightprimary: {
      light: lighten('#fff7f0', 0.4),
      main: '#fff7f0',
      dark: '#fde6d1',
    },
    lightsecondary: {
      light: lighten('#f8f2fe', 0.2),
      main: '#f8f2fe',
      dark: darken('#f8f2fe', 0.2),
    },
  },
  typography: {
    fontFamily: 'Pathway Extreme Variable',
    h1: {
      fontWeight: 900,
      fontSize: 48,
    },
    h2: {
      fontWeight: 900,
      fontSize: 34,
    },
    h3: {
      fontWeight: 800,
      fontSize: 26,
    },
    h4: {
      fontWeight: 700,
      fontSize: 22,
    },
    h5: {
      fontWeight: 700,
      fontSize: 18,
    },
    h6: {
      fontWeight: 600,
      fontSize: 16,
    },
  },
  shadows: [
    'none',
    '0 1px 4px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.08)',
    '0 3px 6px rgba(0, 0, 0, 0.06), 0 6px 12px rgba(0, 0, 0, 0.06)',
    '0 4px 8px rgba(0, 0, 0, 0.06), 0 8px 16px rgba(0, 0, 0, 0.06)',
    '0 5px 10px rgba(0, 0, 0, 0.07), 0 10px 20px rgba(0, 0, 0, 0.07)',
    '0 6px 12px rgba(0, 0, 0, 0.12), 0 12px 24px rgba(0, 0, 0, 0.12)',
    ...Array(20).fill(
      '0 6px 12px rgba(0, 0, 0, 0.12), 0 12px 24px rgba(0, 0, 0, 0.12)'
    ),
  ] as Shadows,
  components: {
    MuiContainer: {
      styleOverrides: {
        maxWidthLg: {
          maxWidth: '1280px!important',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          fontWeight: '800',
          fontSize: '14px',
        },
        root: {
          borderRadius: '20px',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: ({theme}) => ({
          fontWeight: '800',
          fontSize: '14px',
          color: theme.palette.secondary.light,
        }),
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: ({theme}) => ({
          [theme.breakpoints.up('sm')]: {
            borderRadius: 3 * theme.shape.borderRadius,
          },
        }),
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: ({ownerState}) => ({
          borderRadius: 30,
          fontWeight: 600,
          textTransform: 'none',
          ...(ownerState.variant === 'contained' && {
            color: '#fff',
          }),
          ...(ownerState.size === 'large' && {
            padding: '10px 28px',
          }),
          ...(ownerState.size === 'medium' && {
            padding: '6px 24px',
          }),
          ...(ownerState.size === 'small' && {
            padding: '4px 12px',
          }),
        }),
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        label: {
          fontSize: 14,
          '&.Mui-selected': {
            fontSize: 14,
          },
        },
      },
    },
  },
});

export default responsiveFontSizes(theme);
