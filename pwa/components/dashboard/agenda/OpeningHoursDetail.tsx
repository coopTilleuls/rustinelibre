import React, {useEffect, useState} from 'react';
import {Repairer} from '@interfaces/Repairer';
import {RepairerOpeningHours} from "@interfaces/RepairerOpeningHours";
import {openingHoursResource} from "@resources/openingHours";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import {Button, Chip, CircularProgress, Divider, Tooltip} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import ModalAddOpeningHours from "@components/dashboard/agenda/ModalAddOpeningHours";
import DeleteIcon from "@mui/icons-material/Delete";

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
            <Box sx={{marginBottom: '20px'}}>
                <Grid container spacing={2}>
                    <Grid item xs={2}>
                        {dayOfWeek.fr}
                    </Grid>
                    <Grid item xs={8}>
                        {loading && <CircularProgress />}
                        {!loading && openingHours.length > 0 && <Box>
                            {openingHours.map(openingTimes => {
                                    return <Box key={openingTimes.id} sx={{marginBottom: '20px'}}>
                                        <Chip
                                            label={`${openingTimes.startTime} - ${openingTimes.endTime}`}
                                            deleteIcon={<DeleteIcon />}
                                            onDelete={() => removeOpeningHour(openingTimes['@id'])}
                                        />
                                    </Box>
                                })}
                            {openingHours.length < 2 && <Button sx={{float:'left'}} variant="outlined" onClick={handleOpenModal}>Ajouter une plage horaire</Button>}
                        </Box>
                        }

                        {!loading && openingHours.length === 0 && <Box>
                            <Box sx={{marginBottom: '30px'}}>
                                {`Aucun horaire d'ouverture ce jour`}
                            </Box>
                            <Button sx={{float:'left'}} variant="outlined" onClick={handleOpenModal}>Ajouter une plage horaire</Button>
                        </Box>
                        }
                    </Grid>
                </Grid>
            </Box>
            <Divider sx={{marginBottom: '20px'}}/>

            <ModalAddOpeningHours
                day={dayOfWeek.en}
                openModal={openModal}
                handleCloseModal={handleCloseModal}
            />
        </>
    );
};

export default OpeningHoursDetail;
