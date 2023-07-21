import React from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import {Typography, Button, Stack} from '@mui/material';
import {useTheme} from '@mui/material/styles';

interface OptionalStepProps {
  optionalPage?: string;
  confirmAppointmentRequest: () => void;
}

const OptionalStep = ({
  optionalPage,
  confirmAppointmentRequest,
}: OptionalStepProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
      {optionalPage && (
        <Typography
          paragraph
          fontSize={{xs: 16, md: 18}}
          color="text.secondary"
          dangerouslySetInnerHTML={{__html: optionalPage}}
        />
      )}
      <Typography fontSize={{xs: 16, md: 18, textAlign: 'center'}}>
        <Button variant="contained" onClick={confirmAppointmentRequest}>
          Suivant
        </Button>
      </Typography>
    </Stack>
  );
};

export default OptionalStep;
