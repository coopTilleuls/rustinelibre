import React, {ChangeEvent, SyntheticEvent, useCallback, useContext, useEffect} from 'react';
import {Repairer} from '@interfaces/Repairer';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import {RepairerFormContext} from '@contexts/RepairerFormContext';
import {searchCity} from '@utils/apiCity';
import {City, createCitiesWithGouvAPI, createCitiesWithNominatimAPI} from '@interfaces/City';
import {City as GouvCity} from '@interfaces/Gouv';
import {City as NominatimCity} from "@interfaces/Nominatim";

interface ContactDetailsProps {
  repairer: Repairer | null;
}

export const ContactDetails = ({
  repairer,
}: ContactDetailsProps): JSX.Element => {
  const {
    name,
    setName,
    mobilePhone,
    setMobilePhone,
    street,
    setStreet,
    cityInput,
    setCityInput,
    setCity,
    citiesList,
    setCitiesList,
  } = useContext(RepairerFormContext);
  const useNominatim = process.env.NEXT_PUBLIC_USE_NOMINATIM !== 'false';

  useEffect(() => {
    if (repairer) {
      setName(repairer.name ? repairer.name : '');
      setStreet(repairer.street ? repairer.street : '');
      setCityInput(repairer.city ? repairer.city : '');
    }
  }, [repairer, setName, setStreet, setCityInput]);

  const fetchCitiesResult = useCallback(async (cityStr: string) => {
    const citiesResponse = await searchCity(cityStr, useNominatim);
    const cities: City[] = useNominatim
        ? createCitiesWithNominatimAPI(citiesResponse as NominatimCity[])
        : createCitiesWithGouvAPI(citiesResponse as GouvCity[]);
    setCitiesList(cities);
  }, [setCitiesList, useNominatim]);

  useEffect(() => {
    if (cityInput === '' || cityInput.length < 3) {
      setCitiesList([]);
    } else fetchCitiesResult(cityInput);
  }, [setCitiesList, fetchCitiesResult, cityInput]);

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

  const handleCityChange = async (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): Promise<void> => {
    setCityInput(event.target.value);
  };

  const handleCitySelect = (
    event: SyntheticEvent<Element, Event>,
    value: string | null
  ) => {
    const selectedCity = citiesList.find((city) => city.name === value);
    setCity(selectedCity ?? null);
    setCityInput(value ?? '');
  };

  return (
    <>
      <TextField
        margin="normal"
        required
        fullWidth
        id="name"
        label="Nom de votre enseigne"
        name="name"
        autoComplete="name"
        value={name}
        inputProps={{ maxLength: 80 }}
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
        inputProps={{ maxLength: 30 }}
        onChange={handleChangeMobilePhone}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="street"
        label="Numéro et rue"
        name="street"
        autoComplete="street"
        value={street}
        inputProps={{ maxLength: 800 }}
        onChange={handleChangeStreet}
      />
      <Autocomplete
        sx={{mt: 2, mb: 1}}
        freeSolo
        value={cityInput}
        options={citiesList.map((optionCity) => optionCity.name)}
        onChange={(event, values) => handleCitySelect(event, values)}
        renderInput={(params) => (
          <TextField
            required
            label="Ville"
            {...params}
            value={cityInput}
            inputProps={{ maxLength: 60 }}
            onChange={(e) => handleCityChange(e)}
          />
        )}
      />
    </>
  );
};

export default ContactDetails;
