import React, {useEffect, useState} from 'react';
import {
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
    CircularProgress, Box, Typography, Button, Link,
} from '@mui/material';
import {Appointment} from "@interfaces/Appointment";
import {getDateFromDateAsString, getTimeFromDateAsString} from "@helpers/dateHelper";
import SearchIcon from '@mui/icons-material/Search';
import ModalShowAppointment from "@components/dashboard/agenda/ModalShowAppointment";
import AddIcon from "@mui/icons-material/Add";
import {Repairer} from "@interfaces/Repairer";
import ModalAppointmentCreate from "@components/dashboard/appointments/ModalAppointmentCreate";

interface DashboardNextAppointmentsProps {
    repairer: Repairer;
    appointmentsNext: Appointment[];
    fetchNextAppointments: () => void
    loadingListNext: boolean
}

export const DashboardNextAppointments = ({repairer, appointmentsNext, fetchNextAppointments, loadingListNext}: DashboardNextAppointmentsProps): JSX.Element => {

    const [appointmentSelected, setAppointmentSelected] = useState<Appointment|null>(null);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openModalCreateAppointment, setOpenModalCreateAppointment] = useState<boolean>(false);

    const handleCloseModal = async (refresh = true): Promise<void> => {
        setOpenModal(false);
        if (refresh) {
            await fetchNextAppointments();
        }
    };

    useEffect(() => {
        fetchNextAppointments();
    }, [repairer]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleCloseModalCreateAppointment = () => {
        setOpenModalCreateAppointment(false);
    };
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

    return (
        <Box>
            <Typography variant="h5">
                Prochains rendez-vous
                <Button variant="contained" sx={{float: 'right'}} size="small" onClick={()=>setOpenModalCreateAppointment(true)}>
                    <AddIcon />
                    Créer un rendez-vous
                </Button>
            </Typography>
            {loadingListNext && <CircularProgress sx={{ml: 10, mt: 10}} />}
            {!loadingListNext && <TableContainer elevation={4} component={Paper} sx={{mt: 3}}>
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
                            <TableCell align="center">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {appointmentsNext.slice(0, 6).map((appointment) => (
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
                                    <SearchIcon onClick={() => handleShowAppointment(appointment)} sx={{backgroundColor: '#8c83ba', borderRadius: '20px', color: 'white', padding: '5px', fontSize: '2.5em', cursor: 'pointer'}} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>}

            <ModalAppointmentCreate repairer={repairer} appointmentSelectedDate={null} openModal={openModalCreateAppointment} handleCloseModal={handleCloseModalCreateAppointment}/>
            {appointmentSelected && <ModalShowAppointment appointment={appointmentSelected} openModal={openModal} handleCloseModal={handleCloseModal} />}
        </Box>
    );
};

export default DashboardNextAppointments;
