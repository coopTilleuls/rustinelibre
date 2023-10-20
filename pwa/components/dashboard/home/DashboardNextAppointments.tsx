import React, {useEffect, useState} from 'react';
import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  CircularProgress,
  Box,
  Typography,
  Button,
  IconButton,
  Link,
  useMediaQuery,
} from '@mui/material';
import {Appointment} from '@interfaces/Appointment';
import {
  getDateFromDateAsString,
  getTimeFromDateAsString,
} from '@helpers/dateHelper';
import SearchIcon from '@mui/icons-material/Search';
import ModalShowAppointment from '@components/dashboard/agenda/ModalShowAppointment';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import {Repairer} from '@interfaces/Repairer';
import ModalAppointmentCreate from '@components/dashboard/appointments/ModalAppointmentCreate';
import {getAutodiagBikeName} from '@helpers/appointmentStatus';
import theme from 'styles/theme';

interface DashboardNextAppointmentsProps {
  repairer: Repairer;
  appointmentsNext: Appointment[];
  fetchNextAppointments: () => void;
  loadingListNext: boolean;
}

const DashboardNextAppointments = ({
  repairer,
  appointmentsNext,
  fetchNextAppointments,
  loadingListNext,
}: DashboardNextAppointmentsProps): JSX.Element => {
  const [appointmentSelected, setAppointmentSelected] =
    useState<Appointment | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openModalCreateAppointment, setOpenModalCreateAppointment] =
    useState<boolean>(false);

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleCloseModal = async (refresh = true): Promise<void> => {
    setOpenModal(false);
    if (refresh) {
      await fetchNextAppointments();
    }
  };

  useEffect(() => {
    fetchNextAppointments();
  }, [repairer]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCloseModalCreateAppointment = async (
    refresh: boolean = true
  ): Promise<void> => {
    setOpenModalCreateAppointment(false);
    if (refresh) {
      await fetchNextAppointments();
    }
  };

  const handleShowAppointment = (appointment: Appointment) => {
    setOpenModal(true);
    setAppointmentSelected(appointment);
  };

  return (
    <Box>
      <Typography variant="h5">
        Prochains {isMobile ? 'RDV' : 'rendez-vous'}
        <Button
          variant="contained"
          color="secondary"
          sx={{float: 'right'}}
          size="small"
          onClick={() => setOpenModalCreateAppointment(true)}
          startIcon={<AddIcon />}>
          {isMobile ? 'Créer' : 'Créer un rendez-vous'}
        </Button>
      </Typography>
      {loadingListNext && <CircularProgress sx={{ml: 10, mt: 10}} />}
      {!loadingListNext &&
        (appointmentsNext.length > 0 ? (
          <TableContainer elevation={4} component={Paper} sx={{mt: 3}}>
            <Table aria-label="rdv">
              <TableHead
                sx={{
                  '& th': {
                    fontWeight: 'bold',
                    color: 'primary.main',
                  },
                }}>
                <TableRow>
                  <TableCell align="left">Nom</TableCell>
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
                      {appointment.customer.firstName}{' '}
                      {appointment.customer.lastName}
                      <br />
                      <Typography
                        variant="body1"
                        sx={{fontSize: '0.9em', color: 'grey'}}>
                        {getAutodiagBikeName(appointment)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      {getDateFromDateAsString(appointment.slotTime)}
                      <br />
                      <Typography
                        variant="body1"
                        sx={{fontSize: '0.9em', color: 'green'}}>
                        {getTimeFromDateAsString(appointment.slotTime)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="secondary"
                        onClick={() => handleShowAppointment(appointment)}>
                        <SearchIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow
                  key="see_more_next_appointment"
                  sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                  <TableCell
                    component="th"
                    scope="row"
                    colSpan={3}
                    sx={{textAlign: 'center'}}>
                    <Link href="/sradmin/agenda">Voir tout</Link>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body2" sx={{py: 3}} color="text.secondary">
            Vous n&apos;avez aucun rendez-vous prévu
          </Typography>
        ))}

      <ModalAppointmentCreate
        repairer={repairer}
        appointmentSelectedDate={null}
        openModal={openModalCreateAppointment}
        handleCloseModal={handleCloseModalCreateAppointment}
      />
      {appointmentSelected && (
        <ModalShowAppointment
          appointment={appointmentSelected}
          openModal={openModal}
          handleCloseModal={handleCloseModal}
        />
      )}
    </Box>
  );
};

export default DashboardNextAppointments;
