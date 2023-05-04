import {NextPageWithLayout} from 'pages/_app';
import {ENTRYPOINT} from '@config/entrypoint';
import React, {
  useState,
  ChangeEvent,
  useEffect,
  SyntheticEvent,
  useContext,
} from 'react';
import {GetStaticProps} from 'next';
import Head from 'next/head';
import {useRouter} from 'next/router';
import {
  Avatar,
  Box,
  Container,
  OutlinedInput,
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
} from '@mui/material';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import BuildIcon from '@mui/icons-material/Build';
import WebsiteLayout from '@components/layout/WebsiteLayout';
import {RepairerFormContext} from '@contexts/RepairerFormContext';
import {UserFormContext} from '@contexts/UserFormContext';
import {bikeTypeResource} from '@resources/bikeTypeResource';
import {repairerTypeResource} from '@resources/repairerTypeResource';
import {repairerResource} from '@resources/repairerResource';
import {BikeType} from '@interfaces/BikeType';
import {
  City,
  createCitiesWithGouvAPI,
  createCitiesWithNominatimAPI,
} from '@interfaces/City';
import {City as NominatimCity} from '@interfaces/Nominatim';
import {City as GouvCity} from '@interfaces/Gouv';
import {RepairerType} from '@interfaces/RepairerType';
import {validateEmail} from '@utils/emailValidator';
import {validatePassword} from '@utils/passwordValidator';
import {searchCity} from '@utils/apiCity';

type RepairerRegistrationProps = {
  bikeTypesFetched: BikeType[];
  repairerTypesFetched: RepairerType[];
};

