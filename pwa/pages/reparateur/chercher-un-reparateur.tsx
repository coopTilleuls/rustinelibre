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
import useMediaQuery from '@mui/material/useMediaQuery';
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
import {RepairerType} from '@interfaces/RepairerType';
import {repairerTypeResource} from '@resources/repairerTypeResource';
import {Repairer} from '@interfaces/Repairer';
import ConfirmationReloadDialog from '@components/common/ConfirmationReloadDialog';

type SearchRepairerProps = {
  bikeTypesFetched: BikeType[];
  repairerTypesFetched: RepairerType[];
};

const SearchRepairer: NextPageWithLayout<SearchRepairerProps> = ({
  bikeTypesFetched = [],
  repairerTypesFetched = [],
}) => {
  const useNominatim = process.env.NEXT_PUBLIC_USE_NOMINATIM !== 'false';
  const [citiesList, setCitiesList] = useState<City[]>([]);
  const [pendingSearchCity, setPendingSearchCity] = useState<boolean>(false);
  const [alreadyFetchApi, setAlreadyFetchApi] = useState<boolean>(false);
  const [bikeTypes, setBikeTypes] = useState<BikeType[]>(bikeTypesFetched);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const isMobile = useMediaQuery('(max-width: 640px)');
  const listContainerRef = useRef<HTMLDivElement>(null);
  const [repairerTypes, setRepairerTypes] = useState<RepairerType[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    cityInput,
    setCityInput,
    city,
    setCity,
    selectedBike,
    setSelectedBike,
    repairers,
    allRepairers,
    setRepairers,
    setAllRepairers,
    currentPage,
    setCurrentPage,
    repairerTypeSelected,
    setRepairerTypeSelected,
    orderBy,
    filterBy,
    setOrderBy,
    setSortChosen,
    totalItems,
    setTotalItems,
  } = useContext(SearchRepairerContext);

  const fetchBikeTypes = async () => {
    const responseBikeTypes = await bikeTypeResource.getAll(false);
    setBikeTypes(responseBikeTypes['hydra:member']);
  };

  const fetchRepairerTypes = async () => {
    const response = await repairerTypeResource.getAll(false);
    setRepairerTypes(response['hydra:member']);
  };

  useEffect(() => {
    if (bikeTypes.length === 0) {
      fetchBikeTypes();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (repairerTypes.length === 0) {
      fetchRepairerTypes();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getItemsByPage = (
    allRepairers: Repairer[],
    currentPage: number
  ): Repairer[] => {
    const itemsPerPage = 20;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return allRepairers.slice(startIndex, endIndex);
  };

  const fetchRepairers = useCallback(async (): Promise<void> => {
    if (!selectedBike || !city) {
      return;
    }

    setPendingSearchCity(true);
    setIsLoading(true);

    interface ParamsType {
      [key: string]: number | string;
    }

    let params: ParamsType = {
      'bikeTypesSupported.id': selectedBike.id,
      pagination: 'false',
      enabled: 'true',
    };

    if (city) {
      const aroundFilterKey: string = `around[${city.name}]`;
      params[aroundFilterKey] = `${city.lat},${city.lon}`;
    }

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

    if (repairerTypeSelected.length > 0) {
      let repairerTypesIterate: RepairerType[] = [];

      if (repairerTypes.length === 0) {
        const repairerTypesFetched = await repairerTypeResource.getAll(false);
        repairerTypesIterate = repairerTypesFetched['hydra:member'];
      } else {
        repairerTypesIterate = repairerTypes;
      }

      const ids = repairerTypeSelected.map((name) => {
        const repairerType = repairerTypesIterate.find(
          (type) => type.name === name
        );
        return repairerType ? repairerType.id : null;
      });

      const queryString = ids.map((id) => `repairerType.id[]=${id}`).join('&');

      params = {...{repairerType: `${queryString}`}, ...params};
    }

    params = {...{sort: 'random'}, ...params};

    const response = await repairerResource.getAll(false, params);
    setAllRepairers(response['hydra:member']);
    setRepairers(getItemsByPage(response['hydra:member'], currentPage));
    setTotalItems(response['hydra:totalItems']);
    setPendingSearchCity(false);
    setAlreadyFetchApi(true);
    setIsLoading(false);
  }, [
    city,
    currentPage,
    orderBy,
    filterBy,
    selectedBike,
    setRepairers,
    setAllRepairers,
    setTotalItems,
    repairerTypeSelected,
    repairerTypes,
  ]);

  useEffect(() => {
    if (isMobile && city && selectedBike) {
      fetchRepairers();
    }
  }, [city, isMobile, selectedBike]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect((): void => {
    setRepairers(getItemsByPage(allRepairers, currentPage));
    scrollToTop();
  }, [currentPage, setCurrentPage]); // eslint-disable-line react-hooks/exhaustive-deps

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
    if (typeof city !== 'object' || city === null) {
      setErrorMessage('Veuillez sélectionner votre ville dans la liste');
      setIsLoading(false);
      return;
    }
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

  const handleChangeRepairerType = (event: SelectChangeEvent) => {
    const {
      target: {value},
    } = event;

    setRepairerTypeSelected(
      typeof value === 'string' ? value.split(',') : value
    );
  };

  useEffect(() => {
    if (orderBy) {
      fetchRepairers();
    }
  }, [orderBy, fetchRepairers]);

  useEffect(() => {
    fetchRepairers();
  }, [repairerTypeSelected]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (typeof city === 'object') {
      setErrorMessage(null);
    }
  }, [city]);

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
        <ConfirmationReloadDialog />
        <Box
          bgcolor="lightprimary.light"
          height="100%"
          width="100%"
          position="absolute"
          top="0"
          left="0"
          zIndex="-1"
        />
        <Box display="flex" flexDirection="column">
          <Box
            position="fixed"
            top={{xs: '56px', sm: '64px', md: '80px'}}
            width="100%"
            bgcolor="white"
            paddingY="10px"
            zIndex="200"
            boxShadow={1}>
            <Container>
              <Box
                component="form"
                onSubmit={handleSubmit}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    handleSubmit;
                  }
                }}>
                <Box
                  mt={2}
                  mx="auto"
                  width={{xs: '100%', md: '600px'}}
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
                        typeof city === 'string'
                          ? city
                          : `${city.name}  (${city.postcode})`
                      }
                      onChange={(event, value) => setCity(value as City)}
                      onInputChange={(event, value) => {
                        setCityInput(value);
                      }}
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
                  <Box
                    display={{xs: 'none', md: 'flex'}}
                    alignItems="center"
                    sx={{mt: 0}}>
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
                </Box>
                <Box width="100%">
                  {repairers.length ? (
                    <RepairerSortOptions
                      isMobile={isMobile}
                      handleChangeRepairerType={handleChangeRepairerType}
                      handleSelectSortOption={handleSelectSortOption}
                      repairerTypes={repairerTypes}
                    />
                  ) : null}
                </Box>
              </Box>
            </Container>
          </Box>
          <Container sx={{pt: 0}}>
            {errorMessage && (
              <Typography color="error" textAlign="center" sx={{pt: 4}}>
                {errorMessage}
              </Typography>
            )}
            {repairers.length === 0 && alreadyFetchApi && (
              <Box textAlign="center" pt={isMobile ? 25 : 20}>
                <Typography>
                  Nous n&apos;avons pas trouvé de réparateurs dans cette ville.
                </Typography>
                <Typography>
                  Veuillez svp recommencer votre recherche.
                </Typography>
              </Box>
            )}
            <Box width="100%" pt={{xs: '222px', md: '170px'}}>
              {repairers.length ? (
                <>{!isLoading && <RepairersResults />}</>
              ) : null}
            </Box>
            <Box textAlign="center" pt={2}>
              {pendingSearchCity && <CircularProgress />}
            </Box>

            {!pendingSearchCity && totalItems > 20 && (
              <Box sx={{marginLeft: '10%'}}>
                <PaginationBlock onPageChange={handlePageChange} />
              </Box>
            )}
          </Container>
        </Box>
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

  const repairerTypesCollection = await repairerTypeResource.getAll(false);
  const repairerTypesFetched = repairerTypesCollection['hydra:member'];

  return {
    props: {
      bikeTypesFetched,
      repairerTypesFetched,
    },
    revalidate: 10,
  };
};

export default SearchRepairer;
