import React, {useContext, useEffect, useState} from 'react';
import dynamic from 'next/dynamic';
import {RepairerFormContext} from '@contexts/RepairerFormContext';
import {
  MenuItem,
  FormControl,
  OutlinedInput,
  Checkbox,
  ListItemText,
  InputLabel,
  Box,
  CircularProgress,
  Typography,
  Button,
  Alert,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import {BikeType} from '@interfaces/BikeType';
import {RepairerType} from '@interfaces/RepairerType';
import {Repairer} from '@interfaces/Repairer';
import {RequestBody} from "@interfaces/Resource";

const Editor = dynamic(() => import('@components/form/Editor'), {
  ssr: false,
});

interface ContactDetailsProps {
  repairer: Repairer | null;
  bikeTypes: BikeType[];
  repairerTypes: RepairerType[];
  updateRepairer: (iri: string, requestBody: RequestBody) => void;
}

export const ContactDetails = ({
  repairer,
  bikeTypes,
  repairerTypes,
  updateRepairer,
}: ContactDetailsProps): JSX.Element => {
  const {
    description,
    selectedBikeTypes,
    repairerTypeSelected,
    errorMessage,
    success,
    pendingRegistration,
    setDescription,
    setSelectedBikeTypes,
    setRepairerTypeSelected,
  } = useContext(RepairerFormContext);

  useEffect(() => {
    if (repairer) {
      setDescription(repairer.description ?? '');
      setRepairerTypeSelected(repairer.repairerType ?? null);
      const bikeTypesSupported = repairer.bikeTypesSupported.map((bt) => bt.name);
      setSelectedBikeTypes(bikeTypes.map((bikeType) => {
        return bikeType.name;
      }).filter((bikeTypeId) => bikeTypesSupported.includes(bikeTypeId)));
    }
  }, [bikeTypes, repairer, setSelectedBikeTypes, setDescription, setRepairerTypeSelected]);

  const handleChangeRepairerType = (event: SelectChangeEvent): void => {
    const selectedRepairerType = repairerTypes.find(
      (rt) => rt.name === event.target.value
    );
    setRepairerTypeSelected(selectedRepairerType ?? null);
  };
  const handleChangeBikeRepaired = (event: SelectChangeEvent<typeof selectedBikeTypes>) => {
    const value = event.target.value;
    setSelectedBikeTypes(typeof value === 'string' ? value.split(',') : value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (!repairer) return;
    const requestBody: RequestBody = {};

    const selectedBikeTypeIRIs: string[] = bikeTypes
        .filter((bikeType) => selectedBikeTypes.includes(bikeType.name))
        .map((bikeType) => bikeType['@id']);

    if (description) requestBody['description'] = description;

    if (selectedBikeTypeIRIs.length > 0) requestBody['bikeTypesSupported'] = selectedBikeTypeIRIs;

    if (repairerTypeSelected) requestBody['repairerType'] = repairerTypeSelected['@id'];

    updateRepairer(repairer['@id'], requestBody);
  };

  return (
    <Box sx={{marginTop: 3}} component="form" onSubmit={handleSubmit}>
      {!repairer && (
          <Typography>Vous ne gérez pas de solution de réparation</Typography>
      )}
      {repairer && (
        <>
          <FormControl fullWidth required sx={{mt: 2, mb: 1}}>
            <InputLabel id="repairer-type-label">Type de réparateur</InputLabel>
            <Select
              id="repairer-type"
              labelId="repairer-type-label"
              required
              label="Type de réparateur"
              onChange={handleChangeRepairerType}
              value={repairerTypeSelected?.name ?? ''}
              style={{width: '100%'}}>
              {repairerTypes.map((rt) => (
                <MenuItem key={rt.id} value={rt.name}>
                  {rt.name}
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
                <MenuItem key={bikeType['@id']} value={bikeType.name}>
                  <Checkbox
                    checked={selectedBikeTypes.includes(bikeType.name)}
                  />
                  <ListItemText primary={bikeType.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <InputLabel sx={{mt: 1, mb: -2, ml: 1}}>Description</InputLabel>
          <Editor content={description} setContent={setDescription} />
          <Button type="submit" variant="contained" sx={{my: 2}}>
            {!pendingRegistration ? (
                'Enregistrer mes informations'
            ) : (
                <CircularProgress size={20} sx={{color: 'white'}} />
            )}
          </Button>
          {errorMessage && (
              <Typography variant="body1" color="error">
                {errorMessage}
              </Typography>
          )}
          {success && (
              <Alert severity="success">
                Informations mises à jour
              </Alert>
          )}
        </>
      )}
    </Box>
  );
};

export default ContactDetails;
