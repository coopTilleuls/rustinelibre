import {Box, Typography} from '@mui/material';

const NoMessageListItem = (): JSX.Element => {
  return (
    <Box
      sx={{
        cursor: 'default',
        width: '100%',
        borderRadius: 5,
        mb: 2,
        transition: 'all ease 0.3s',
        bgcolor: 'grey.100',
      }}>
      <Box px={2} py={2} display="flex" gap={2} alignItems="center">
        <Typography
          variant="body2"
          fontWeight={800}
          gutterBottom
          color={'text.secondary'}>
          Vous n’avez pas encore envoyé de message
        </Typography>
      </Box>
    </Box>
  );
};

export default NoMessageListItem;
