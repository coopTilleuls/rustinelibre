import React, {useState, useEffect, useContext, ChangeEvent} from 'react';
import Box from '@mui/material/Box';
import {Alert, Button, CircularProgress, Container, Link, Paper, TextField, Typography} from '@mui/material';
import {BikeType} from "@interfaces/BikeType";
import {bikeTypeResource} from "@resources/bikeTypeResource";
import {useRouter} from "next/router";

type BikeTypeFormProps = {
    bikeType: BikeType|null;
};

const BikeTypeForm = ({bikeType}: BikeTypeFormProps): JSX.Element => {

    const router = useRouter();
    const [name, setName] = useState<string>('');
    const [pending, setPending] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        if (bikeType) {
            setName(bikeType.name)
        }
    }, [bikeType]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage(null);
        setPending(true);

        try {
            if (bikeType) {
                await bikeTypeResource.put(bikeType['@id'], {
                    'name': name
                })
                setSuccess(true);
                setTimeout(() => {setSuccess(false)}, 3000);
            } else {
                await bikeTypeResource.post({
                    'name': name
                })
                router.push('/admin/parametres')
            }
        } catch {

        }

        setPending(false);
    };

    const handleChangeName = (event: ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    return (
            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{mt: 1}}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Nom"
                    name="name"
                    autoComplete="name"
                    autoFocus
                    value={name}
                    inputProps={{ maxLength: 180 }}
                    onChange={handleChangeName}
                />

                <Box display="flex" flexDirection="column" alignItems="center">
                    <Button type="submit" variant="contained" sx={{my: 2}}>
                        {pending && <CircularProgress sx={{color: 'white'}} />}
                        {!pending && bikeType && 'Modifier le nom'}
                        {!pending && !bikeType && 'Ajouter ce type de vélo'}
                    </Button>
                    {errorMessage && (
                        <Typography variant="body1" color="error">
                            {errorMessage}
                        </Typography>
                    )}
                </Box>

                {success && <Alert sx={{marginTop: '10px'}} severity="success">Vélo mis à jour</Alert>}
            </Box>
    );
};

export default BikeTypeForm;
