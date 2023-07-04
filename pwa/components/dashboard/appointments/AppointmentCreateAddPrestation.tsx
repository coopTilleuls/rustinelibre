import React, {useEffect, useState} from 'react';
import {Stack, MenuItem, FormControl, InputLabel} from '@mui/material';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import {Intervention} from '@interfaces/Intervention';
import {interventionResource} from '@resources/interventionResource';

interface AppointmentCreateAddPrestationProps {
  prestation: string;
  setPrestation: React.Dispatch<React.SetStateAction<string>>;
}

const AppointmentCreateAddPrestation = ({
  prestation,
  setPrestation,
}: AppointmentCreateAddPrestationProps): JSX.Element => {
  const [interventions, setInterventions] = useState<Intervention[]>([]);

  const handleChangePrestation = (event: SelectChangeEvent): void => {
    setPrestation(event.target.value as string);
  };

  const fetchInterventions = async () => {
    const interventionsFetch = await interventionResource.getAll(false, {
      isAdmin: true,
    });
    setInterventions(interventionsFetch['hydra:member']);
  };

  useEffect(() => {
    fetchInterventions();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Stack
      width={{xs: '100%', sm: '65%', md: '45%'}}
      spacing={4}
      py={2}
      mx="auto"
      display="flex"
      flexDirection="column"
      alignItems="center">
      <FormControl fullWidth sx={{mt: 2, mb: 1}}>
        <InputLabel id="service-type-label">Type de prestation</InputLabel>
        <Select
          labelId="service-type-label"
          id="service-type"
          value={prestation}
          label="Type de prestation"
          onChange={handleChangePrestation}>
          {interventions.map(({id, description}) => {
            return (
              <MenuItem key={id} value={description}>
                {description}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Stack>
  );
};

export default AppointmentCreateAddPrestation;
