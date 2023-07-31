import React, {useEffect, useState} from 'react';
import {MenuItem, FormControl, InputLabel} from '@mui/material';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import useMediaQuery from '@mui/material/useMediaQuery';
import {useTheme} from '@mui/material/styles';
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
    <FormControl sx={{width: isMobile ? '100%' : '50%', mt: 2, mb: 1}}>
      <InputLabel id="service-type-label">
        {isMobile ? 'Prestation' : 'Type de prestation'}
      </InputLabel>
      <Select
        labelId="service-type-label"
        id="service-type"
        value={prestation}
        label={isMobile ? 'Prestation' : 'Type de prestation'}
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
  );
};

export default AppointmentCreateAddPrestation;
