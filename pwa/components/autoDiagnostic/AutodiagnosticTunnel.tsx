import React, {useContext, useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import {Container, Paper, Stack} from '@mui/material';
import useMediaQuery from '@hooks/useMediaQuery';
import {AutodiagContext} from '@contexts/AutodiagContext';
import {appointmentResource} from '@resources/appointmentResource';
import {useRouter} from 'next/router';
import AutoDiagTunnelPrestation from '@components/autoDiagnostic/AutodiagTunnelPrestation';
import AutoDiagTunnelPhoto from '@components/autoDiagnostic/AutoDiagTunnelPhoto';
import AutoDiagTunnelChoice from '@components/autoDiagnostic/AutoDiagTunnelChoice';

interface AutoDiagnosticTunnelProps {
  appointmentId: string;
}

export const AutoDiagnosticTunnel = ({
  appointmentId,
}: AutoDiagnosticTunnelProps): JSX.Element => {
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width: 1024px)');
  const [loading, setLoading] = useState<boolean>(false);
  const {
    tunnelStep,
    appointment,
    photo,
    setTunnelStep,
    setPrestation,
    setAppointment,
    setAutoDiagnostic,
    setPhoto,
  } = useContext(AutodiagContext);

  async function fetchAppointment() {
    if (appointmentId) {
      setLoading(true);
      const appointmentFetched = await appointmentResource.getById(
        appointmentId
      );
      setAppointment(appointmentFetched);

      if (!appointmentFetched) {
        return router.push('/');
      }

      if (appointmentFetched.autoDiagnostic) {
        setLoading(false);
        setAutoDiagnostic(appointmentFetched.autoDiagnostic);
        setPrestation(appointmentFetched.autoDiagnostic.prestation);
        setTunnelStep('photo');

        if (appointmentFetched.autoDiagnostic.photo) {
          setPhoto(appointmentFetched.autoDiagnostic.photo);
        }
      } else {
        setTunnelStep('choice');
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    fetchAppointment();
  }, [appointmentId]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box>
      {!loading && appointment && (
        <Box>
          <Container maxWidth="md" sx={{padding: {xs: 0}}}>
            <Paper elevation={isMobile ? 0 : 4} sx={{p: 3}}>
              <Stack
                spacing={5}
                marginBottom={4}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}>
                {tunnelStep == 'choice' && <AutoDiagTunnelChoice />}
                {tunnelStep == 'prestation' && <AutoDiagTunnelPrestation />}
                {tunnelStep == 'photo' && <AutoDiagTunnelPhoto />}
              </Stack>
            </Paper>
          </Container>
        </Box>
      )}
    </Box>
  );
};

export default AutoDiagnosticTunnel;
