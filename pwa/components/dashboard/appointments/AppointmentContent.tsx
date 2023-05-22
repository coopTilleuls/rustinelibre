import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import {CircularProgress} from "@mui/material";
import {appointmentResource} from "@resources/appointmentResource";
import {Appointment} from "@interfaces/Appointment";
import {formatDate, isPast} from "@helpers/dateHelper";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import {apiImageUrl} from "@helpers/apiImagesHelper";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HandymanIcon from '@mui/icons-material/Handyman';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Link from "next/link";
import App from "next/app";
import Typography from "@mui/material/Typography";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import BuildIcon from "@mui/icons-material/Build";

type AppointmentContentProps = {
    appointment: Appointment;
    handleCloseModal: (refresh: boolean|undefined) => void
};

const AppointmentContent = ({appointment, handleCloseModal}: AppointmentContentProps): JSX.Element => {

    const [loadingDelete, setLoadingDelete] = useState<boolean>(false);

    const cancelAppointment = async () => {
        if (!appointment) {
            return;
        }

        setLoadingDelete(true);
        await appointmentResource.patch(appointment['@id'], {
            'accepted': false
        });
        setLoadingDelete(false);
        handleCloseModal(true);
    }

    return (
        <Box>
            <Typography id="modal-modal-title" fontSize={20} fontWeight={600}>
                Rendez vous : {`${appointment.customer.firstName} ${appointment.customer.lastName}`}
            </Typography>
            <List>
                <ListItem>
                    <ListItemIcon>
                        <CalendarMonthIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary={formatDate(appointment.slotTime)}
                    />
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <AlternateEmailIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary={appointment.customer.email}
                    />
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <CheckCircleOutlineIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary={appointment.accepted === undefined
                            ? 'En attente'
                            : appointment.accepted
                                ? 'Rendez vous accepté'
                                : 'Rendez vous refusé'
                        }
                    />
                </ListItem>
                {appointment.autoDiagnostic &&
                    <ListItem>
                        <ListItemIcon>
                            <BuildIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary={appointment.autoDiagnostic.prestation}
                        />
                    </ListItem>
                }
                {appointment.autoDiagnostic && appointment.autoDiagnostic.photo &&
                    <img style={{marginTop: '20px', textAlign:'center'}} width="300" src={apiImageUrl(appointment.autoDiagnostic.photo.contentUrl)} alt="Photo autodiag" />
                }
            </List>

            <Grid container spacing={2}>
                <Grid item xs={6}>
                    {appointment.bike ?
                        <Link href={`/dashboard/clients/velos/${appointment.bike.id}`}>
                            <Button variant="outlined">
                                Voir le carnet du vélo
                            </Button>
                        </Link> : <Button disabled variant="outlined">
                            Voir le carnet du vélo
                        </Button>}
                </Grid>
                <Grid item xs={6}>
                    <Button variant="outlined">
                        Envoyer un message
                    </Button>
                </Grid>

                <Grid item xs={6}>
                    {isPast(appointment.slotTime) ?
                        <Button disabled variant="outlined">
                            Modifier le rendez vous
                        </Button> :
                        <Button variant="outlined" sx={{color: 'green'}}>
                            Modifier le rendez vous
                        </Button>
                    }
                </Grid>
                <Grid item xs={6}>
                    {isPast(appointment.slotTime) ?
                        <Button variant="outlined" disabled>
                            Annuler le rendez vous
                        </Button>:
                        <Button variant="outlined" sx={{color: 'red'}} onClick={cancelAppointment}>
                            {!loadingDelete ? 'Annuler le rendez vous' : <CircularProgress />}
                        </Button>
                    }
                </Grid>
            </Grid>
        </Box>
    )
}

export default AppointmentContent;
