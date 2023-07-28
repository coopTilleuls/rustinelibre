import React, {useEffect, useState} from 'react';
import {FormControl, InputLabel, MenuItem, useMediaQuery} from '@mui/material';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import {bikeTypeResource} from '@resources/bikeTypeResource';
import {BikeType} from '@interfaces/BikeType';
import theme from 'styles/theme';

interface AppointmentCreateAddBikeTypeProps {
  selectedBikeType: BikeType | null;
  setSelectedBikeType: React.Dispatch<React.SetStateAction<BikeType | null>>;
}
const AppointmentCreateAddBikeType = ({
  selectedBikeType,
  setSelectedBikeType,
}: AppointmentCreateAddBikeTypeProps): JSX.Element => {
  const [bikeTypes, setBikeTypes] = useState<BikeType[]>([]);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const fetchBikeTypes = async () => {
    const responseBikeTypes = await bikeTypeResource.getAll(false);
    setBikeTypes(responseBikeTypes['hydra:member']);
  };

  useEffect(() => {
    fetchBikeTypes();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleBikeChange = (event: SelectChangeEvent): void => {
    const selectedBikeType = bikeTypes?.find(
      (bt) => bt.name === event.target.value
    );
    setSelectedBikeType(selectedBikeType ? selectedBikeType : null);
  };

  return (
    <FormControl sx={{width: isMobile ? '100%' : '50%', mt: 2, mb: 1}}>
      <InputLabel id="bike-type-label">Type de vélo</InputLabel>
      <Select
        label="Type de vélo"
        id="bike-type"
        labelId="bike-type-label"
        onChange={handleBikeChange}
        value={selectedBikeType?.name}
        sx={{width: '100%'}}>
        {bikeTypes.map(({id, name}) => (
          <MenuItem key={id} value={name}>
            {name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
export default AppointmentCreateAddBikeType;
