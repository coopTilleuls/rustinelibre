import React, {useEffect, useState} from 'react';
import {
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
    CircularProgress, Box, Typography,
} from '@mui/material';
import {Appointment} from "@interfaces/Appointment";
import {appointmentResource} from "@resources/appointmentResource";
import {getDateFromDateAsString, getTimeFromDateAsString} from "@helpers/dateHelper";
import SearchIcon from '@mui/icons-material/Search';
import ModalShowAppointment from "@components/dashboard/agenda/ModalShowAppointment";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

interface DashboardWaitingAppointmentsProps {
    repairer: string;
    appointmentsWaiting: Appointment[];
    fetchWaitingAppointments: () => Promise<void>;
    fetchNextAppointments: () => Promise<void>;
    loadingListWait: boolean;
}

export const DashboardWaitingAppointments = ({repairer, appointmentsWaiting, fetchWaitingAppointments, fetchNextAppointments, loadingListWait}: DashboardWaitingAppointmentsProps): JSX.Element => {

    const [appointmentSelected, setAppointmentSelected] = useState<Appointment|null>(null);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [updateAppointmentId, setUpdateAppointmentId] = useState<string|null>(null);

    const handleCloseModal = (refresh = true): void => {
        setOpenModal(false);
        if (refresh) {
            refreshLists();
        }
    };

    const refreshLists = async(): Promise<void> => {
        await fetchNextAppointments();
        await fetchWaitingAppointments();
    }

    useEffect(() => {
        fetchWaitingAppointments();
    }, [repairer]); // eslint-disable-line react-hooks/exhaustive-deps

    const getAppointmentName = (appointment: Appointment): string => {
        if (appointment.autoDiagnostic) {
            return appointment.autoDiagnostic.prestation;
        }

        return `${appointment.customer.firstName} ${appointment.customer.lastName}`
    }

    const getBike = (appointment: Appointment): string|undefined => {
        if (appointment.bike) {
            return appointment.bike.name;
        }

        if (appointment.bikeType) {
            return appointment.bikeType.name;
        }

        return '';
    }

    const handleShowAppointment = (appointment: Appointment) => {
        setOpenModal(true);
        setAppointmentSelected(appointment);
    }

    const handleValidAppointment = async(appointment: Appointment) => {
        setUpdateAppointmentId(appointment.id);
        await appointmentResource.updateAppointmentStatus(appointment.id, {
            transition: 'validated_by_repairer'
        })

        await refreshLists();
        setUpdateAppointmentId(null);
    }

    return (
        <Box>
            <Typography variant="h5">
                Rendez-vous en attente
            </Typography>
            {loadingListWait && <CircularProgress sx={{ml: 10, mt: 10}} />}
            {!loadingListWait && <TableContainer elevation={4} component={Paper} sx={{mt: 3}}>
                <Table aria-label="rdv">
                    <TableHead
                        sx={{
                            '& th': {
                                fontWeight: 'bold',
                                color: 'primary.main',
                            },
                        }}>
                        <TableRow>
                            <TableCell align="left">Type</TableCell>
                            <TableCell align="right">Date</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {appointmentsWaiting.map((appointment) => (
                            <TableRow
                                key={appointment.id}
                                sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                                <TableCell component="th" scope="row">
                                    {getAppointmentName(appointment)}
                                    <br />
                                    <Typography variant="body1" sx={{fontSize: '0.9em', color: 'grey'}}>
                                        {getBike(appointment)}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    {getDateFromDateAsString(appointment.slotTime)}
                                    <br />
                                    <Typography variant="body1" sx={{fontSize: '0.9em', color: 'green'}}>
                                        {getTimeFromDateAsString(appointment.slotTime)}
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    {updateAppointmentId === appointment.id && <CircularProgress />}
                                    {!updateAppointmentId && <CheckCircleOutlineIcon onClick={() => handleValidAppointment(appointment)} sx={{color: '#8c83ba', fontSize: '2.8em', cursor: 'pointer'}} />}
                                    {!updateAppointmentId && <SearchIcon onClick={() => handleShowAppointment(appointment)} sx={{backgroundColor: '#8c83ba', borderRadius: '20px', color: 'white', padding: '5px', fontSize: '2.5em', cursor: 'pointer'}} />}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>}

            {appointmentSelected && <ModalShowAppointment appointment={appointmentSelected} openModal={openModal} handleCloseModal={handleCloseModal} />}
        </Box>
    );
};

export default DashboardWaitingAppointments;
