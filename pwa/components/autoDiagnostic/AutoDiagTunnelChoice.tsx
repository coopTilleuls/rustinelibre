import React, {useContext} from 'react';
import Link from 'next/link';
import {AutodiagContext} from '@contexts/AutodiagContext';
import useMediaQuery from '@hooks/useMediaQuery';
import {Box, Stack, Button, Typography} from '@mui/material';

export const AutoDiagTunnelChoice = (): JSX.Element => {
  const {appointment, setTunnelStep} = useContext(AutodiagContext);

  return (
    <Stack
      spacing={4}
      display="flex"
      flexDirection="column"
      alignItems="center">
      <Typography component="h2" fontSize={18} fontWeight={600} my={{xs: 2}}>
        Souhaites-tu transmettre un autodiagnostic au réparateur ?
      </Typography>
      {appointment && (
        <Box
          width={{xs: '60%', md: '40%'}}
          display="flex"
          justifyContent="space-between">
          <Link href={`/rendez-vous/recapitulatif/${appointment.id}`}>
            <Button variant="outlined" sx={{marginTop: '30px'}}>
              Non
            </Button>
          </Link>
          <Button
            variant="contained"
            sx={{marginTop: '30px'}}
            onClick={() => setTunnelStep('prestation')}>
            Oui
          </Button>
        </Box>
      )}
    </Stack>
  );
};

export default AutoDiagTunnelChoice;
