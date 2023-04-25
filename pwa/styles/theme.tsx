import {createTheme} from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'Poppins, sans-serif',
  },
  components: {
    MuiButton: {
      variants: [
        {
          props: {},
          style: {
            borderRadius: 20,
          },
        },
      ],
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

export default theme;
