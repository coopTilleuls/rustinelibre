import {NextPageWithLayout} from 'pages/_app';
import React, {useState, ChangeEvent, useEffect, SyntheticEvent} from 'react';
import Head from "next/head";
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {useRouter} from 'next/router';
import {CircularProgress} from "@mui/material";
import {repairerResource} from '@resources/repairerResource';
import BuildIcon from '@mui/icons-material/Build';
import {searchCity} from "@utils/apiCity";
import {City, createCitiesWithGouvAPI, createCitiesWithNominatimAPI} from "@interfaces/City";
import {City as NominatimCity} from '@interfaces/Nominatim';
import {City as GouvCity} from '@interfaces/Gouv';
import Autocomplete from '@mui/material/Autocomplete';
import InputLabel from "@mui/material/InputLabel";
import useRepairerTypes from "@hooks/useRepairerTypes";
import {RepairerType} from "@interfaces/RepairerType";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import useBikeTypes from "@hooks/useBikeTypes";
import OutlinedInput from '@mui/material/OutlinedInput';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import {validateEmail} from '@utils/emailValidator';
import {validatePassword} from '@utils/passwordValidator';
import {BikeType} from "@interfaces/BikeType";
import WebsiteLayout from "@components/layout/WebsiteLayout";

const RepairerRegistration: NextPageWithLayout = ({}) => {

    const useNominatim = process.env.NEXT_PUBLIC_USE_NOMINATIM !== 'false';
    const [name, setName] = useState<string>('');
    const [street, setStreet] = useState<string>('');
    const [cityInput, setCityInput] = useState<string>('');
    const [city, setCity] = useState<City | null>(null);
    const [citiesList, setCitiesList] = useState<City[]>([]);
    const [timeoutId, setTimeoutId] = useState<number | null>(null);
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [comment, setComment] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [emailError, setEmailError] = useState<boolean>(false);
    const [passwordError, setPasswordError] = useState<boolean>(false);
    const [emailHelperText, setEmailHelperText] = useState<string>('');
    const [passwordInfo, setPasswordInfo] = useState<string>('');
    const [repairerTypeSelected, setRepairerTypeSelected] = useState<RepairerType|null>(null);
    const [pendingRegistration, setPendingRegistration] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [selectedBikeTypes, setSelectedBikeTypes] = useState<string[]>([]);
    const router = useRouter();
    const repairerTypes: RepairerType[] = useRepairerTypes();
    const bikeTypes: BikeType[] = useBikeTypes();

    useEffect(() => {
        if (cityInput === '') return;
        if (timeoutId) clearTimeout(timeoutId);
        const newTimeoutId = window.setTimeout(async () => {
            const citiesResponse = await searchCity(cityInput, useNominatim);
            const cities: City[] = useNominatim ? createCitiesWithNominatimAPI(citiesResponse as NominatimCity[]) : createCitiesWithGouvAPI(citiesResponse as GouvCity[]);
            setCitiesList(cities);
        }, 350);

        setTimeoutId(newTimeoutId);
    }, [cityInput]);

    const handleCityChange = async (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): Promise<void> => {
        setCityInput(event.target.value);
    };

    const handleCitySelect = (event :  SyntheticEvent<Element, Event>, value: string | null) => {
        const selectedCity = citiesList.find((city) => city.name === value);
        setCity(selectedCity ?? null);
        setCityInput(value ?? '');
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {

        event.preventDefault();
        if (!firstName || !lastName || !email || !password || !repairerTypeSelected || !street || !city || Object.keys(selectedBikeTypes).length === 0) {
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
                'firstName': firstName,
                'lastName': lastName,
                'email': email,
                'plainPassword': password,
                'name': name,
                'street': street,
                'city': city.name,
                'postcode': city?.postcode,
                'bikeTypesSupported': selectedBikeTypeIRIs,
                'repairerType': repairerTypeSelected ? repairerTypeSelected['@id'] : null,
                'comment': comment
            })

            if (newRepairer) {
                await router.push('/');
            }
        } catch (e) {
            setErrorMessage('Inscription impossible');
        }

        setPendingRegistration(false);
    };

    const handleChangeFirstName = (event: ChangeEvent<HTMLInputElement>): void => {
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
            setPasswordInfo('Votre mot de passe doit contenir 12 caractères, une majuscule, un caractères et des chiffres.');
        } else {
            setPasswordError(false);
            setPasswordInfo('');
        }
    };

    const handleChangeRepairerType = (event: SelectChangeEvent): void => {

        const selectedRepairerType = repairerTypes.find((rt) => rt.name === event.target.value);
        setRepairerTypeSelected(selectedRepairerType ? selectedRepairerType : null);
    };

    const handleChangeBikeRepaired = (event: SelectChangeEvent<typeof selectedBikeTypes>) => {
        const {target: { value },} = event;
        setSelectedBikeTypes(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    return (
        <>
            <div style={{width: "100vw", overflowX: "hidden"}}>
                <Head>
                    <title>Inscription</title>
                </Head>
                <WebsiteLayout/>
                <div style={{width: "100vw", marginBottom: '100px'}}>
                    <Container component="main" maxWidth="xs">
                        <CssBaseline />
                        <Box
                            sx={{
                                marginTop: 8,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                                <BuildIcon />
                            </Avatar>
                            <Typography component="h1" variant="h5">
                                Tu es réparateur
                            </Typography>
                            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
                                    label="Password"
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
                                <InputLabel htmlFor="city">Ville</InputLabel>
                                <Autocomplete
                                    freeSolo
                                    value={cityInput}
                                    options={citiesList.map((optionCity) => optionCity.name)}
                                    onChange={(event, values) => handleCitySelect(event, values)}
                                    renderInput={(params) =>
                                        <TextField
                                            {...params}
                                            value={cityInput}
                                            onChange={(e) => handleCityChange(e)}
                                        />
                                    }
                                />
                                <InputLabel htmlFor="bikeType">Type de réparateur</InputLabel>
                                <Select
                                    required
                                    label="Choisissez votre type d'enseigne"
                                    onChange={handleChangeRepairerType}
                                    value={repairerTypeSelected?.name}
                                    style={{width: '100%'}}
                                >
                                    {repairerTypes.map((repairer) => (
                                        <MenuItem key={repairer.id} value={repairer.name}>{repairer.name}</MenuItem>
                                    ))}
                                </Select>

                                <InputLabel id="demo-multiple-checkbox-label">Vélos réparés</InputLabel>
                                <Select
                                    labelId="multiple_bikes_repaired"
                                    id="multiple_bikes_repaired"
                                    multiple
                                    fullWidth
                                    value={selectedBikeTypes}
                                    onChange={handleChangeBikeRepaired}
                                    input={<OutlinedInput label="Type de vélos" />}
                                    renderValue={(selected) => selected.join(', ')}
                                >
                                    {bikeTypes.map((bikeType) => (
                                        <MenuItem key={bikeType.name} value={bikeType.name}>
                                            <Checkbox checked={selectedBikeTypes.indexOf(bikeType.name) > -1} />
                                            <ListItemText primary={bikeType.name} />
                                        </MenuItem>
                                    ))}
                                </Select>
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
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="outlined"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    {!pendingRegistration ? 'Créer mon compte' : <CircularProgress size={20} />}
                                </Button>
                                {errorMessage && (
                                    <Typography variant="body1" color="error">
                                        {errorMessage}
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    </Container>
                </div>
            </div>
        </>
    );
};

export default RepairerRegistration;
