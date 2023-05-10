import {NextPageWithLayout} from 'pages/_app';
import React, {
  useState,
  useEffect,
  useRef,
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
  Box,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

type SearchRepairerProps = {
  bikeTypesFetched: BikeType[];
};

const SearchRepairer: NextPageWithLayout<SearchRepairerProps> = ({
  bikeTypesFetched = [],
}) => {
  const useNominatim = process.env.NEXT_PUBLIC_USE_NOMINATIM !== 'false';
  const [citiesList, setCitiesList] = useState<City[]>([]);
  const [timeoutId, setTimeoutId] = useState<number | null>(null);
  const [pendingSearchCity, setPendingSearchCity] = useState<boolean>(false);
  const [alreadyFetchApi, setAlreadyFetchApi] = useState<boolean>(false);
  const [bikeTypes, setBikeTypes] = useState<BikeType[]>(bikeTypesFetched);
  const isMobile = useMediaQuery('(max-width: 640px)');
  const listContainerRef = useRef<HTMLDivElement>(null);

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
    totalItems,
    setTotalItems,
    showMap,
    setShowMap,
  } = useContext(SearchRepairerContext);

  async function fetchBikeTypes() {
    const responseBikeTypes = await bikeTypeResource.getAll(false);
    setBikeTypes(responseBikeTypes['hydra:member']);
  }

  useEffect(() => {
    if (bikeTypes.length === 0) {
      fetchBikeTypes();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
          <Box
            mx="auto"
            width={{xs: '100%', md: '50%'}}
            display="flex"
            flexDirection={{xs: 'column', md: 'row'}}
            justifyContent="space-between"
            alignItems={{xs: 'left', md: 'center'}}
            sx={{
              p: 2,
              border: (theme) => `1px solid ${theme.palette.divider}`,
              borderRadius: '10px',
            }}>
            <Box width={{xs: '100%', md: '50%'}}>
              <FormControl required fullWidth size="small">
                <InputLabel id="bikeType-label">Type de vélo</InputLabel>
                <Select
                  label="Type de vélo"
                  value={selectedBike?.name}
                  onChange={handleBikeChange}>
                  <MenuItem disabled value="">
                    <em>Type de vélo</em>
                  </MenuItem>
                  {bikeTypes.map((bike) => (
                    <MenuItem key={bike.id} value={bike.name}>
                      {bike.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Divider
              orientation="vertical"
              variant="middle"
              flexItem
              sx={{
                mx: 2,
                my: {xs: 1, md: 0},
                orientation: {xs: 'horizontal', md: 'vertical'},
              }}
            />
            <Box width={{xs: '100%', md: '50%'}} ref={listContainerRef}>
              <Autocomplete
                freeSolo
                value={city}
                options={citiesList}
                getOptionLabel={(city) =>
                  typeof city === 'string' ? city : city.name
                }
                onChange={(event, value) => setCity(value as City)}
                onInputChange={(event, value) => setCityInput(value)}
                renderInput={(params) => (
                  <TextField label="Ville" {...params} size="small" />
                )}
              />
            </Box>
            <Box display="flex" alignItems="center" sx={{mt: {xs: 2, md: 0}}}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  borderRadius: '5px',
                  height: '100%',
                  ml: {xs: 0, md: 1},
                }}>
                <SearchIcon sx={{color: 'white'}} />
              </Button>
              {repairers.length ? (
                <Button
                  sx={{ml: 2, display: {md: 'none'}}}
                  onClick={() => setShowMap(!showMap)}
                  variant="outlined">
                  {showMap ? 'Voir les résultats' : 'Voir sur la carte'}
                </Button>
              ) : null}
            </Box>
          </Box>
          <Box width="full">
            {repairers.length ? (
              <RepairerSortOptions isMobile={isMobile} />
            ) : null}
          </Box>
        </form>

        <Box textAlign="center" pt={2}>
          {repairers.length === 0 && alreadyFetchApi && (
            <Typography>
              Pas de réparateurs disponibles dans votre ville.
            </Typography>
          )}
        </Box>

        <Box width="full" sx={{overflow: 'auto'}}>
          {!pendingSearchCity && repairers.length ? <RepairersResults /> : null}
        </Box>
        <Box textAlign="center" pt={2}>
          {pendingSearchCity && <CircularProgress />}
        </Box>
      </Container>
      {!pendingSearchCity && totalItems > 20 && (
        <PaginationBlock onPageChange={handlePageChange} />
      )}
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  if (!ENTRYPOINT) {
    return {
      props: {},
    };
  }

  const bikeTypesCollection = await bikeTypeResource.getAll(false);
  const bikeTypesFetched = bikeTypesCollection['hydra:member'];

  return {
    props: {
      bikeTypesFetched,
    },
    revalidate: 10,
  };
};

export default SearchRepairer;
