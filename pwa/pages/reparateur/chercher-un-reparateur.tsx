import {NextPageWithLayout} from 'pages/_app';
import {ENTRYPOINT} from '@config/entrypoint';
import React, {
  useState,
  useEffect,
  useRef,
  FormEvent,
  useContext,
  useCallback,
} from 'react';
import {GetStaticProps} from 'next';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import useMediaQuery from '@hooks/useMediaQuery';
import WebsiteLayout from '@components/layout/WebsiteLayout';
import RepairerSortOptions from '@components/repairers/RepairerSortOptions';
import PaginationBlock from '@components/common/PaginationBlock';
import {SearchRepairerContext} from '@contexts/SearchRepairerContext';
import {
  MenuItem,
  InputLabel,
  Autocomplete,
  TextField,
  Button,
  CircularProgress,
  Container,
  FormControl,
  Box,
  Divider,
  Typography,
} from '@mui/material';
import Select, {SelectChangeEvent} from '@mui/material/Select';
const RepairersResults = dynamic(
  () => import('@components/repairers/RepairersResults'),
  {
    ssr: false,
  }
);
import SearchIcon from '@mui/icons-material/Search';
import {bikeTypeResource} from '@resources/bikeTypeResource';
import {repairerResource} from '@resources/repairerResource';
import {
  createCitiesWithGouvAPI,
  createCitiesWithNominatimAPI,
  City,
} from '@interfaces/City';
import {BikeType} from '@interfaces/BikeType';
import {City as NominatimCity} from '@interfaces/Nominatim';
import {City as GouvCity} from '@interfaces/Gouv';
import {searchCity} from '@utils/apiCity';

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
  const [isLoading, setIsLoading] = useState<Boolean>(false);
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
    setRepairerTypeSelected,
    orderBy,
    filterBy,
    setOrderBy,
    setFilterBy,
    setSortChosen,
    totalItems,
    setTotalItems,
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

  const fetchRepairers = useCallback(async (): Promise<void> => {
    if (!selectedBike || !cityInput) {
      return;
    }
    setPendingSearchCity(true);
    setIsLoading(true);

    let params = {
      city: city ? city.name : cityInput,
      itemsPerPage: 20,
      'bikeTypesSupported.id': selectedBike.id,
      page: `${currentPage ?? 1}`,
      enabled: 'true'
    };

    params = city
      ? {...{'around[5000]': `${city.lat},${city.lon}`}, ...params}
      : params;

    if (orderBy && filterBy) {
      const {key: sortKey, value: sortValue} = orderBy;
      const {key: filterKey, value: filterValue} = filterBy;
      params = {...params, [sortKey]: sortValue, [filterKey]: filterValue};
    } else if (orderBy) {
      const {key, value} = orderBy;
      params = {...params, [key]: value};
    } else if (filterBy) {
      const {key, value} = filterBy;
      params = {...params, [key]: value};
    } else {
      params = {...{availability: 'ASC'}, ...params};
    }

    const response = await repairerResource.getAll(false, params);
    setRepairers(response['hydra:member']);
    setTotalItems(response['hydra:totalItems']);
    setPendingSearchCity(false);
    setAlreadyFetchApi(true);
    setIsLoading(false);
  }, [
    city,
    cityInput,
    currentPage,
    orderBy,
    filterBy,
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

  const handleSelectSortOption = async (
    event: SelectChangeEvent
  ): Promise<void> => {
    const sortOption = event.target.value;
    setSortChosen(event.target.value);

    let value = '';
    if (sortOption === 'availability') {
      value = 'ASC';
    } else if (sortOption === 'proximity') {
      value = `${city?.lat},${city?.lon}`;
    }

    setOrderBy({
      key: sortOption,
      value: value,
    });
  };

  const handleSelectFilterOption = async (
    event: SelectChangeEvent
  ): Promise<void> => {
    setRepairerTypeSelected(event.target.value);

    setFilterBy({
      key: 'repairerType.id',
      value: repairerTypeSelected,
    });
  };

  useEffect(() => {
    if (orderBy) {
      fetchRepairers();
    }
    if (filterBy) {
      fetchRepairers();
    }
  }, [orderBy, filterBy, fetchRepairers]);

  const scrollToTop = (): void => {
    if (listContainerRef.current) {
      const headerHeight = '80px';
      const containerTop =
        listContainerRef.current.getBoundingClientRect().top +
        window.pageYOffset;
      window.scrollTo({top: containerTop - +headerHeight, behavior: 'smooth'});
    }
  };

  return (
    <>
      <Head>
        <title>Chercher un réparateur</title>
      </Head>
      <WebsiteLayout>
        <Box
          height={{xs: 'calc(100vh - 55px)', md: 'calc(100vh - 70px)'}}
          display="flex"
          flexDirection="column"
          overflow="auto">
          <Box
            position="sticky"
            top={0}
            width="100%"
            bgcolor="white"
            paddingY="10px"
            zIndex="200">
            <Container>
              <form onSubmit={handleSubmit}>
                <Box
                  mt={2}
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
                        value={selectedBike ? selectedBike.name : ''}
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
                        <TextField
                          required
                          label="Ville"
                          {...params}
                          size="small"
                        />
                      )}
                    />
                  </Box>
                  {!isMobile && (
                    <Box
                      display={{xs: 'none', md: 'flex'}}
                      alignItems="center"
                      sx={{mt: {xs: 2, md: 0}}}>
                      <Button
                        type="submit"
                        variant="contained"
                        sx={{
                          border: '2px solid',
                          borderColor: 'primary.main',
                          borderRadius: '5px',
                          ml: {xs: 0, md: 2},
                        }}>
                        <SearchIcon sx={{color: 'white'}} />
                      </Button>
                    </Box>
                  )}
                </Box>
                <Box width="100%">
                  {repairers.length ? (
                    <RepairerSortOptions
                      isMobile={isMobile}
                      handleSelectSortOption={handleSelectSortOption}
                      handleSelectFilterOption={handleSelectFilterOption}
                    />
                  ) : null}
                </Box>
              </form>
            </Container>
          </Box>
          <Container sx={{pt: 0}}>
            <Box textAlign="center">
              {repairers.length === 0 && alreadyFetchApi && (
                <Typography>
                  Pas de réparateurs disponibles dans votre ville.
                </Typography>
              )}
            </Box>
            <Box width="100%">
              {repairers.length ? (
                <>{!isLoading && <RepairersResults />}</>
              ) : null}
            </Box>
            <Box textAlign="center" pt={2}>
              {pendingSearchCity && <CircularProgress />}
            </Box>
          </Container>
        </Box>

        {!pendingSearchCity && totalItems > 20 && (
          <PaginationBlock onPageChange={handlePageChange} />
        )}
      </WebsiteLayout>
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
