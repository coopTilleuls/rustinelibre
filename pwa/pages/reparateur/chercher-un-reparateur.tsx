import {NextPageWithLayout} from 'pages/_app';
import React, {
  useState,
  useEffect,
  ChangeEvent,
  useRef,
  SyntheticEvent,
  FormEvent,
  useContext,
  useCallback,
} from 'react';
import Head from 'next/head';
import {repairerResource} from '@resources/repairerResource';
import {
  createCitiesWithGouvAPI,
  createCitiesWithNominatimAPI,
  City,
} from '@interfaces/City';
import {City as NominatimCity} from '@interfaces/Nominatim';
import {City as GouvCity} from '@interfaces/Gouv';
import {searchCity} from '@utils/apiCity';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import dynamic from 'next/dynamic';
const RepairersResults = dynamic(
  () => import('@components/repairers/RepairersResults'),
  {
    ssr: false,
  }
);
import RepairerSortOptions from '@components/repairers/RepairerSortOptions';
import PaginationBlock from '@components/common/PaginationBlock';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@hooks/useMediaQuery';
import WebsiteLayout from '@components/layout/WebsiteLayout';
import {SearchRepairerContext} from '@contexts/SearchRepairerContext';
import {GetStaticProps} from 'next';
import {bikeTypeResource} from '@resources/bikeTypeResource';
import {BikeType} from '@interfaces/BikeType';
import {ENTRYPOINT} from '@config/entrypoint';
import {
  CircularProgress,
  Container,
  FormControl,
  Stack,
  Box,
} from '@mui/material';
import useBikeTypes from "@hooks/useBikeTypes";

type SearchRepairerProps = {
  // bikeTypes: BikeType[];
};

