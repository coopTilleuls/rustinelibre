import React, {ChangeEvent, useCallback, useEffect, useState} from 'react';
import {Box, Typography, Button, TextField, Autocomplete} from '@mui/material';
import {Repairer} from '@interfaces/Repairer';
import MapPositionUser from '@components/dashboard/appointments/MapPositionUser';
import {City as GouvCity} from "@interfaces/Gouv";
import {searchCity, searchStreet} from "@utils/apiCity";
import {createCitiesWithGouvAPI, City} from "@interfaces/City";
import {Street} from "@interfaces/Street";

interface PinMapProps {
  repairer: Repairer;
  latitude: string;
  longitude: string;
  cancelPinMap: () => void;
  confirmPinMap: () => void;
  setLatitude: (latitude: string) => void;
  setLongitude: (longitude: string) => void;
  address: string;
  setAddress: (address: string) => void;
}

const PinMap = ({
  repairer,
  latitude,
  longitude,
  cancelPinMap,
  confirmPinMap,
  setLatitude,
  setLongitude,
  address,
  setAddress
}: PinMapProps): JSX.Element => {

  const [city, setCity] = useState<City | null>(null);
  const [street, setStreet] = useState<string | null>(null);
  const [streetNumber, setStreetNumber] = useState<string | null>(null);
  const [latitudeCalculate, setLatitudeCalculate] = useState<string | null>(null);
  const [longitudeCalculate, setLongitudeCalculate] = useState<string | null>(null);
  const [cityInput, setCityInput] = useState<string>('');
  const [citiesList, setCitiesList] = useState<City[]>([]);
  const [streetList, setStreetList] = useState<Street[]>([]);
  const [streetSelected, setStreetSelected] = useState<Street|null>(null);


  const handleChangeStreetNumber = (event: ChangeEvent<HTMLInputElement>) => {
      setStreetNumber(event.target.value);
  };

  const handleChangeStreet = async (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): Promise<void> => {
        const adresseSearch = event.target.value;
        if (adresseSearch.length >= 3) {
            const streetApiResponse = await searchStreet(adresseSearch, city);
            setStreetList(streetApiResponse)
        }
  };

  const fetchCitiesResult = useCallback(
      async (cityStr: string) => {
        const citiesResponse = await searchCity(cityStr, false);
        const cities: City[] =  createCitiesWithGouvAPI(citiesResponse as GouvCity[]);
        setCitiesList(cities);
      },
      [setCitiesList]
  );

  useEffect(() => {
    if (cityInput === '' || cityInput.length < 3) {
      setCitiesList([]);
    } else fetchCitiesResult(cityInput);
  }, [setCitiesList, fetchCitiesResult, cityInput]);


  useEffect(() => {
    if (streetSelected) {
        setLatitudeCalculate(streetSelected.lat.toString());
        setLongitudeCalculate(streetSelected.lon.toString());
    }
  }, [streetSelected]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (streetNumber) {
        setAddress(`${streetNumber} ${streetSelected?.name}, ${city?.name} (${city?.postcode})`)
    }
  }, [streetNumber]); // eslint-disable-line react-hooks/exhaustive-deps


  const handleCityChange = async (
      event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): Promise<void> => {
    setCityInput(event.target.value);
  };

  return (
    <Box width="100%">
      <Typography pb={2} textAlign="center">
        Placez le repère sur le lieu où vous souhaitez l&apos;intervention du
        réparateur.
      </Typography>

      <Autocomplete
          sx={{mt: 2, mb: 1}}
          freeSolo
          value={cityInput}
          options={citiesList}
          getOptionLabel={(city) =>
              typeof city === 'string'
                  ? city
                  : `${city.name} (${city.postcode})`
          }
          onChange={(event, value) => setCity(value as City)}
          renderInput={(params) => (
              <TextField
                  label="Ville"
                  required
                  {...params}
                  value={cityInput}
                  onChange={(e) => handleCityChange(e)}
              />
          )}
      />

      {city && <Autocomplete
          sx={{mt: 2, mb: 1}}
          freeSolo
          value={street}
          options={streetList}
          getOptionLabel={(streetObject) =>
              typeof streetObject === 'string'
                  ? streetObject
                  :`${streetObject.name} (${streetObject.city})`
          }
          onChange={(event, value) => setStreetSelected(value as Street)}
          renderInput={(params) => (
              <TextField
                  label="Rue"
                  required
                  {...params}
                  value={street}
                  onChange={(e) => handleChangeStreet(e)}
              />
          )}
      />}

      {streetSelected && <TextField
          margin="normal"
          required
          fullWidth
          id="address"
          label="Indiquez votre numéro de rue et les informations nécessaires afin de permettre au réparateur de trouver votre adresse"
          name="address"
          autoComplete="address"
          value={streetNumber}
          inputProps={{ maxLength: 250 }}
          onChange={handleChangeStreetNumber}
      />}

      {city && streetSelected && streetNumber && latitudeCalculate && longitudeCalculate && <MapPositionUser
        repairer={repairer}
        setLatitude={setLatitude}
        setLongitude={setLongitude}
        latitudeProps={latitudeCalculate}
        longitudeProps={longitudeCalculate}
      />}

      <Box display="flex" justifyContent="space-between" px={2} pt={2}>
        <Button variant="outlined" onClick={cancelPinMap}>
          Retour
        </Button>
        <Button
          disabled={!longitude || !latitude || !city || !streetSelected || !streetNumber}
          variant="contained"
          onClick={confirmPinMap}>
          Suivant
        </Button>
      </Box>
    </Box>
  );
};

export default PinMap;
