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
import Image from 'next/image';
import {
  Box,
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
  IconButton,
  Container,
} from '@mui/material';
import ModalSearchRepairer from './ModalSearchRepairer';
import LetterR from '@components/common/LetterR';

const SearchARepairer = ({bikeTypesFetched = [] as BikeType[]}) => {
  const useNominatim = process.env.NEXT_PUBLIC_USE_NOMINATIM !== 'false';
  const [citiesList, setCitiesList] = useState<City[]>([]);
  const [bikeTypes, setBikeTypes] = useState<BikeType[]>(bikeTypesFetched);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const listContainerRef = useRef<HTMLDivElement>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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
    if (typeof city === 'object') {
      setErrorMessage(null);
    }
  }, [city]);

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
    if (typeof city !== 'object') {
      setErrorMessage('Veuillez sélectionner votre ville dans la liste');
      return;
    }
    router.push('/reparateur/chercher-un-reparateur');
  };

  const handleModal = () => {
    setSelectedBike(null);
    setCity(null);
    setOpenModal(true);
  };

  return (
    <Box bgcolor="lightprimary.main" position="relative" width="100%" mb={6}>
      <Container
        sx={{
          display: 'flex',
          gap: 6,
          minHeight: {
            xs: 'calc(100vh - 112px)',
            sm: 'calc(100vh - 120px)',
            md: 'calc(100vh - 152px)',
          },
        }}>
        <Box
          px={{xs: 4, md: 2}}
          paddingY={6}
          width={{xs: '100%', md: '55%'}}
          display="flex"
          flexDirection="column"
          gap={2}
          my="auto"
          alignItems={{xs: 'center', md: 'start'}}>
          <Box
            width="100%"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexDirection={{xs: 'column', md: 'row'}}
            position="relative">
            <Box
              position="absolute"
              top="0"
              left="50%"
              width="110px"
              sx={{
                transform: 'translateY(-90%)',
                display: {xs: 'none', lg: 'block'},
              }}>
              <LetterR color="primary" />
            </Box>
            <Typography
              variant="h1"
              component="h1"
              color="primary"
              textAlign={{xs: 'center', md: 'start'}}
              sx={{mr: 4}}>
              Réparation <br />
              de vélo locale et solidaire
            </Typography>
            <img alt="" src="/img/yeah.svg" width="170px" />
          </Box>
          <Box display={{xs: 'none', md: 'block'}} width="100%">
            <Box
              onSubmit={handleSubmit}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleSubmit;
                }
              }}
              component="form"
              width="100%"
              display="flex"
              alignItems="center"
              boxShadow={1}
              bgcolor="white"
              borderRadius={20}
              p={3}>
              <Autocomplete
                filterOptions={(options) => options}
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
                  bgcolor: 'primary.main',
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
                disabled={!city}
                size="large"
                type="submit"
                color="primary"
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  transform: 'scale(1.2)',
                  '&:hover': {bgcolor: 'primary.light'},
                }}>
                <SearchIcon sx={{color: 'white'}} />
              </IconButton>
            </Box>
            {errorMessage && (
              <Typography color="error" textAlign="center" sx={{pt: 4}}>
                {errorMessage}
              </Typography>
            )}
          </Box>
          <Box display={{md: 'none'}}>
            <Button
              onClick={handleModal}
              variant="contained"
              size="large"
              sx={{display: {md: 'none'}, mt: 4}}>
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
        <Box
          width="45%"
          position="relative"
          display={{xs: 'none', md: 'block'}}>
          <Box
            zIndex={5}
            sx={{
              position: 'absolute',
              left: '0',
              top: '15%',
              transform: 'translateX(-50%)',
            }}>
            <img alt="" src="/img/eclair.svg" width="60px" />
          </Box>
          <Box width="50vw" height="100%" position="absolute" left="0" top="0">
            <Box position="relative" height="100%" width="100%">
              <Image
                fill
                alt=""
                src="/img/female-worker.jpg"
                style={{
                  objectFit: 'cover',
                }}
              />
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default SearchARepairer;
