import React, {useEffect, useState} from 'react';
import {Repairer} from '@interfaces/Repairer';
import OpeningHoursDetail from "@components/dashboard/agenda/OpeningHoursDetail";
import {Button, CircularProgress, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import {RepairerOpeningHours} from "@interfaces/RepairerOpeningHours";
import {RepairerExceptionalClosure} from "@interfaces/RepairerExceptionalClosure";
import {exceptionalClosureResource} from "@resources/exceptionalClosingResource";
import Grid from "@mui/material/Grid";
import AddIcon from "@mui/icons-material/Add";
import {formatDate} from "@helpers/dateHelper";
import ModalAddOpeningHours from "@components/dashboard/agenda/ModalAddOpeningHours";
import ModalAddExceptionalClosure from "@components/dashboard/agenda/ModalAddExceptionalClosure";


interface ExceptionalClosureProps {
    repairer: Repairer;
}

export const ExceptionalClosure = ({repairer}: ExceptionalClosureProps): JSX.Element => {

    const [loading, setLoading] = useState<boolean>(true);
    const [exceptionalClosures, setExceptionalClosures] = useState<RepairerExceptionalClosure[]>([]);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const handleOpenModal = (): void => setOpenModal(true);
    const handleCloseModal = (refresh = true): void => {
        setOpenModal(false);
        if (refresh) {
            fetchClosure();
        }
    };

    const fetchClosure = async () => {
        setLoading(true);
        const exceptionalClosuresFetch = await exceptionalClosureResource.getAll(true, {
            repairer: repairer.id,
        });
        setExceptionalClosures(exceptionalClosuresFetch['hydra:member']);
        setLoading(false);
    }

    useEffect(() => {
        fetchClosure();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const removeExceptionalClosure = async (exceptionalClosureIri: string) => {
        setLoading(true);
        await exceptionalClosureResource.delete(exceptionalClosureIri);
        await fetchClosure();
    }

    return (
        <>
            <Typography variant="h5">
                Programmation d&apos;une fermeture exceptionelle
            </Typography>

            <Box  sx={{marginTop: '40px'}}>
                {loading && <CircularProgress />}
                {!loading && exceptionalClosures.map(exceptionalClosure => {
                    return <Box sx={{marginBottom: '40px'}} key={exceptionalClosure.id}>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    {loading && <CircularProgress />}

                                    {formatDate(exceptionalClosure.startDate, false)} - {formatDate(exceptionalClosure.endDate, false)}
                                    <Button sx={{float:'right'}} variant="outlined" onClick={() => removeExceptionalClosure(exceptionalClosure['@id'])}>
                                        Supprimer
                                    </Button>
                                </Grid>
                            </Grid>
                            <hr/>
                        </Box>
                })}

                {!loading && exceptionalClosures.length === 0 &&
                    <Box sx={{marginBottom: '30px'}}>
                        {`Aucune fermeture exceptionnelle programmée`}
                    </Box>
                }

                <br />
                <Button variant="outlined" onClick={handleOpenModal}>Ajouter une plage horaire</Button>
            </Box>

            <ModalAddExceptionalClosure
                openModal={openModal}
                handleCloseModal={handleCloseModal}
            />
        </>
    );
};

export default ExceptionalClosure;
