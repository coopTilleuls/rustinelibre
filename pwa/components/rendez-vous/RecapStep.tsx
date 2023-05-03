import React from 'react';
import useMediaQuery from '@hooks/useMediaQuery';
import {Box, Typography, Button, Stack, Collapse, Divider} from '@mui/material';

interface RecapStepProps {
  handleConfirmAppointment: () => void;
}

const RecapStep = ({handleConfirmAppointment}: RecapStepProps) => {
  const isMobile = useMediaQuery('(max-width: 640px)');

  return (
    <Stack
      spacing={4}
      display="flex"
      flexDirection="column"
      alignItems="center">
      <Typography component="h2" fontSize={18} fontWeight={600} my={{xs: 2}}>
        Récapitulatif
      </Typography>
      <Typography align="justify" sx={{mt: 2}}>
        Votre RDV: 17 février chez VéloBobos
      </Typography>

      <Box>
        <Button onClick={handleConfirmAppointment} variant="contained">
          Confirmer le rendez vous
        </Button>
      </Box>
    </Stack>
  );
};

export default RecapStep;
