import React, {
  ChangeEvent,
  SyntheticEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {Repairer} from '@interfaces/Repairer';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import {RepairerFormContext} from '@contexts/RepairerFormContext';
import {searchCity} from '@utils/apiCity';
import {
  City,
  createCities,
} from '@interfaces/City';
import {Alert, Button, CircularProgress, Typography, Box} from "@mui/material";
import {RequestBody} from "@interfaces/Resource";
import {repairerResource} from "@resources/repairerResource";

interface ContactDetailsProps {
  repairer: Repairer | null;
  updateRepairer: (iri : string, body : RequestBody) => Promise<void>;
}

export const ContactDetails = ({
  repairer,
  updateRepairer,
}: ContactDetailsProps): JSX.Element => {
  const {
    name,
    streetNumber,
    mobilePhone,
    street,
    cityInput,
    city,
    citiesList,
    pendingRegistration,
    errorMessage,
    success,
    setName,
    setStreetNumber,
    setMobilePhone,
    setStreet,
    setCityInput,
    setCity,
    setCitiesList,
  } = useContext(RepairerFormContext);
  const useNominatim = process.env.NEXT_PUBLIC_USE_NOMINATIM !== 'false';
  const [loading, setLoading] = useState<boolean>(false);
  const [initialCity, setInitialCity] = useState<City | null>(null);

  useEffect(() => {
    if (repairer) {
      setName(repairer.name ? repairer.name : '');
      setStreet(repairer.street ? repairer.street : '');
      setStreetNumber(repairer.streetNumber ? repairer.streetNumber : '');
      setCityInput(repairer.city ? repairer.city : '');
      setMobilePhone(repairer.mobilePhone ? repairer.mobilePhone : '');
    }
  }, [repairer, setName, setStreet, setCityInput]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!initialCity && repairer && repairer.city){
      fetchCitiesResult(repairer.city);
      citiesList.forEach((city: City) => {
        if (city.name === repairer.city && city.postcode === repairer.postcode) {
          setInitialCity(city);
        }
      });
      setCitiesList([]);
    }
  });

  const fetchCitiesResult = useCallback(async (cityStr: string) => {
      const citiesResponse = await searchCity(cityStr, useNominatim);
      const cities: City[] = createCities(citiesResponse, useNominatim);
      setCitiesList(cities);
    },
    [setCitiesList, useNominatim]
  );

  useEffect(() => {
    if (cityInput === '' || cityInput.length < 3) {
      setCitiesList([]);
    } else fetchCitiesResult(cityInput);
  }, [setCitiesList, fetchCitiesResult, cityInput]);

  const handleChangeName = (event: ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value);
  };

  const handleChangeMobilePhone = (event: ChangeEvent<HTMLInputElement>): void => {
    setMobilePhone(event.target.value);
  };

  const handleChangeStreet = (event: ChangeEvent<HTMLInputElement>): void => {
    setStreet(event.target.value);
  };

  const handleChangeStreetNumber = (event: ChangeEvent<HTMLInputElement>): void => {
    setStreetNumber(event.target.value);
  };

  const handleCitySelect = (event: SyntheticEvent<Element, Event>,value: string | City | null) => {
    if (!value || typeof value !== 'object') return false;
    const selectedCity = citiesList.find((city) => {
      if (!city.name) return false;
      return city.name === value.name && city.postcode === value.postcode;
    });
    setCity(selectedCity ?? null);
    setCityInput(value.name);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (!repairer) return;
    const requestBody: RequestBody = {};

    if (mobilePhone) requestBody['mobilePhone'] = mobilePhone;

    if (name && name !== '') requestBody['name'] = name;

    if (streetNumber && streetNumber !== '') requestBody['streetNumber'] = streetNumber;

    if (street && street !== '') requestBody['street'] = street;

    if (city) { requestBody['city'] = city.name; requestBody['postcode'] = city.postcode;}

    await updateRepairer(repairer['@id'], requestBody)
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Box sx={{marginTop: 3}}>
          {loading && <CircularProgress />}
          {!loading && !repairer && (
              <Typography>Vous ne gérez pas de solution de réparation</Typography>
          )}
          {!loading && (
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
                    value={city ?? initialCity}
                    options={citiesList}
                    getOptionLabel={(city) =>
                        typeof city === 'string'
                            ? city
                            : `${city.name}  (${city.postcode})`
                    }
                    onChange={(event, value) => handleCitySelect(event, value)}
                    onInputChange={(event, value) => {
                      setCityInput(value);
                    }}
                    renderInput={(params) => (
                        <TextField
                            required
                            label="Ville"
                            {...params}
                            size="medium"
                        />
                    )}
                />
          </div>)}

          {!loading && (
              <div>
                <Button type="submit" variant="contained" sx={{my: 2}}>
                  {!pendingRegistration ? (
                      'Enregistrer mes informations'
                  ) : (
                      <CircularProgress size={20} sx={{color: 'white'}} />
                  )}
                </Button>
              </div>
          )}

          {!loading && errorMessage && (
              <Typography variant="body1" color="error">
                {errorMessage}
              </Typography>
          )}

          {success && (
              <Alert severity="success">
                Informations mises à jour
              </Alert>
          )}
        </Box>

      </form>
    </>
  );
};

export default ContactDetails;
