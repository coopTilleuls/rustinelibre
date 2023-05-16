import React, {useEffect, useState} from "react";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import {CircularProgress} from "@mui/material";
import {appointmentResource} from "@resources/appointmentResource";
import {Appointment} from "@interfaces/Appointment";
import {formatDate} from "@helpers/dateHelper";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import {apiImageUrl} from "@helpers/apiImagesHelper";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HandymanIcon from '@mui/icons-material/Handyman';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

type ModalShowAppointmentProps = {
    id: string;
    openModal: boolean;
    handleCloseModal: (refresh: boolean|undefined) => void;
};

const ModalShowAppointment = ({id, openModal, handleCloseModal}: ModalShowAppointmentProps): JSX.Element => {

    const [loading, setLoading] = useState<boolean>(false);
    const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
    const [appointment, setAppointment] = useState<Appointment|null>(null);

    useEffect(() => {
        fetchAppointment();
    }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

    const fetchAppointment = async () => {
        setLoading(true);
        const appointmentsFetch = await appointmentResource.get(id, true);
        setAppointment(appointmentsFetch);
        setLoading(false)
    }

    const cancelAppointment = async () => {
        if (!appointment) {
            return;
        }

        setLoadingDelete(true);
        await appointmentResource.delete(appointment['@id']);
        setLoadingDelete(false);
        handleCloseModal(true);
    }

    return (
        <Modal
            open={openModal}
            onClose={() => handleCloseModal(false)}
            aria-labelledby="Show appointment"
            aria-describedby="popup_show_appointment"
        >
            <Box sx={style}>
                <Box sx={{ mt: 1 }}>
                    {loading && <CircularProgress />}
                    {!loading && appointment &&
                        <Box>
                            <List>
                                {appointment.autoDiagnostic &&
                                    <ListItem>
                                        <ListItemIcon>
                                            <HandymanIcon />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={appointment.autoDiagnostic.prestation}
                                        />
                                    </ListItem>
                                }
                                <ListItem>
                                    <ListItemIcon>
                                        <AccountCircleIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={`${appointment.customer.firstName} ${appointment.customer.lastName}`}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <CalendarMonthIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={formatDate(appointment.slotTime, true)}
                                    />
                                </ListItem>
                                {appointment.autoDiagnostic && appointment.autoDiagnostic.photo && <img alt="photo de la réparation" src={apiImageUrl(appointment.autoDiagnostic.photo.contentUrl)} />}
                            </List>

                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Button variant="outlined">
                                        Voir le carnet du vélo
                                    </Button>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button variant="outlined">
                                        Envoyer un message
                                    </Button>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button variant="outlined" sx={{color: 'green'}}>
                                        Modifier le rendez vous
                                    </Button>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button variant="outlined" sx={{color: 'red'}} onClick={cancelAppointment}>
                                        {!loadingDelete ? 'Annuler le rendez vous' : <CircularProgress />}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    }
                </Box>
            </Box>
        </Modal>
    )
}

export default ModalShowAppointment;
