import React, {useEffect, useState} from 'react';
import {Repairer} from '@interfaces/Repairer';
import OpeningHoursDetail from "@components/dashboard/agenda/OpeningHoursDetail";
import {Alert, Button, CircularProgress, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import {openingHoursResource} from "@resources/openingHours";
import {repairerResource} from "@resources/repairerResource";

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

    const [loading, setLoading] = useState< boolean>(false);
    const [duration, setDuration] = useState<number>(repairer.durationSlot ? repairer.durationSlot : 60);
    const [numberOfSlots, setNumberOfSlots] = useState<number>(repairer.numberOfSlots ? repairer.numberOfSlots : 1);
    const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);

    const handleChangeDuration = (event: SelectChangeEvent) => {
        setDuration(parseInt(event.target.value));
    };

    const handleChangeNumberOfSlots = (event: SelectChangeEvent) => {
        setNumberOfSlots(parseInt(event.target.value));
    };

    const updateRepaireSlots = async () => {
        setLoading(true);
        await repairerResource.put(repairer['@id'], {
            'durationSlot': duration,
            'numberOfSlots': numberOfSlots,
        });
        setUpdateSuccess(true);
        setTimeout(() => {
            setUpdateSuccess(false);
        }, 3000);
        setLoading(false);
    }

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


            <Box  sx={{marginTop: '80px'}}>
                <Typography variant="h5">
                    Gestion des créneaux horaires
                </Typography>

                <FormControl sx={{marginTop: '20px', width: '40%'}}>
                    <InputLabel id="demo-simple-select-label">Unité des créneaux</InputLabel>
                    <Select
                        id="select_duration_slot"
                        value={duration.toString()}
                        label="Unité des créneaux"
                        onChange={handleChangeDuration}
                    >
                        <MenuItem value={30}>1/2 heure</MenuItem>
                        <MenuItem value={60}>1 heure</MenuItem>
                        <MenuItem value={180}>3 heures</MenuItem>
                    </Select>
                </FormControl>

                <FormControl sx={{marginTop: '20px', marginLeft: '5%', width: '40%', paddingBottom: '20px'}}>
                    <InputLabel id="demo-simple-select-label">Nombre de RDV accepté par créneau</InputLabel>
                    <Select
                        id="select_number_slots"
                        value={numberOfSlots.toString()}
                        label="Nombre de RDV accepté par créneau"
                        onChange={handleChangeNumberOfSlots}
                    >
                        <MenuItem value={1}>1</MenuItem>
                        <MenuItem value={2}>2</MenuItem>
                        <MenuItem value={3}>3</MenuItem>
                        <MenuItem value={4}>4</MenuItem>
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={6}>6</MenuItem>
                        <MenuItem value={7}>7</MenuItem>
                        <MenuItem value={8}>8</MenuItem>
                        <MenuItem value={9}>9</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                    </Select>
                </FormControl>

                <Button variant="outlined" onClick={updateRepaireSlots} sx={{marginTop: '20px', width: '80%'}}>
                    {!loading ? 'Mettre à jour' : <CircularProgress />}
                </Button>

                {updateSuccess && <Alert sx={{marginTop: '10px'}} severity="success">Créneaux mis à jour</Alert>}
            </Box>
        </>
    );
};

export default OpeningHours;
