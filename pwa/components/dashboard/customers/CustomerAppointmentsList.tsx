import React, {ChangeEvent, useEffect, useState} from 'react';
import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  CircularProgress,
} from '@mui/material';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import {Customer} from '@interfaces/Customer';
import {Appointment} from '@interfaces/Appointment';
import {appointmentResource} from '@resources/appointmentResource';
import {formatDate} from 'helpers/dateHelper';
import {getAppointmentStatus} from '@helpers/appointmentStatus';
import ModalShowAppointment from '@components/dashboard/agenda/ModalShowAppointment';
import {useAccount} from '@contexts/AuthContext';
import {Repairer} from '@interfaces/Repairer';

interface CustomerAppointmentsListProps {
  customer: Customer;
}

export const CustomerAppointmentsList = ({
  customer,
}: CustomerAppointmentsListProps): JSX.Element => {
  const [loadingList, setLoadingList] = useState<boolean>(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [appointmentSelected, setAppointmentSelected] =
    useState<Appointment | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [openModal, setOpenModal] = React.useState(false);
  const {user} = useAccount({});

  const handleOpen = () => setOpenModal(true);
  const handleClose = (refresh: boolean | undefined) => {
    setOpenModal(false);
    if (refresh) {
      fetchAppointments();
    }
  };

  const handleShow = (appointment: Appointment) => {
    setAppointmentSelected(appointment);
    handleOpen();
  };

  const fetchAppointments = async () => {
    if (!user) {
      return;
    }

    const repairer: Repairer | undefined = user.repairer
      ? user.repairer
      : user.repairerEmployee?.repairer;
    if (!repairer) {
      return;
    }

    setLoadingList(true);
    let params = {
      page: `${currentPage ?? 1}`,
      itemsPerPage: 20,
      'order[id]': 'DESC',
      customer: customer.id,
      repairer: repairer['@id'],
    };
    const response = await appointmentResource.getAll(true, params);
    setAppointments(response['hydra:member']);
    setTotalPages(Math.ceil(response['hydra:totalItems'] / 20));
    setLoadingList(false);
  };

  useEffect(() => {
    fetchAppointments();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect((): void => {
    fetchAppointments();
  }, [currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePageChange = (event: ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  return (
    <Box>
      <TableContainer elevation={4} component={Paper}>
        <Table aria-label="employees">
          <TableHead
            sx={{
              '& th': {
                fontWeight: 'bold',
                color: 'primary.main',
              },
            }}>
            <TableRow>
              <TableCell align="left">Date</TableCell>
              <TableCell align="left">Prestation</TableCell>
              <TableCell align="left">Status</TableCell>
              <TableCell align="left"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loadingList && <CircularProgress />}
            {!loadingList &&
              appointments.map((appointment) => (
                <TableRow
                  key={appointment.id}
                  sx={{
                    '&:last-child td, &:last-child th': {border: 0},
                  }}>
                  <TableCell align="left" component="th" scope="row">
                    {formatDate(appointment.slotTime)}
                  </TableCell>
                  <TableCell align="left">
                    {appointment.autoDiagnostic?.prestation}
                  </TableCell>
                  <TableCell align="left">
                    {getAppointmentStatus(appointment.status)}
                  </TableCell>
                  <TableCell align="left" sx={{cursor: 'pointer'}}>
                    <RemoveRedEyeIcon
                      onClick={() => handleShow(appointment)}
                      color="primary"
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {totalPages > 1 && (
        <Stack spacing={2} sx={{marginTop: '20px'}}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
            size="large"
          />
        </Stack>
      )}

      {appointmentSelected && (
        <ModalShowAppointment
          appointment={appointmentSelected}
          openModal={openModal}
          handleCloseModal={handleClose}
        />
      )}
    </Box>
  );
};

export default CustomerAppointmentsList;
