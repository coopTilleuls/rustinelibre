import React, {
  ChangeEvent,
  SyntheticEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {Repairer} from '@interfaces/Repairer';
import {searchCity} from '@utils/apiCity';
import {City, createCities} from '@interfaces/City';
import {
  Alert,
  Button,
  CircularProgress,
  Typography,
  Box,
  TextField,
  Autocomplete,
} from '@mui/material';
import {RequestBody} from '@interfaces/Resource';
import {errorRegex} from '@utils/errorRegex';

const useNominatim = process.env.NEXT_PUBLIC_USE_NOMINATIM !== 'false';

interface ContactDetailsProps {
  repairer: Repairer | null;
  // eslint-disable-next-line no-unused-vars
  updateRepairer: (iri: string, bodyRequest: RequestBody) => Promise<void>;
}

export const ContactDetails = ({
  repairer,
  updateRepairer,
}: ContactDetailsProps): JSX.Element => {
  const [pendingRegistration, setPendingRegistration] =
    useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [name, setName] = useState<string>('');
  const [mobilePhone, setMobilePhone] = useState<string>('');
  const [streetNumber, setStreetNumber] = useState<string>('');
  const [street, setStreet] = useState<string>('');
  const [city, setCity] = useState<City | null>(null);
  const [citiesList, setCitiesList] = useState<City[]>([]);

  useEffect(() => {
    if (repairer) {
      setName(repairer.name!);
      setStreet(repairer.street!);
      setStreetNumber(repairer.streetNumber!);
      setMobilePhone(repairer.mobilePhone!);

      if (!city && repairer.city && repairer.postcode) {
        setCity({
          formatted_name: `${repairer.city} (${repairer.postcode})`,
          id: 0,
          lat: 0,
          lon: 0,
          name: repairer.city,
          postcode: repairer.postcode,
        } as City);
      }
    }
  }, [repairer, setName, setStreet]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchCitiesResult = useCallback(
    async (cityStr: string) => {
      const citiesResponse = await searchCity(cityStr, useNominatim);
      const cities: City[] = createCities(citiesResponse, useNominatim);
      setCitiesList(cities);
    },
    [setCitiesList]
  );

  const handleCityChange = (value: string): void => {
    if (value === '' || value.length < 3) {
      setCitiesList([]);
    } else fetchCitiesResult(value);
  };

  const handleChangeName = (event: ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value);
  };

  const handleChangeMobilePhone = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setMobilePhone(event.target.value);
  };

  const handleChangeStreet = (event: ChangeEvent<HTMLInputElement>): void => {
    setStreet(event.target.value);
  };

  const handleChangeStreetNumber = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setStreetNumber(event.target.value);
  };

  const handleCitySelect = (
    event: SyntheticEvent<Element, Event>,
    value: string | City | null
  ) => {
    if (!value || typeof value !== 'object') return false;
    const selectedCity = citiesList.find((city) => {
      if (!city.name) return false;
      return city.name === value.name && city.postcode === value.postcode;
    });
    setCity(selectedCity ?? null);
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    if (!repairer) {
      return;
    }
    try {
      setPendingRegistration(true);
      await updateRepairer(repairer['@id'], {
        name: name,
        mobilePhone: mobilePhone,
        streetNumber: streetNumber,
        street: street,
        city: city?.name,
        postcode: city?.postcode,
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
    <Box mt={3} component="form" onSubmit={handleSubmit}>
      {!repairer && (
        <Typography>Vous ne gérez pas de solution de réparation</Typography>
      )}
      <div>
        <TextField
          margin="normal"
          required
          fullWidth
          id="name"
          label="Nom de votre enseigne"
          name="name"
          autoComplete="name"
          value={name}
          inputProps={{maxLength: 80}}
          onChange={handleChangeName}
        />
        <TextField
          margin="normal"
          fullWidth
          type="tel"
          id="mobilePhone"
          label="Numéro de téléphone"
          name="name"
          autoComplete="mobilePhone"
          value={mobilePhone}
          inputProps={{maxLength: 30}}
          onChange={handleChangeMobilePhone}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="streetNumber"
          label="Numéro dans la rue"
          name="streetNumber"
          autoComplete="streetNumber"
          value={streetNumber}
          inputProps={{maxLength: 30}}
          onChange={handleChangeStreetNumber}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="street"
          label="Rue"
          name="street"
          autoComplete="street"
          value={street}
          inputProps={{maxLength: 800}}
          onChange={handleChangeStreet}
        />
        <Autocomplete
          sx={{mt: 2, mb: 1, p: 0}}
          freeSolo
          value={city}
          options={citiesList}
          getOptionLabel={(city) =>
            typeof city === 'string' ? city : `${city.name}  (${city.postcode})`
          }
          onChange={(event, value) => handleCitySelect(event, value)}
          onInputChange={(event, value) => {
            handleCityChange(value);
          }}
          renderInput={(params) => (
            <TextField required label="Ville" {...params} size="medium" />
          )}
        />
      </div>
      <div>
        <Button type="submit" variant="contained" sx={{my: 2}}>
          {!pendingRegistration ? (
            'Enregistrer les informations'
          ) : (
            <CircularProgress size={20} sx={{color: 'white'}} />
          )}
        </Button>
      </div>
      {errorMessage && (
        <Typography variant="body1" color="error">
          {errorMessage}
        </Typography>
      )}
      {success && <Alert severity="success">Informations mises à jour</Alert>}
    </Box>
  );
};

export default ContactDetails;
