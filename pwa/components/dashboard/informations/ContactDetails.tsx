import React, {ChangeEvent, SyntheticEvent, useContext, useEffect, useState} from "react";
import {Repairer} from "@interfaces/Repairer";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Autocomplete from "@mui/material/Autocomplete";
import {RepairerFormContext} from "@contexts/RepairerFormContext";
import {searchCity} from "@utils/apiCity";
import {City, createCitiesWithGouvAPI} from "@interfaces/City";
import {City as GouvCity} from "@interfaces/Gouv";

interface ContactDetailsProps {
    repairer: Repairer|null;
}

export const ContactDetails = ({repairer}: ContactDetailsProps): JSX.Element => {

    const {name, setName, mobilePhone, setMobilePhone,street, setStreet, cityInput, setCityInput, setCity, citiesList, setCitiesList,
        timeoutId, setTimeoutId} = useContext(RepairerFormContext);

    useEffect(() => {
        if (repairer) {
            setName(repairer.name ? repairer.name : '');
            setStreet(repairer.street ? repairer.street :'');
            setCityInput(repairer.city ? repairer.city : '');
        }
    }, [repairer, setName, setStreet, setCityInput]);

    useEffect(() => {
        if (cityInput === '') return;
        if (timeoutId) clearTimeout(timeoutId);
        const newTimeoutId = window.setTimeout(async () => {
            const citiesResponse = await searchCity(cityInput);
            const cities: City[] = createCitiesWithGouvAPI(citiesResponse as GouvCity[]);
            setCitiesList(cities);
        }, 350);

        setTimeoutId(newTimeoutId);
    }, [cityInput, setCitiesList, timeoutId, setTimeoutId]);

    const handleChangeName = (event: ChangeEvent<HTMLInputElement>): void => {
        setName(event.target.value);
    };

    const handleChangeMobilePhone = (event: ChangeEvent<HTMLInputElement>): void => {
        setMobilePhone(event.target.value);
    };

    const handleChangeStreet = (event: ChangeEvent<HTMLInputElement>): void => {
        setStreet(event.target.value);
    };

    const handleCityChange = async (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): Promise<void> => {
        setCityInput(event.target.value);
    };

    const handleCitySelect = (event :  SyntheticEvent<Element, Event>, value: string | null) => {
        const selectedCity = citiesList.find((city) => city.name === value);
        setCity(selectedCity ?? null);
        setCityInput(value ?? '');
    }

    return (
        <>
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
                fullWidth
                id="mobilePhone"
                label="Numéro de téléphone"
                name="name"
                autoComplete="mobilePhone"
                autoFocus
                value={mobilePhone}
                onChange={handleChangeMobilePhone}
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
        </>
    );
};

export default ContactDetails;
