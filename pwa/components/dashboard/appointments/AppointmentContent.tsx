import React, {useEffect, useState} from "react";
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
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Link from "next/link";
import Typography from "@mui/material/Typography";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import {getAppointmentStatus} from "@helpers/appointmentStatus";
import {openingHoursResource} from "@resources/openingHours";
import useMediaQuery from "@hooks/useMediaQuery";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import {maintenanceResource} from "@resources/MaintenanceResource";
import {Bike} from "@interfaces/Bike";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import {Discussion} from "@interfaces/Discussion";
import {discussionResource} from "@resources/discussionResource";

type AppointmentContentProps = {
    appointment: Appointment;
    handleCloseModal: (refresh: boolean|undefined) => void
};

const AppointmentContent = ({appointment, handleCloseModal}: AppointmentContentProps): JSX.Element => {

    const [pendingValid, setPendingValid] = useState<boolean>(false);
    const [pendingRefuse, setPendingRefuse] = useState<boolean>(false);
    const [loadingNewSlot, setLoadingNewSlot] = useState<boolean>(false);
    const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
    const [proposeOtherSlot, setProposeOtherSlot] = useState<boolean>(false);
    const [slotsAvailable, setSlotsAvailable] = useState<any>(null);
    const isMobile = useMediaQuery('(max-width: 640px)');
    const [dates, setDates] = useState<string[]>([]);
    const [times, setTimes] = useState<string[]>([]);
    const [selectedDate, setSelectedDate] = useState<string|undefined>(undefined);
    const [selectedTime, setSelectedTime] = useState<string|undefined>('');
    const [bikes, setBikes] = useState<number>(0);
    const [discussion, setDiscussion] = useState<Discussion|null>(null);

    useEffect(() => {
        if (appointment.bike) {
            fetchMaintenances(appointment.bike);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        getOrCreateDiscussion();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const fetchMaintenances = async(bike: Bike) => {
        const maintenancesFetch = await maintenanceResource.getAll(true,{
            'bike': bike['@id'],
        });

        setBikes(maintenancesFetch['hydra:totalItems']);
    }

    const getOrCreateDiscussion = async () => {
        const response = await discussionResource.getAll(true, {
            repairer: appointment.repairer['@id'],
            customer: appointment.customer['@id'],
        })

        if (response['hydra:member'].length === 0) {
            const discussionCreate = await createDiscussion(appointment.repairer['@id'], appointment.customer['@id']);
            setDiscussion(discussionCreate)
        }

        setDiscussion(response['hydra:member'][0]);
    }

    const createDiscussion = async (repairer: string, customer: string): Promise<Discussion> => {
        return await discussionResource.post( {
            repairer: appointment.repairer['@id'],
            customer: appointment.customer['@id'],
        })
    }

    const cancelAppointment = async () => {
        if (!appointment) {
            return;
        }

        setLoadingDelete(true);
        await appointmentResource.updateAppointmentStatus(appointment.id, {
            'transition': 'cancellation'
        });
        setLoadingDelete(false);
        handleCloseModal(true);
    }

    const handleClickProposeOtherSlot = async () => {
        setProposeOtherSlot(true);
        const slots = await openingHoursResource.getRepairerSlotsAvailable(appointment.repairer.id);
        setSlotsAvailable(slots);
        const dates = Object.keys(slots);
        setDates(dates);
    }

    const handleDateChange = (event: SelectChangeEvent) => {
        const newDateSelected = event.target.value as string;
        setSelectedDate(newDateSelected);
        const timesAvailable = slotsAvailable[newDateSelected]
        setTimes(timesAvailable)
    };

    const handleTimeChange = (event: SelectChangeEvent) => {
        setSelectedTime(event.target.value as string);
    };

    const handleClickAcceptAppointment = async (appointmentId: string) => {
        setPendingValid(true);
        await appointmentResource.updateAppointmentStatus(appointmentId, {
            transition: 'validated_by_repairer',
        });
        handleCloseModal(true);
        setPendingValid(false);
    };

    const handleClickRefuseAppointment = async (appointmentId: string) => {
        setPendingRefuse(true);
        await appointmentResource.updateAppointmentStatus(appointmentId, {
            transition: 'refused',
        });
        handleCloseModal(true);
        setPendingRefuse(false);
    };

    const sendNewSlot = async() => {
        if (!selectedDate || !selectedTime) {
            return;
        }

        setLoadingNewSlot(true);
        await appointmentResource.updateAppointmentStatus(appointment.id, {
            transition: 'propose_another_slot',
            slotTime: `${selectedDate} ${selectedTime}`
        });
        setLoadingNewSlot(false);
        handleCloseModal(true);
    };

    return (
        <Box>
            <Typography id="appointment_title" fontSize={20} fontWeight={600}>
                {appointment.autoDiagnostic && appointment.autoDiagnostic.prestation}
                {!appointment.autoDiagnostic && `Rendez-vous : ${appointment.customer.firstName} ${appointment.customer.lastName}`}
            </Typography>
            <List>
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
                        primary={formatDate(appointment.slotTime)}
                    />
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <CheckCircleOutlineIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary={getAppointmentStatus(appointment.status)}
                    />
                </ListItem>
                {appointment.bike &&
                    <ListItem>
                        <ListItemIcon>
                            <DirectionsBikeIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary={appointment.bike.name}
                        />
                    </ListItem>
                }
                {appointment.bikeType &&
                    <ListItem>
                        <ListItemIcon>
                            <DirectionsBikeIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary={appointment.bikeType.name}
                        />
                    </ListItem>
                }
                {appointment.autoDiagnostic && appointment.autoDiagnostic.photo &&
                    <img style={{marginTop: '20px', marginLeft: isMobile ? '10%': '20%'}} width={isMobile ? '200' : '300'} src={apiImageUrl(appointment.autoDiagnostic.photo.contentUrl)} alt="Photo autodiag" />
                }
            </List>

            <Grid container spacing={2}>

                {appointment.status === 'pending_repairer' && <Grid item xs={6}>
                    <Button variant="outlined" sx={{backgroundColor: '#7c9f4f', color: 'white','&:hover': {color:'black'}}} onClick={() => handleClickAcceptAppointment(appointment.id)}>
                        {pendingValid ? <CircularProgress sx={{color:'white'}} /> : 'Accepter le RDV'}
                    </Button>
                </Grid>}

                {appointment.status === 'pending_repairer' && <Grid item xs={6}>
                    <Button variant="outlined" sx={{backgroundColor: 'red', color: 'white','&:hover': {color:'black'}}} onClick={() => handleClickRefuseAppointment(appointment.id)}>
                        {pendingRefuse ? <CircularProgress sx={{color:'white'}} /> : 'Refuser le RDV'}
                    </Button>
                </Grid>}


                <Grid item xs={6}>
                    {(appointment.bike && bikes > 0) ?
                        <Link href={`/sradmin/clients/velos/${appointment.bike.id}`}>
                            <Button variant="outlined">
                                 Voir le carnet du vélo
                            </Button>
                        </Link> : <Button disabled variant="outlined">
                            Voir le carnet du vélo
                        </Button>}
                </Grid>
                <Grid item xs={6}>
                    <Button disabled={!discussion} variant="outlined">
                        Envoyer un message
                    </Button>
                </Grid>

                {
                    appointment.status === 'validated' &&
                        <Grid item xs={6}>
                            {(isPast(appointment.slotTime)) ?
                                <Button disabled variant="outlined">
                                    Modifier le rendez-vous
                                </Button> :
                                <Button variant="outlined" sx={{color: 'green'}} onClick={handleClickProposeOtherSlot}>
                                    Modifier le rendez-vous
                                </Button>
                            }
                        </Grid>
                }

                {
                    appointment.status === 'validated' &&
                        <Grid item xs={6}>
                            {(isPast(appointment.slotTime)) ?
                                <Button variant="outlined" disabled>
                                    Annuler le rendez-vous
                                </Button>:
                                <Button variant="outlined" sx={{color: 'red'}} onClick={cancelAppointment}>
                                    {!loadingDelete ? 'Annuler le rendez-vous' : <CircularProgress />}
                                </Button>
                            }
                        </Grid>
                }

                {
                    proposeOtherSlot &&
                    <Grid container spacing={2} sx={{mt: 3}}>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel id="label_select_jour">Jour</InputLabel>
                                <Select
                                    labelId="select_jour"
                                    id="select_jour"
                                    value={selectedDate}
                                    label="Jour"
                                    onChange={handleDateChange}
                                >
                                    {dates.map((date) => (
                                        <MenuItem key={date} value={date}>{date}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            {selectedDate &&
                                <FormControl fullWidth>
                                    <InputLabel id="label_select_heure">Heure</InputLabel>
                                    <Select
                                        labelId="select_time"
                                        id="select_time"
                                        value={selectedTime}
                                        label="Heure"
                                        onChange={handleTimeChange}
                                    >
                                        {times.map((time) => (
                                            <MenuItem key={time} value={time}>{time}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            }
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="outlined" onClick={sendNewSlot}>
                                {loadingNewSlot ? <CircularProgress /> : 'Envoyer la nouvelle proposition'}
                            </Button>
                        </Grid>
                    </Grid>
                }
            </Grid>
        </Box>
    )
}

export default AppointmentContent;
