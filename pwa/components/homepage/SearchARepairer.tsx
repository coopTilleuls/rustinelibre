import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useContext,
  FormEvent,
} from 'react';
import {
  Box,
  Stack,
  Typography,
  Autocomplete,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  SelectChangeEvent,
  Button,
} from '@mui/material';
import {
  createCitiesWithNominatimAPI,
  createCitiesWithGouvAPI,
  City,
} from '@interfaces/City';
import {BikeType} from '@interfaces/BikeType';
import {City as NominatimCity} from '@interfaces/Nominatim';
import {City as GouvCity} from '@interfaces/Gouv';
import {searchCity} from '@utils/apiCity';
import {SearchRepairerContext} from '@contexts/SearchRepairerContext';
import {bikeTypeResource} from '@resources/bikeTypeResource';
import SearchIcon from '@mui/icons-material/Search';
import {useRouter} from 'next/router';
import Link from 'next/link';
import HomepageImagesGallery from './search-a-repairer/HomepageImagesGallery';

const SearchARepairer = ({bikeTypesFetched = [] as BikeType[]}) => {
  const useNominatim = process.env.NEXT_PUBLIC_USE_NOMINATIM !== 'false';
  const [citiesList, setCitiesList] = useState<City[]>([]);
  const [bikeTypes, setBikeTypes] = useState<BikeType[]>(bikeTypesFetched);
  const listContainerRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const {
    cityInput,
    setCityInput,
    city,
    setCity,
    selectedBike,
    setSelectedBike,
  } = useContext(SearchRepairerContext);

  const fetchBikeTypes = async () => {
    const responseBikeTypes = await bikeTypeResource.getAll(false);
    setBikeTypes(responseBikeTypes['hydra:member']);
  };

  useEffect(() => {
    // reset search form
    setCity(null);
    setSelectedBike(null);
    setCityInput('');

    if (bikeTypes.length === 0) {
      fetchBikeTypes();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchCitiesResult = useCallback(
    async (cityStr: string) => {
      const citiesResponse = await searchCity(cityStr, useNominatim);
      const cities: City[] = useNominatim
        ? createCitiesWithNominatimAPI(citiesResponse as NominatimCity[])
        : createCitiesWithGouvAPI(citiesResponse as GouvCity[]);
      setCitiesList(cities);
    },
    [setCitiesList, useNominatim]
  );

  useEffect(() => {
    if (cityInput === '' || cityInput.length < 3) {
      setCitiesList([]);
    } else fetchCitiesResult(cityInput);
  }, [setCitiesList, fetchCitiesResult, cityInput]);

  const handleBikeChange = (event: SelectChangeEvent): void => {
    const selectedBikeType = bikeTypes.find(
      (bt) => bt.name === event.target.value
    );
    setSelectedBike(selectedBikeType ? selectedBikeType : null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push('/reparateur/chercher-un-reparateur');
  };

  return (
    <Box display="flex">
      <Box
        px={{xs: 4, md: 0}}
        width="100%"
        display="flex"
        flexDirection="column"
        alignItems={{xs: 'center', md: 'start'}}>
        <Stack width={{xs: '100%', md: '80%'}} spacing={{xs: 2, md: 8}}>
          <Typography
            fontSize={{xs: 22, md: 64}}
            fontWeight={600}
            textAlign={{xs: 'center', md: 'start'}}>
            Besoin de réparer
            <br />
            ton vélo ?
          </Typography>
          <Typography
            fontSize={{xs: 16, md: 24}}
            fontWeight={600}
            textAlign={{xs: 'center', md: 'start'}}>
            Trouve un rendez-vous chez un réparateur
          </Typography>
          <Box display={{xs: 'none', md: 'block'}} width="100%">
            <form onSubmit={handleSubmit}>
              <Box
                width="100%"
                display="flex"
                alignItems="center"
                border="1px solid grey"
                borderRadius={20}
                py={2}
                px={4}>
                <Autocomplete
                  filterOptions={(options, state) => options}
                  sx={{width: '40%'}}
                  ref={listContainerRef}
                  freeSolo
                  value={city}
                  options={citiesList}
                  getOptionLabel={(city) =>
                    typeof city === 'string'
                      ? city
                      : `${city.name}  (${city.postcode})`
                  }
                  onChange={(event, value) => setCity(value as City)}
                  onInputChange={(event, value) => setCityInput(value)}
                  renderInput={(params) => (
                    <TextField
                      placeholder="Dans quelle ville ?"
                      required
                      label="Ville"
                      {...params}
                      variant="standard"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      InputProps={{
                        ...params.InputProps,
                        disableUnderline: true,
                      }}
                      sx={{
                        '& input::placeholder': {
                          color: 'black',
                        },
                      }}
                    />
                  )}
                />
                <Divider
                  orientation="vertical"
                  variant="middle"
                  flexItem
                  sx={{
                    mx: 2,
                    my: 0,
                    orientation: 'vertical',
                  }}
                />
                <FormControl required sx={{width: '60%'}} variant="standard">
                  <InputLabel id="bikeType-label" shrink>
                    Type de vélo
                  </InputLabel>
                  <Select
                    disableUnderline
                    sx={{
                      color: selectedBike ? '' : 'grey.500',
                    }}
                    displayEmpty
                    label="Type de vélo"
                    labelId="bikeType-label"
                    value={selectedBike ? selectedBike.name : ''}
                    onChange={handleBikeChange}>
                    <MenuItem disabled value="">
                      Choisis ton vélo
                    </MenuItem>
                    {bikeTypes.map((bike) => (
                      <MenuItem key={bike.id} value={bike.name}>
                        {bike.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    border: '2px solid',
                    borderColor: 'primary.main',
                    borderRadius: 20,
                    ml: {xs: 0, md: 2},
                  }}>
                  <SearchIcon sx={{color: 'white'}} />
                </Button>
              </Box>
            </form>
          </Box>
        </Stack>
        <Link href="/reparateur/chercher-un-reparateur">
          <Button
            variant="contained"
            sx={{textTransform: 'none', display: {md: 'none'}, mt: 4}}>
            Je recherche
          </Button>
        </Link>
      </Box>
      <HomepageImagesGallery />
    </Box>
  );
};

export default SearchARepairer;
