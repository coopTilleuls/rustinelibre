import React, {useEffect, useState} from 'react';
import {Typography, Box} from '@mui/material';
import {User} from '@interfaces/User';
import {appointmentResource} from '@resources/appointmentResource';
import {Appointment} from '@interfaces/Appointment';
import {dateObjectAsString} from '@helpers/dateHelper';
import {AppointmentCard} from '@components/rendez-vous/AppointmentCard';
import Grid from '@mui/material/Grid';

interface MyFutureAppointmentProps {
  currentUser: User;
}

const MyFutureAppointment = ({currentUser}: MyFutureAppointmentProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const fetchAppointments = async () => {
    setLoading(true);
    const response = await appointmentResource.getAll(true, {
      customer: currentUser.id,
      'order[slotTime]': 'DESC',
      'slotTime[after]': dateObjectAsString(new Date()),
    });

    setAppointments(response['hydra:member']);
    setLoading(false);
  };

  useEffect(() => {
    fetchAppointments();
  }, [currentUser]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box>
      <Typography variant="h4" sx={{mb: 2}}>
        Rendez-vous à venir
      </Typography>
      <Box>
        {!loading && appointments.length > 0 && (
          <Grid container spacing={2}>
            {!loading &&
              appointments.map((appointment) => {
                return (
                  <Grid item xs={12} md={6} key={appointment.id}>
                    <AppointmentCard appointment={appointment} />
                  </Grid>
                );
              })}
          </Grid>
        )}
        {!loading && appointments.length === 0 && (
          <Box>
            <Typography variant="body1">
              Vous n&apos;avez pas de rendez vous à venir
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MyFutureAppointment;
