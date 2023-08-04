import React, {useContext} from 'react';
import Link from 'next/link';
import {AutodiagContext} from '@contexts/AutodiagContext';
import {Box, Stack, Button, Typography} from '@mui/material';

export const AutoDiagTunnelChoice = (): JSX.Element => {
  const {appointment, setTunnelStep} = useContext(AutodiagContext);

  return (
    <Stack
      spacing={2}
      display="flex"
      flexDirection="column"
      alignItems="center">
      <Typography variant="h5" component="label">
        Souhaites-tu transmettre un autodiagnostic au réparateur&nbsp;?
      </Typography>
      {appointment && (
        <Box
          width={{xs: '60%', md: '40%'}}
          mt={6}
          display="flex"
          justifyContent="space-between">
          <Link href={`/rendez-vous/recapitulatif/${appointment.id}`}>
            <Button variant="outlined">Non</Button>
          </Link>
          <Button
            variant="contained"
            onClick={() => setTunnelStep('prestation')}>
            Oui
          </Button>
        </Box>
      )}
    </Stack>
  );
};

export default AutoDiagTunnelChoice;
