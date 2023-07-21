import React, {useEffect, useState} from 'react';
import dynamic from 'next/dynamic';
import {bikeTypeResource} from '@resources/bikeTypeResource';
import {repairerTypeResource} from '@resources/repairerTypeResource';
const Editor = dynamic(() => import('@components/form/Editor'), {
  ssr: false,
});
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
import {RequestBody} from '@interfaces/Resource';
import {errorRegex} from '@utils/errorRegex';

interface ContactDetailsProps {
  repairer: Repairer | null;
  // eslint-disable-next-line no-unused-vars
  updateRepairer: (iri: string, bodyRequest: RequestBody) => void;
}

export const ContactDetails = ({
  repairer,
  updateRepairer,
}: ContactDetailsProps): JSX.Element => {
  const [repairerTypes, setRepairerTypes] = useState<RepairerType[]>([]);
  const [bikeTypes, setBikeTypes] = useState<BikeType[]>([]);
  const [description, setDescription] = useState<string>('');
  const [repairerTypeSelected, setRepairerTypeSelected] =
    useState<RepairerType>(repairer?.repairerType!);
  const [selectedBikeTypes, setSelectedBikeTypes] = useState<string[]>([]);

  const [pendingRegistration, setPendingRegistration] =
    useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const fetchRepairerTypes = async () => {
    const responseRepairerTypes = await repairerTypeResource.getAll(false);
    setRepairerTypes(responseRepairerTypes['hydra:member']);
  };

  useEffect(() => {
    if (repairerTypes.length === 0) {
      fetchRepairerTypes();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchBikeTypes = async () => {
    const responseBikeTypes = await bikeTypeResource.getAll(false);
    setBikeTypes(responseBikeTypes['hydra:member']);
  };

  useEffect(() => {
    if (bikeTypes.length === 0) {
      fetchBikeTypes();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (repairer) {
      setDescription(repairer.description ?? '');
      setRepairerTypeSelected(repairer.repairerType ?? null);
      const bikeTypesSupported = repairer.bikeTypesSupported.map(
        (bt) => bt.name
      );
      setSelectedBikeTypes(
        bikeTypes
          .map((bikeType) => {
            return bikeType.name;
          })
          .filter((bikeTypeId) => bikeTypesSupported.includes(bikeTypeId))
      );
    }
  }, [
    bikeTypes,
    repairer,
    setSelectedBikeTypes,
    setDescription,
    setRepairerTypeSelected,
  ]);

  const handleChangeRepairerType = (event: SelectChangeEvent): void => {
    const selectedRepairerType = repairerTypes.find(
      (rt) => rt.name === event.target.value
    );
    setRepairerTypeSelected(selectedRepairerType!);
  };
  const handleChangeBikeRepaired = (
    event: SelectChangeEvent<typeof selectedBikeTypes>
  ) => {
    const value = event.target.value;
    setSelectedBikeTypes(typeof value === 'string' ? value.split(',') : value);
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    if (!repairer) return;

    const selectedBikeTypeIRIs: string[] = bikeTypes
      .filter((bikeType) => selectedBikeTypes.includes(bikeType.name))
      .map((bikeType) => bikeType['@id']);

    try {
      setPendingRegistration(true);
      await updateRepairer(repairer['@id'], {
        repairerType: repairerTypeSelected['@id'],
        bikeTypesSupported: selectedBikeTypeIRIs,
        description: description,
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (e: any) {
      setErrorMessage(
        `Mise à jour impossible : ${e.message?.replace(errorRegex, '$2')}`
      );
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
    setPendingRegistration(false);
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
          <InputLabel shrink sx={{mt: 1, mb: -2, ml: 1}}>
            Description
          </InputLabel>
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
            <Alert severity="success">Informations mises à jour</Alert>
          )}
        </>
      )}
    </Box>
  );
};

export default ContactDetails;
