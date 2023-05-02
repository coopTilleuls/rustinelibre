import React, {useContext, useEffect} from 'react';
import dynamic from 'next/dynamic';
import {RepairerFormContext} from '@contexts/RepairerFormContext';
import {
  MenuItem,
  FormControl,
  OutlinedInput,
  Checkbox,
  ListItemText,
  InputLabel,
} from '@mui/material';
import Select, {SelectChangeEvent} from '@mui/material/Select';
const Editor = dynamic(() => import('@components/form/Editor'), {
  ssr: false,
});
import {BikeType} from '@interfaces/BikeType';
import {RepairerType} from '@interfaces/RepairerType';
import {Repairer} from '@interfaces/Repairer';

interface ContactDetailsProps {
  repairer: Repairer | null;
  bikeTypes: BikeType[];
  repairerTypes: RepairerType[];
}

export const ContactDetails = ({
  repairer,
  bikeTypes,
  repairerTypes,
}: ContactDetailsProps): JSX.Element => {
  const {
    description,
    setDescription,
    setRepairerTypeSelected,
    selectedBikeTypes,
    setSelectedBikeTypes,
    repairerTypeSelected,
  } = useContext(RepairerFormContext);

  useEffect(() => {
    if (repairer) {
      setDescription(repairer.description ? repairer.description : '');
    }
  }, [repairer, setDescription]);

  const handleChangeRepairerType = (event: SelectChangeEvent): void => {
    const selectedRepairerType = repairerTypes.find(
      (rt) => rt.name === event.target.value
    );
    setRepairerTypeSelected(selectedRepairerType ? selectedRepairerType : null);
  };
  const handleChangeBikeRepaired = (
    event: SelectChangeEvent<typeof selectedBikeTypes>
  ) => {
    const {
      target: {value},
    } = event;
    setSelectedBikeTypes(typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <>
      <FormControl fullWidth required sx={{mt: 2, mb: 1}}>
        <InputLabel id="repairer-type-label">Type de réparateur</InputLabel>
        <Select
          id="repairer-type"
          labelId="repairer-type-label"
          required
          label="Type de réparateur"
          onChange={handleChangeRepairerType}
          value={repairerTypeSelected?.name}
          style={{width: '100%'}}>
          {repairerTypes.map((repairer) => (
            <MenuItem key={repairer.id} value={repairer.name}>
              {repairer.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth required sx={{mt: 2, mb: 1}}>
        <InputLabel id="bike-type-label">Type de vélos</InputLabel>
        <Select
          id="bike-type"
          labelId="bike-type-label"
          required
          multiple
          fullWidth
          value={selectedBikeTypes}
          onChange={handleChangeBikeRepaired}
          input={<OutlinedInput label="Type de vélos" />}
          renderValue={(selected) => selected.join(', ')}>
          {bikeTypes.map((bikeType) => (
            <MenuItem key={bikeType.name} value={bikeType.name}>
              <Checkbox
                checked={selectedBikeTypes.indexOf(bikeType.name) > -1}
              />
              <ListItemText primary={bikeType.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <InputLabel sx={{mt: 1, mb: -2, ml: 1}}>Description</InputLabel>
      <Editor content={description} setContent={setDescription} />
    </>
  );
};

export default ContactDetails;
