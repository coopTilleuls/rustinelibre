import React, {useEffect, useState} from 'react';
import {Repairer} from '@interfaces/Repairer';
import {RepairerOpeningHours} from "@interfaces/RepairerOpeningHours";
import {openingHoursResource} from "@resources/openingHours";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import {Button, CircularProgress} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import ModalAddOpeningHours from "@components/dashboard/agenda/ModalAddOpeningHours";

interface OpeningHoursDetailProps {
    repairer: Repairer;
    dayOfWeek: { en: string, fr: string };
}

export const OpeningHoursDetail = ({repairer, dayOfWeek}: OpeningHoursDetailProps): JSX.Element => {

    const [loading, setLoading] = useState<boolean>(true);
    const [openingHours, setOpeningHours] = useState<RepairerOpeningHours[]>([]);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const handleOpenModal = (): void => setOpenModal(true);
    const handleCloseModal = (refresh = true): void => {
        setOpenModal(false);
        if (refresh) {
            fetchOpeningHours();
        }
    };

    const fetchOpeningHours = async () => {
        setLoading(true);
        const openingHoursFetch = await openingHoursResource.getAll(true, {
            repairer: repairer.id,
            day: dayOfWeek.en
        });
        setOpeningHours(openingHoursFetch['hydra:member']);
        setLoading(false);
    }


    useEffect(() => {
        fetchOpeningHours();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const removeOpeningHour = async (openingHourIri: string) => {
        setLoading(true);
        await openingHoursResource.delete(openingHourIri);
        await fetchOpeningHours();
    }

    return (
        <>
            <Box sx={{marginBottom: '40px'}}>
                <Grid container spacing={2}>
                    <Grid item xs={2}>
                        {dayOfWeek.fr}
                    </Grid>
                    <Grid item xs={8}>
                        {loading && <CircularProgress />}
                        {!loading && openingHours.length > 0 && <Box>
                            {openingHours.map(openingTimes => {
                                    return <Box key={openingTimes.id} sx={{marginBottom: '20px'}}>
                                        {openingTimes.startTime} - {openingTimes.endTime}
                                        <Button sx={{float:'right'}} variant="outlined" onClick={() => removeOpeningHour(openingTimes['@id'])}>
                                            Supprimer
                                        </Button>
                                    </Box>
                                })}
                            {openingHours.length < 2 && <Box onClick={handleOpenModal} sx={{color: '#1876d2', cursor: 'pointer'}}><AddIcon sx={{marginTop: '25px'}} /> Ajouter une plage horaire</Box>}
                        </Box>
                        }

                        {!loading && openingHours.length === 0 &&
                            <Box sx={{marginBottom: '30px'}}>
                                {`Aucun horaire d'ouverture ce jour`} <Button sx={{float:'right'}} variant="outlined" onClick={handleOpenModal}>Ajouter une plage horaire</Button>
                            </Box>
                        }
                    </Grid>
                </Grid>
            </Box>
            <hr/>

            <ModalAddOpeningHours
                day={dayOfWeek.en}
                openModal={openModal}
                handleCloseModal={handleCloseModal}
            />
        </>
    );
};

export default OpeningHoursDetail;
