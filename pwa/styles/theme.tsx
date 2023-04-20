import { createTheme } from '@mui/material/styles';

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
  },
});

export default theme;
