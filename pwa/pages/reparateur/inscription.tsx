import {NextPageWithLayout} from 'pages/_app';
import {ENTRYPOINT} from '@config/entrypoint';
import React, {
  useState,
  ChangeEvent,
  useEffect,
  useCallback,
  useContext,
} from 'react';
import {GetStaticProps} from 'next';
import Head from 'next/head';
import Link from 'next/link';
import {bikeTypeResource} from '@resources/bikeTypeResource';
import {repairerTypeResource} from '@resources/repairerTypeResource';
import {repairerResource} from '@resources/repairerResource';
import {validateEmail} from '@utils/emailValidator';
import {validatePassword} from '@utils/passwordValidator';
import {searchCity, searchStreet} from '@utils/apiCity';
import {errorRegex} from '@utils/errorRegex';
import WebsiteLayout from '@components/layout/WebsiteLayout';
import {
  Box,
  Container,
  MenuItem,
  ListItemText,
  Typography,
  TextField,
  Button,
  Autocomplete,
  InputLabel,
  CircularProgress,
  FormControl,
  Paper,
  Checkbox,
  Grid,
} from '@mui/material';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import PasswordInput from '@components/form/input/PasswordInput';
import LetterR from '@components/common/LetterR';
import {BikeType} from '@interfaces/BikeType';
import {
  City,
  createCitiesWithGouvAPI,
  createCitiesWithNominatimAPI,
} from '@interfaces/City';
import {City as NominatimCity} from '@interfaces/Nominatim';
import {City as GouvCity} from '@interfaces/Gouv';
import {RepairerType} from '@interfaces/RepairerType';
import {Street} from '@interfaces/Street';
import {UserFormContext} from '@contexts/UserFormContext';

const useNominatim = process.env.NEXT_PUBLIC_USE_NOMINATIM !== 'false';

type RepairerRegistrationProps = {
  bikeTypesFetched: BikeType[];
  repairerTypesFetched: RepairerType[];
};