const RepairerRegistration: NextPageWithLayout<RepairerRegistrationProps> = ({
     bikeTypesFetched = [],
     repairerTypesFetched = [],
}) => {
  const useNominatim = process.env.NEXT_PUBLIC_USE_NOMINATIM !== 'false';
  const [comment, setComment] = useState<string>('');
  const [bikeTypes, setBikeTypes] = useState<BikeType[]>(bikeTypesFetched);
  const [repairerTypes, setRepairerTypes] = useState<RepairerType[]>(repairerTypesFetched);
  const [repairerTypeSelected, setRepairerTypeSelected] = useState<RepairerType | null>(null);
  const router = useRouter();

  const {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    password,
    passwordError,
    setPasswordError,
    setPassword,
    emailError,
    setEmailError,
    emailHelperText,
    setEmailHelperText,
    passwordInfo,
    setPasswordInfo,
  } = useContext(UserFormContext);

  const {
    name,
    setName,
    street,
    setStreet,
    cityInput,
    setCityInput,
    city,
    setCity,
    citiesList,
    setCitiesList,
    timeoutId,
    setTimeoutId,
    pendingRegistration,
    setPendingRegistration,
    errorMessage,
    setErrorMessage,
    selectedBikeTypes,
    setSelectedBikeTypes,
  } = useContext(RepairerFormContext);

  async function fetchRepairerTypes() {
    const responseRepairerTypes = await repairerTypeResource.getAll(false);
    setRepairerTypes(responseRepairerTypes['hydra:member']);
  }

  useEffect(() => {
    if (repairerTypes.length === 0) {
      fetchRepairerTypes();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchBikeTypes() {
    const responseBikeTypes = await bikeTypeResource.getAll(false);
    setBikeTypes(responseBikeTypes['hydra:member']);
  }

  useEffect(() => {
    if (bikeTypes.length === 0) {
      fetchBikeTypes();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (cityInput === '') return;
    if (timeoutId) clearTimeout(timeoutId);
    const newTimeoutId = window.setTimeout(async () => {
      const citiesResponse = await searchCity(cityInput, useNominatim);
      const cities: City[] = useNominatim
        ? createCitiesWithNominatimAPI(citiesResponse as NominatimCity[])
        : createCitiesWithGouvAPI(citiesResponse as GouvCity[]);
      setCitiesList(cities);
    }, 350);

    setTimeoutId(newTimeoutId);
  }, [cityInput, timeoutId, useNominatim, setCitiesList, setTimeoutId]);

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
      !street ||
      !city ||
      Object.keys(selectedBikeTypes).length === 0
    ) {
      return;
    }

    setErrorMessage(null);
    setPendingRegistration(true);

    // Create a new repairer and an user
    let newRepairer;
    try {
      const selectedBikeTypeIRIs: string[] = bikeTypes
        .filter((bikeType) => selectedBikeTypes.includes(bikeType.name))
        .map((bikeType) => bikeType['@id']);

      newRepairer = await repairerResource.postRepairerAndUser({
        firstName: firstName,
        lastName: lastName,
        email: email,
        plainPassword: password,
        name: name,
        street: street,
        city: city.name,
        postcode: city?.postcode,
        bikeTypesSupported: selectedBikeTypeIRIs,
        repairerType: repairerTypeSelected ? repairerTypeSelected['@id'] : null,
        comment: comment,
      });

      if (newRepairer) {
        router.push('/');
      }
    } catch (e) {
      setErrorMessage('Inscription impossible');
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

  const handleChangeStreet = (event: ChangeEvent<HTMLInputElement>): void => {
    setStreet(event.target.value);
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

  const handleChangePassword = (event: ChangeEvent<HTMLInputElement>): void => {
    setPassword(event.target.value);
    if (!validatePassword(event.target.value)) {
      setPasswordError(true);
      setPasswordInfo(
        'Votre mot de passe doit contenir 12 caractères, une majuscule, un caractères et des chiffres.'
      );
    } else {
      setPasswordError(false);
      setPasswordInfo('');
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
        <title>Inscription</title>
      </Head>
      <WebsiteLayout />
      <Container sx={{width: {xs: '100%', md: '50%'}}}>
        <Paper
          elevation={4}
          sx={{maxWidth: 400, p: 4, mt: 4, mb: {xs: 10, md: 12}, mx: 'auto'}}>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Avatar sx={{m: 1, backgroundColor: 'primary.main'}}>
              <BuildIcon />
            </Avatar>
            <Typography fontSize={{xs: 28, md: 30}} fontWeight={600}>
              Tu es réparateur
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{mt: 1}}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="firstName"
                label="Prénom"
                name="firstName"
                autoComplete="firstName"
                autoFocus
                value={firstName}
                onChange={handleChangeFirstName}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="lastName"
                label="Nom"
                name="lastName"
                autoComplete="lastName"
                autoFocus
                value={lastName}
                onChange={handleChangeLastName}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                error={emailError}
                helperText={emailHelperText}
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={handleChangeEmail}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                error={passwordError}
                helperText={passwordInfo}
                name="password"
                label="Mot de passe"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={handleChangePassword}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Nom de votre enseigne"
                name="name"
                autoComplete="name"
                autoFocus
                value={name}
                onChange={handleChangeName}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="street"
                label="Numéro et rue"
                name="street"
                autoComplete="street"
                autoFocus
                value={street}
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
                    label="Ville"
                    required
                    {...params}
                    value={cityInput}
                    onChange={(e) => handleCityChange(e)}
                  />
                )}
              />
              <FormControl fullWidth required sx={{mt: 2, mb: 1}}>
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
              <FormControl fullWidth required sx={{mt: 2, mb: 1}}>
                <InputLabel id="bike-type-label">Vélos réparés</InputLabel>
                <Select
                  required
                  labelId="bike-type-label"
                  id="bike-type"
                  multiple
                  fullWidth
                  value={selectedBikeTypes}
                  onChange={handleChangeBikeRepaired}
                  input={<OutlinedInput label="Type de vélos" />}
                  renderValue={(selected) => selected.join(', ')}>
                  {bikeTypes.map((bikeType) => (
                    <MenuItem key={bikeType.name} value={bikeType.name}>
                      <Checkbox
                        checked={selectedBikeTypes.indexOf(bikeType.name) > -1}
                      />
                      <ListItemText primary={bikeType.name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                multiline
                rows={3}
                margin="normal"
                fullWidth
                id="comment"
                label="Commentaires"
                name="comment"
                autoComplete="comment"
                autoFocus
                value={comment}
                onChange={handleChangeComments}
              />
              <Box display="flex" flexDirection="column" alignItems="center">
                <Button
                  type="submit"
                  variant="contained"
                  sx={{mt: 2, mx: 'auto'}}>
                  {!pendingRegistration ? (
                    'Créer mon compte'
                  ) : (
                    <CircularProgress size={20} />
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
        </Paper>
      </Container>
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
