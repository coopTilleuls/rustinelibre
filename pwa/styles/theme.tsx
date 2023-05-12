import {createTheme} from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiButton: {
      variants: [
        {
          props: {},
          style: {
            borderRadius: 20,
            fontWeight: 600,
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
