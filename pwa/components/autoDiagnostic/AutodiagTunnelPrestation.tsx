import React, {useContext} from 'react';
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

export const AutoDiagTunnelPrestation = (): JSX.Element => {
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
          <MenuItem value="Entretien classique">Entretien classique</MenuItem>
          <MenuItem value="Électrifier mon vélo">Électrifier mon vélo</MenuItem>
          <MenuItem value="Problème de frein">Problème de frein</MenuItem>
          <MenuItem value="Problème de pneu">Problème de pneu</MenuItem>
          <MenuItem value="Problème de roue">Problème de roue</MenuItem>
          <MenuItem value="Problème de vitesse">Problème de vitesse</MenuItem>
          <MenuItem value="Autre prestation">Autre prestation</MenuItem>
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