const RepairerRegistration: NextPageWithLayout<RepairerRegistrationProps> = ({
  bikeTypesFetched = [],
  repairerTypesFetched = [],
}) => {
  const {password} = useContext(UserFormContext);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<boolean>(false);
  const [emailHelperText, setEmailHelperText] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [city, setCity] = useState<City | null>(null);
  const [street, setStreet] = useState<Street | null>(null);
  const [streetNumber, setStreetNumber] = useState<string>('');
  const [cityInput, setCityInput] = useState<string>('');
  const [citiesList, setCitiesList] = useState<City[]>([]);
  const [repairerTypeSelected, setRepairerTypeSelected] =
    useState<RepairerType | null>(
      repairerTypesFetched.length > 0 ? repairerTypesFetched[0] : null
    );
  const [selectedBikeTypes, setSelectedBikeTypes] = useState<string[]>([]);
  const [comment, setComment] = useState<string>('');
  const [streetList, setStreetList] = useState<Street[]>([]);
  const [bikeTypes, setBikeTypes] = useState<BikeType[]>(bikeTypesFetched);
  const [repairerTypes, setRepairerTypes] =
    useState<RepairerType[]>(repairerTypesFetched);
  const [success, setSuccess] = useState<boolean>(false);
  const [pendingRegistration, setPendingRegistration] =
    useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchRepairerTypes = async () => {
    const responseRepairerTypes = await repairerTypeResource.getAll(false);
    setRepairerTypes(responseRepairerTypes['hydra:member']);
    setRepairerTypeSelected(responseRepairerTypes['hydra:member'][0]);
  };

  useEffect(() => {
    if (repairerTypes.length === 0) {
      fetchRepairerTypes();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
    [setCitiesList]
  );

  useEffect(() => {
    if (cityInput === '' || cityInput.length < 3) {
      setCitiesList([]);
    } else fetchCitiesResult(cityInput);
  }, [setCitiesList, fetchCitiesResult, cityInput]);

  const handleCityChange = async (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): Promise<void> => {
    setCityInput(event.target.value);
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !repairerTypeSelected ||
      !city ||
      selectedBikeTypes.length === 0
    ) {
      return;
    }

    try {
      const selectedBikeTypeIRIs: string[] = bikeTypes
        .filter((bikeType) => selectedBikeTypes.includes(bikeType.name))
        .map((bikeType) => bikeType['@id']);
      setPendingRegistration(true);
      await repairerResource.postRepairerAndUser({
        firstName: firstName,
        lastName: lastName,
        email: email,
        plainPassword: password,
        name: name,
        street: street?.name,
        streetNumber: streetNumber,
        city: city.name,
        postcode: city?.postcode,
        bikeTypesSupported: selectedBikeTypeIRIs,
        repairerType: repairerTypeSelected ? repairerTypeSelected['@id'] : null,
        comment: comment,
        latitude: street?.lat ?? city.lat,
        longitude: street?.lon ?? city.lon,
      });
      setPendingRegistration(false);
      setSuccess(true);
    } catch (e: any) {
      setErrorMessage(e.message?.replace(errorRegex, '$2'));
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
    setPendingRegistration(false);
  };

  const handleChangeFirstName = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setFirstName(event.target.value);
  };

  const handleChangeLastName = (event: ChangeEvent<HTMLInputElement>): void => {
    setLastName(event.target.value);
  };

  const handleChangeName = (event: ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value);
  };

  const handleChangeStreetNumber = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setStreetNumber(event.target.value);
  };

  const handleChangeStreet = async (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): Promise<void> => {
    const adresseSearch = event.target.value;
    if (adresseSearch.length >= 3) {
      const streetApiResponse = await searchStreet(adresseSearch, city);
      setStreetList(streetApiResponse);
    }
  };

  const handleChangeComments = (event: ChangeEvent<HTMLInputElement>): void => {
    setComment(event.target.value);
  };

  const handleChangeEmail = (event: ChangeEvent<HTMLInputElement>): void => {
    setEmail(event.target.value);
    if (!validateEmail(event.target.value)) {
      setEmailError(true);
      setEmailHelperText('Veuillez entrer une adresse email valide.');
    } else {
      setEmailError(false);
      setEmailHelperText('');
    }
  };

  const handleChangeRepairerType = (event: SelectChangeEvent): void => {
    const selectedRepairerType = repairerTypes.find(
      (rt) => rt.name === event.target.value
    );
    setRepairerTypeSelected(selectedRepairerType ? selectedRepairerType : null);
  };

  const handleChangeBikeRepaired = (
    event: SelectChangeEvent<typeof selectedBikeTypes>
  ) => {
    const {
      target: {value},
    } = event;
    setSelectedBikeTypes(typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <>
      <Head>
        <title>Devenir réparateur</title>
      </Head>
      <WebsiteLayout>
        <Box
          bgcolor="lightprimary.light"
          height="100%"
          width="100%"
          position="absolute"
          top="0"
          left="0"
          zIndex="-1"
        />
        <Container>
          {!success && (
            <Box
              py={4}
              display="flex"
              flexDirection={{xs: 'column', md: 'row'}}
              gap={4}
              position="relative"
              alignItems="flex-start">
              <Box
                minHeight={{xs: '0', md: 'calc(100vh - 200px)'}}
                justifyContent="center"
                display="flex"
                flexDirection="column"
                alignItems={{xs: 'center', md: 'flex-start'}}
                textAlign={{xs: 'center', md: 'left'}}
                width={{xs: '100%', md: '45%'}}
                mx="auto"
                maxWidth={{xs: '600px', md: '100%'}}>
                <Typography variant="h1" sx={{mb: 4}} color="primary">
                  Devenir réparateur
                </Typography>
                <Typography variant="body1">
                  Tu es un.e professionnel.le du vélo, dans une association ou
                  un atelier indépendant ?
                  <br />
                  Tu as envie de rejoindre un collectif de pairs sur ton
                  territoire ?<br />
                  Tu cherches un outil numérique qui te référence et qui te
                  permet de gérer tes rendez-vous avec tes usagers ?
                  <br />
                  Tu peux remplir ce formulaire et ton collectif local reviendra
                  vers toi rapidement!
                  <br />
                </Typography>
                <Typography my={2} variant="h4" color="secondary">
                  Inscris-toi !
                </Typography>
                <Box
                  sx={{
                    transform: {
                      xs: 'translateX(-30%)',
                      md: 'translateX(-50%) translateY(20%)',
                      lg: 'translateX(-125%) translateY(20%)',
                    },
                    position: {
                      xs: 'absolute',
                      md: 'static',
                    },
                    left: '0',
                    bottom: '10%',
                  }}>
                  <img alt="" src="/img/flower.svg" width="110px" />
                </Box>
              </Box>
              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{
                  mt: 1,
                  bgcolor: 'white',
                  px: {xs: 3, md: 5},
                  py: {xs: 4, md: 5},
                  boxShadow: 2,
                  width: {xs: '90%', md: '55%'},
                  borderRadius: 6,
                  mx: 'auto',
                  maxWidth: '700px',
                  position: 'relative',
                }}>
                <Box
                  position="absolute"
                  top={{xs: '0', md: '50px'}}
                  left={{xs: '100%', md: '0%'}}
                  width={{xs: '80px', md: '110px'}}
                  sx={{
                    transform: {
                      xs: 'translateY(-80%) translateX(-110%)',
                      md: 'translateX(-85%)',
                    },
                  }}>
                  <LetterR color="secondary" />
                </Box>
                <Grid container spacing={2} direction="column">
                  <Grid container item xs={12} spacing={2} direction="row">
                    <Grid item xs={12} sm={6} md={12} lg={6}>
                      <TextField
                        fullWidth
                        required
                        id="firstName"
                        label="Prénom"
                        name="firstName"
                        autoComplete="firstName"
                        autoFocus
                        value={firstName}
                        inputProps={{maxLength: 50}}
                        onChange={handleChangeFirstName}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={12} lg={6}>
                      <TextField
                        fullWidth
                        required
                        id="lastName"
                        label="Nom"
                        name="lastName"
                        autoComplete="lastName"
                        value={lastName}
                        inputProps={{maxLength: 50}}
                        onChange={handleChangeLastName}
                      />
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      error={emailError}
                      helperText={emailHelperText}
                      type={'email'}
                      id="email"
                      label="Email"
                      name="email"
                      autoComplete="email"
                      value={email}
                      inputProps={{maxLength: 180}}
                      onChange={handleChangeEmail}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <PasswordInput />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      id="name"
                      label="Nom de votre enseigne"
                      name="name"
                      autoComplete="name"
                      value={name}
                      inputProps={{maxLength: 80}}
                      onChange={handleChangeName}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Autocomplete
                      freeSolo
                      value={cityInput}
                      options={citiesList}
                      getOptionLabel={(city) =>
                        typeof city === 'string'
                          ? city
                          : `${city.name} (${city.postcode})`
                      }
                      onChange={(event, value) => setCity(value as City)}
                      onBlur={() => {
                        if (!city) {
                          setCityInput('');
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          label="Ville"
                          required
                          {...params}
                          value={cityInput}
                          onChange={(e: any) => handleCityChange(e)}
                        />
                      )}
                    />
                  </Grid>
                  {city && (
                    <Grid item xs={12}>
                      <Autocomplete
                        freeSolo
                        value={street}
                        options={streetList}
                        getOptionLabel={(streetObject) =>
                          typeof streetObject === 'string'
                            ? streetObject
                            : `${streetObject.name} (${streetObject.city})`
                        }
                        onChange={(event, value) => setStreet(value as Street)}
                        renderInput={(params) => (
                          <TextField
                            label="Rue"
                            {...params}
                            value={street}
                            onChange={(e) => handleChangeStreet(e)}
                          />
                        )}
                      />
                    </Grid>
                  )}
                  {city && (
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        id="streetNumber"
                        label="Numéro de la rue"
                        name="streetNumber"
                        autoComplete="streetNumber"
                        value={streetNumber}
                        inputProps={{maxLength: 30}}
                        onChange={handleChangeStreetNumber}
                      />
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel id="repairer-type-label">
                        Type de réparateur
                      </InputLabel>
                      <Select
                        required
                        id="repairer-type"
                        labelId="repairer-type-label"
                        label="Type de réparateur"
                        onChange={handleChangeRepairerType}
                        value={repairerTypeSelected?.name}
                        style={{width: '100%'}}>
                        {repairerTypes.map((repairer) => (
                          <MenuItem key={repairer.id} value={repairer.name}>
                            {repairer.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel id="bike-type-label">
                        Vélos réparés
                      </InputLabel>
                      <Select
                        required
                        labelId="bike-type-label"
                        label="Vélos réparés"
                        id="bike-type"
                        multiple
                        fullWidth
                        value={selectedBikeTypes}
                        onChange={handleChangeBikeRepaired}
                        renderValue={(selected) => selected.join(', ')}>
                        {bikeTypes.map((bikeType) => (
                          <MenuItem key={bikeType.name} value={bikeType.name}>
                            <Checkbox
                              checked={
                                selectedBikeTypes.indexOf(bikeType.name) > -1
                              }
                            />
                            <ListItemText primary={bikeType.name} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      id="comment"
                      label="Commentaires"
                      name="comment"
                      autoComplete="comment"
                      value={comment}
                      inputProps={{maxLength: 2000}}
                      onChange={handleChangeComments}
                    />
                  </Grid>
                </Grid>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Button
                    disabled={
                      !firstName ||
                      !lastName ||
                      !city ||
                      !repairerTypeSelected ||
                      !name ||
                      !email ||
                      !password ||
                      !selectedBikeTypes.length
                    }
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{mt: 2, mx: 'auto'}}>
                    {!pendingRegistration ? (
                      'Créer mon compte'
                    ) : (
                      <CircularProgress size={20} sx={{color: 'white'}} />
                    )}
                  </Button>
                </Box>
                {errorMessage && (
                  <Typography variant="body1" color="error">
                    {errorMessage}
                  </Typography>
                )}
              </Box>
            </Box>
          )}
          {success && (
            <Paper
              elevation={4}
              sx={{
                maxWidth: 400,
                p: 4,
                mt: 4,
                mb: {xs: 10, md: 12},
                mx: 'auto',
              }}>
              <Box>
                Votre demande d&apos;inscription a bien été enregistrée. Elle
                est désormais en attente de validation et sera rapidement
                traitée.
                <Link href="/" legacyBehavior passHref>
                  <Button variant="outlined" sx={{marginTop: '30px'}}>
                    Retour à l&apos;accueil
                  </Button>
                </Link>
              </Box>
            </Paper>
          )}
        </Container>
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

export default RepairerRegistration;
