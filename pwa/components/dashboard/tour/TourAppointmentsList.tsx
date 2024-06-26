import React, {useState} from 'react';
import {Typography, Button} from '@mui/material';
import Box from '@mui/material/Box';
import {Appointment} from '@interfaces/Appointment';
import {getTimeFromDateAsString} from 'helpers/dateHelper';
import Grid from '@mui/material/Grid';
import ModalShowAppointment from '@components/dashboard/agenda/ModalShowAppointment';

interface TourAppointmentsListProps {
  appointments: Appointment[];
}

export const TourAppointmentsList = ({
  appointments,
}: TourAppointmentsListProps): JSX.Element => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [appointmentSelected, setAppointmentSelected] =
    useState<Appointment | null>(null);

  const handleCloseModal = (): void => {
    setOpenModal(false);
    setAppointmentSelected(null);
  };

  const handleClickShowAppointment = (appointment: Appointment): void => {
    setAppointmentSelected(appointment);
    setOpenModal(true);
  };

  const handleOpenGPS = (latitude: number, longitude: number) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    window.open(url, '_blank');
  };

  return (
    <Box>
      {appointments.map((appointment, key) => {
        return (
          <Box key={key} sx={{marginTop: '20px'}}>
            <Grid container spacing={2}>
              <Grid item xs={2}>
                <Typography
                  sx={{
                    padding: '3px',
                    backgroundColor: 'lightblue',
                    borderRadius: '30px',
                    textAlign: 'center',
                    marginBottom: '20px',
                  }}>
                  {key + 1}
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <strong>{getTimeFromDateAsString(appointment.slotTime)}</strong>{' '}
                <br />
                {appointment.address}
                <Box sx={{display: 'flex', marginTop: '10px'}}>
                  {appointment.latitude && appointment.longitude && (
                    <Button
                      variant="contained"
                      size="small"
                      sx={{marginRight: '5px'}}
                      onClick={() =>
                        handleOpenGPS(
                          Number(appointment.latitude),
                          Number(appointment.longitude)
                        )
                      }>
                      Aller au RDV
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleClickShowAppointment(appointment)}>
                    Détail du RDV
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        );
      })}

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

export default TourAppointmentsList;
