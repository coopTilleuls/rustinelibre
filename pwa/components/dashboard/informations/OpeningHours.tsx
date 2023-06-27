import React, {useContext, useEffect} from 'react';
import dynamic from 'next/dynamic';
import {RepairerFormContext} from '@contexts/RepairerFormContext';
import {Repairer} from '@interfaces/Repairer';
import {Alert, Box, Button, CircularProgress, InputLabel, Typography} from "@mui/material";
import {RequestBody} from "@interfaces/Resource";
const Editor = dynamic(() => import('@components/form/Editor'), {
    ssr: false,
});

interface OpeningHoursProps {
    repairer: Repairer | null;
    updateRepairer: (iri : string, body : RequestBody) => Promise<void>;
}

export const OpeningHours = ({repairer, updateRepairer}: OpeningHoursProps): JSX.Element => {
    const {
        openingHours,
        pendingRegistration,
        errorMessage,
        success,
        setOpeningHours,
    } = useContext(RepairerFormContext);

    useEffect(() => {
        if (repairer) {
            setOpeningHours(repairer.openingHours ?? '');
        }
    }, [repairer, setOpeningHours]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        if (!repairer) return;
        const requestBody: RequestBody = {};

        if (openingHours) requestBody['openingHours'] = openingHours;

        await updateRepairer(repairer['@id'], requestBody)
    };

    return (
        <Box sx={{marginTop: 3}} component="form" onSubmit={handleSubmit}>
            {repairer && (
                <>
                    <InputLabel sx={{mb: -2, ml: 1}}>Horaires d&apos;ouverture</InputLabel>
                    <Editor content={openingHours} setContent={setOpeningHours} />
                    <Button type="submit" variant="contained" sx={{my: 2}}>
                        {!pendingRegistration ? (
                            'Enregistrer mes informations'
                        ) : (
                            <CircularProgress size={20} sx={{color: 'white'}} />
                        )}
                    </Button>

                    {errorMessage && (
                        <Typography variant="body1" color="error">
                            {errorMessage}
                        </Typography>
                    )}

                    {success && (
                        <Alert severity="success">
                            Informations mises à jour
                        </Alert>
                    )}
                </>
            )}
        </Box>
    );
};

export default OpeningHours;
