import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useContext,
  FormEvent,
} from 'react';
import {useRouter} from 'next/router';
import {SearchRepairerContext} from '@contexts/SearchRepairerContext';
import {bikeTypeResource} from '@resources/bikeTypeResource';
import {
  createCitiesWithNominatimAPI,
  createCitiesWithGouvAPI,
  City,
} from '@interfaces/City';
import {BikeType} from '@interfaces/BikeType';
import {City as NominatimCity} from '@interfaces/Nominatim';
import {City as GouvCity} from '@interfaces/Gouv';
import {searchCity} from '@utils/apiCity';
import SearchIcon from '@mui/icons-material/Search';
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
  Link,
  Avatar,
  IconButton,
} from '@mui/material';
import HomepageImagesGallery from './search-a-repairer/HomepageImagesGallery';
import ModalSearchRepairer from './ModalSearchRepairer';

const SearchARepairer = ({bikeTypesFetched = [] as BikeType[]}) => {
  const useNominatim = process.env.NEXT_PUBLIC_USE_NOMINATIM !== 'false';
  const [citiesList, setCitiesList] = useState<City[]>([]);
  const [bikeTypes, setBikeTypes] = useState<BikeType[]>(bikeTypesFetched);
  const [openModal, setOpenModal] = useState<boolean>(false);
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
      setCity(null);
    } else {
      fetchCitiesResult(cityInput);
    }
  }, [setCitiesList, fetchCitiesResult, cityInput]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const handleModal = () => {
    setSelectedBike(null);
    setCity(null);
    setOpenModal(true);
  };

  return (
    <Box display="flex">
      <Box
        px={{xs: 4, md: 0}}
        width="100%"
        display="flex"
        flexDirection="column"
        alignItems={{xs: 'center', md: 'start'}}>
        <Stack width={{xs: '100%', md: '90%'}} spacing={{xs: 2, md: 8}}>
          <Typography
            variant="h1"
            component="h1"
            color="primary"
            textAlign={{xs: 'center', md: 'start'}}>
            Réparation <br />
            de vélo locale et solidaire
          </Typography>
          <Box display={{xs: 'none', md: 'block'}} width="100%">
            <Box
              onSubmit={handleSubmit}
              component="form"
              width="100%"
              display="flex"
              alignItems="center"
              boxShadow={1}
              bgcolor="white"
              borderRadius={20}
              p={2}>
              <Autocomplete
                filterOptions={(options, state) => options}
                sx={{width: '50%', ml: 2}}
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
              <FormControl
                required
                sx={{width: '60%', mr: 2}}
                variant="standard">
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
              <IconButton
                size="large"
                type="submit"
                color="primary"
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': {bgcolor: 'primary.light'},
                }}>
                <SearchIcon sx={{color: 'white'}} />
              </IconButton>
            </Box>
          </Box>
        </Stack>
        <Box display={{md: 'none'}}>
          <Button
            onClick={handleModal}
            variant="contained"
            sx={{textTransform: 'none', display: {md: 'none'}, mt: 4}}>
            Je recherche
          </Button>
          <ModalSearchRepairer
            openModal={openModal}
            bikeTypes={bikeTypes}
            handleCloseModal={() => setOpenModal(false)}
            citiesList={citiesList}
          />
        </Box>
      </Box>
      <HomepageImagesGallery />
    </Box>
  );
};

export default SearchARepairer;
