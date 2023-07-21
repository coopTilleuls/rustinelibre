import React, {useContext, useEffect, useState} from 'react';
import {
  Button,
  Typography,
  Stack,
  MenuItem,
  Box,
  FormControl,
  InputLabel,
} from '@mui/material';
import {AutodiagContext} from '@contexts/AutodiagContext';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import {autoDiagnosticResource} from '@resources/autoDiagResource';
import {Intervention} from '@interfaces/Intervention';
import {interventionResource} from '@resources/interventionResource';

export const AutoDiagTunnelPrestation = (): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(false);
  const [interventions, setInterventions] = useState<Intervention[]>([]);

  const {
    prestation,
    appointment,
    autoDiagnostic,
    setTunnelStep,
    setPrestation,
    setAutoDiagnostic,
  } = useContext(AutodiagContext);

  const handleChangePrestation = (event: SelectChangeEvent): void => {
    setPrestation(event.target.value as string);
  };

  const handleClickBack = (): void => {
    setTunnelStep('choice');
  };

  const handleClickNext = async () => {
    if (!appointment) {
      return;
    }

    if (!autoDiagnostic) {
      const newAutodiag = await autoDiagnosticResource.post({
        prestation: prestation,
        appointment: appointment['@id'],
      });

      if (newAutodiag) setAutoDiagnostic(newAutodiag);
    } else {
      await autoDiagnosticResource.put(autoDiagnostic['@id'], {
        prestation: prestation,
      });
    }

    setTunnelStep('photo');
  };

  const fetchInterventions = async () => {
    setLoading(true);
    const interventionsFetch = await interventionResource.getAll(false, {
      isAdmin: true,
    });
    setInterventions(interventionsFetch['hydra:member']);
    setLoading(false);
  };

  useEffect(() => {
    fetchInterventions();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Stack
      spacing={4}
      display="flex"
      flexDirection="column"
      alignItems="center">
      <Typography component="h2" fontSize={18} fontWeight={600} my={{xs: 2}}>
        De quelle prestation as tu besoin ?
      </Typography>
      <FormControl fullWidth required sx={{mt: 2, mb: 1}}>
        <InputLabel id="service-type-label">Type de prestation</InputLabel>
        <Select
          required
          labelId="service-type-label"
          id="service-type"
          value={prestation}
          label="Type de prestation"
          onChange={handleChangePrestation}>
          {interventions.map((intervention) => {
            return (
              <MenuItem
                key={intervention['@id']}
                value={intervention.description}>
                {intervention.description}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <Box
        width={{xs: '60%', md: '100%'}}
        display="flex"
        justifyContent="space-between">
        <Button variant="outlined" onClick={handleClickBack}>
          Retour
        </Button>
        <Button variant="contained" onClick={handleClickNext}>
          Suivant
        </Button>
      </Box>
    </Stack>
  );
};

export default AutoDiagTunnelPrestation;
