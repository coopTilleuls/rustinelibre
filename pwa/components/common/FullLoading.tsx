import {Box, CircularProgress} from '@mui/material';

const FullLoading = () => (
  <Box
    sx={{
      width: '100vw',
      height: '100vh',
      position: 'fixed',
      bgcolor: 'rgba(0,0,0,0.1)',
      zIndex: '1500',
      top: 0,
      left: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
    <CircularProgress />
  </Box>
);

export default FullLoading;
