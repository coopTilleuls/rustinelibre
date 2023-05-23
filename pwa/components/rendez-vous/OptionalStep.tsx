import React from 'react';
import useMediaQuery from '@hooks/useMediaQuery';
import {Typography, Button, Stack} from '@mui/material';

interface OptionalStepProps {
  optionalPage?: string;
  confirmAppointmentRequest: () => void;
}

const OptionalStep = ({
  optionalPage,
  confirmAppointmentRequest,
}: OptionalStepProps) => {
  const isMobile = useMediaQuery('(max-width: 640px)');

  return (
    <Stack
      width={isMobile ? '100%' : '60%'}
      spacing={4}
      display="flex"
      flexDirection="column"
      alignItems="center">
      <Typography component="h2" fontSize={18} fontWeight={600} my={{xs: 2}}>
        À lire avant de prendre rendez-vous.
      </Typography>
      <Typography paragraph fontSize={{xs: 16, md: 18}} color="text.secondary">
        {optionalPage}
      </Typography>

      <Typography fontSize={{xs: 16, md: 18, textAlign: 'center'}}>
        <Button variant="contained" onClick={confirmAppointmentRequest}>
          Suivant
        </Button>
      </Typography>
    </Stack>
  );
};

export default OptionalStep;
