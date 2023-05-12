import React from 'react';
import {Repairer} from '@interfaces/Repairer';
import OpeningHoursDetail from "@components/dashboard/agenda/OpeningHoursDetail";
import {Typography} from "@mui/material";
import Box from "@mui/material/Box";

const daysOfWeek = [
    { en: 'monday', fr: 'Lundi' },
    { en: 'tuesday', fr: 'Mardi' },
    { en: 'wednesday', fr: 'Mercredi' },
    { en: 'thursday', fr: 'Jeudi' },
    { en: 'friday', fr: 'Vendredi' },
    { en: 'saturday', fr: 'Samedi' },
    { en: 'sunday', fr: 'Dimanche' },
];

interface OpeningHoursProps {
    repairer: Repairer;
}

export const OpeningHours = ({repairer}: OpeningHoursProps): JSX.Element => {
    return (
        <>
            <Typography variant="h5">
                Plages horaires d&apos;ouverture à la prise de rendez-vous
            </Typography>

            <Box  sx={{marginTop: '40px'}}>
                {daysOfWeek.map(dayObject => {
                    return <Box key={dayObject.en}>
                        <OpeningHoursDetail repairer={repairer} dayOfWeek={dayObject} />
                    </Box>
                })}
            </Box>
        </>
    );
};

export default OpeningHours;