const SearchRepairer: NextPageWithLayout<SearchRepairerProps> = ({
  // bikeTypes = [],
}) => {
  const useNominatim = process.env.NEXT_PUBLIC_USE_NOMINATIM !== 'false';
  const [citiesList, setCitiesList] = useState<City[]>([]);
  const [timeoutId, setTimeoutId] = useState<number | null>(null);
  const [pendingSearchCity, setPendingSearchCity] = useState<boolean>(false);
  const [alreadyFetchApi, setAlreadyFetchApi] = useState<boolean>(false);
  const [bikeTypes, setBikeTypes] = useState<BikeType[]>(bikeTypesFetched);
  const isMobile = useMediaQuery('(max-width: 640px)');
  const listContainerRef = useRef<HTMLDivElement>(null);
  const bikeTypes = useBikeTypes();

  const {
    cityInput,
    setCityInput,
    city,
    setCity,
    selectedBike,
    setSelectedBike,
    repairers,
    setRepairers,
    currentPage,
    setCurrentPage,
    repairerTypeSelected,
    orderBy,
    setOrderBy,
    sortChosen,
    setSortChosen,
    totalItems,
    setTotalItems,
    showMap,
    setShowMap,
  } = useContext(SearchRepairerContext);

  // useEffect(() => { // @todo remove it when SSR OK
  //   if (bikeTypes.length === 0) {
  //     bikeTypes = bikesTypesFetched; // eslint-disable-line react-hooks/exhaustive-deps
  //   }
  // }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchRepairers = useCallback(async (): Promise<void> => {
    if (!selectedBike || !cityInput) {
      return;
    }

    setPendingSearchCity(true);

    let params = {
      city: city ? city.name : cityInput,
      itemsPerPage: 20,
      'bikeTypesSupported.id': selectedBike.id,
      page: `${currentPage ?? 1}`,
    };

    params = city
      ? {...{'around[5000]': `${city.lat},${city.lon}`}, ...params}
      : params;

    if (orderBy) {
      const {key, value} = orderBy;
      params = {...params, [key]: value};
    } else {
      params = {...{availability: 'ASC'}, ...params};
    }

    const response = await repairerResource.getAll(false, params);
    setRepairers(response['hydra:member']);
    setTotalItems(response['hydra:totalItems']);
    setPendingSearchCity(false);
    setAlreadyFetchApi(true);
  }, [
    city,
    cityInput,
    currentPage,
    orderBy,
    selectedBike,
    setRepairers,
    setTotalItems,
  ]);

  useEffect(() => {
    if (isMobile && city && selectedBike) {
      fetchRepairers();
    }
  }, [city, isMobile, selectedBike]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect((): void => {
    fetchRepairers();
    scrollToTop();
  }, [currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (sortChosen === 'repairersType') {
      setOrderBy({
        key: 'repairerType.id',
        value: repairerTypeSelected,
      });
    }
  }, [repairerTypeSelected, setOrderBy, sortChosen]);

  useEffect(() => {
    if (cityInput === '' || cityInput.length <= 2) return;

    if (timeoutId) clearTimeout(timeoutId);

    const newTimeoutId = window.setTimeout(async () => {
      const citiesResponse = await searchCity(cityInput, useNominatim);
      const cities: City[] = useNominatim
        ? createCitiesWithNominatimAPI(citiesResponse as NominatimCity[])
        : createCitiesWithGouvAPI(citiesResponse as GouvCity[]);
      setCitiesList(cities);
    }, 350);

    setTimeoutId(newTimeoutId);
  }, [cityInput, useNominatim]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCityChange = async (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): Promise<void> => {
    setCityInput(event.target.value);
  };

  const handleChangeSort = (sortOption: string): void => {
    setSortChosen(sortOption);

    let value = '';
    if (sortOption === 'repairersType') {
      value = repairerTypeSelected;
    } else if (sortOption === 'availability') {
      value = 'ASC';
    } else if (sortOption === 'proximity') {
      value = `${city?.lat},${city?.lon}`;
    }

    setOrderBy({
      key: sortOption,
      value: value,
    });
  };

  const handleCitySelect = (
    event: SyntheticEvent<Element, Event>,
    value: string | null
  ) => {
    const selectedCity = citiesList.find((city) => city.name === value);
    setCity(selectedCity ?? null);
    setCityInput(value ?? '');
  };

  const handleBikeChange = (event: SelectChangeEvent): void => {
    const selectedBikeType = bikeTypes.find(
      (bt) => bt.name === event.target.value
    );
    setSelectedBike(selectedBikeType ? selectedBikeType : null);
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    await fetchRepairers();
  };

  const handlePageChange = (pageNumber: number): void => {
    setCurrentPage(pageNumber);
  };

  const scrollToTop = (): void => {
    if (listContainerRef.current) {
      listContainerRef.current.scrollIntoView({behavior: 'smooth'});
    }
  };

  return (
    <>
      <Head>
        <title>Chercher un réparateur</title>
      </Head>
      <WebsiteLayout />
      <Container sx={{py: 5}}>
        <form onSubmit={handleSubmit}>
          <Stack
            direction={{xs: 'column', md: 'row'}}
            alignItems={{md: 'center'}}
            spacing={2}>
            <Box
              sx={{
                width: {xs: '100%', md: '50%'},
              }}>
              <FormControl fullWidth required sx={{mt: 1, mb: 1}}>
                <InputLabel
                  htmlFor="bikeType"
                  sx={{fontSize: {xs: 10, md: 16}}}>
                  Type de Vélo
                </InputLabel>
                <Select
                  label="Type de vélo"
                  fullWidth
                  onChange={handleBikeChange}
                  value={selectedBike?.name}>
                  <MenuItem disabled value="">
                    Choisissez un type de vélo
                  </MenuItem>
                  {bikeTypes.map((bike) => (
                    <MenuItem key={bike.id} value={bike.name}>
                      {bike.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            {selectedBike && (
              <Box
                sx={{
                  width: {xs: '100%', md: '50%'},
                }}
                ref={listContainerRef}>
                <Autocomplete
                  freeSolo
                  value={cityInput}
                  options={citiesList.map((optionCity) => optionCity.name)}
                  onChange={(event, values) => handleCitySelect(event, values)}
                  renderInput={(params) => (
                    <TextField
                      label="Ville"
                      {...params}
                      value={cityInput}
                      onChange={(e) => handleCityChange(e)}
                    />
                  )}
                />
              </Box>
            )}
          </Stack>
          <Stack
            pt={2}
            direction={{xs: 'column', md: 'row'}}
            alignItems={{md: 'center'}}
            spacing={2}>
            {city && (
              <RepairerSortOptions
                handleChangeSort={handleChangeSort}
                isMobile={isMobile}
              />
            )}
          </Stack>
          {city && (
            <Box
              width="100%"
              sx={{py: 2}}
              display="flex"
              justifyContent="space-between">
              <Button type="submit" variant="contained">
                Chercher
              </Button>
              {repairers.length ? (
                <Button
                  sx={{display: {lg: 'none'}}}
                  onClick={() => setShowMap(!showMap)}
                  variant="outlined">
                  {showMap ? 'Voir les résultats' : 'Voir sur la carte'}
                </Button>
              ) : null}
            </Box>
          )}
        </form>

        <Box textAlign="center" pt={2}>
          {pendingSearchCity && <CircularProgress />}
        </Box>

        <Box width={'full'}>
          {!pendingSearchCity && repairers.length ? <RepairersResults /> : null}
          {repairers.length === 0 && alreadyFetchApi && (
            <Typography>
              Pas de réparateurs disponibles dans votre ville.
            </Typography>
          )}
        </Box>
      </Container>

      {!pendingSearchCity && totalItems > 20 && (
        <PaginationBlock onPageChange={handlePageChange} />
      )}
    </>
  );
};

// export const getStaticProps: GetStaticProps = async () => {
//   if (!ENTRYPOINT) {
//     return {
//       props: {},
//     };
//   }
//
//   const bikeTypesCollection = await bikeTypeResource.getAll(false);
//   const bikeTypes = bikeTypesCollection['hydra:member'];
//
//   return {
//     props: {
//       bikeTypes,
//     },
//     revalidate: 10,
//   };
// };

export default SearchRepairer;
