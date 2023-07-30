import React, {useEffect, useState} from 'react';
import {Typography, Box} from '@mui/material';
import {User} from '@interfaces/User';
import {appointmentResource} from '@resources/appointmentResource';
import {Appointment} from '@interfaces/Appointment';
import {dateObjectAsString} from '@helpers/dateHelper';
import {OldAppointmentCard} from './OldAppointmentCard';

interface MyOldAppointmentsProps {
  currentUser: User;
  setLoading: (b: boolean) => void;
}

const MyOldAppointments = ({
  currentUser,
  setLoading,
}: MyOldAppointmentsProps) => {
  const [isEmpty, setEmpty] = useState<boolean | undefined>();
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const fetchAppointments = async () => {
    setLoading(true);
    const response = await appointmentResource.getAll(true, {
      customer: currentUser.id,
      'order[slotTime]': 'DESC',
      'slotTime[before]': dateObjectAsString(new Date()),
    });

    setAppointments(response['hydra:member']);
    setEmpty(!response['hydra:member']?.length);
    setLoading(false);
  };

  useEffect(() => {
    fetchAppointments();
  }, [currentUser]); // eslint-disable-line react-hooks/exhaustive-deps

  return isEmpty === false ? (
    <Box width="100%" textAlign="center">
      <Typography variant="h4" color="text.secondary" sx={{mb: 3}}>
        Rendez-vous passés
      </Typography>
      <Box
        sx={{
          display: {
            xs: 'flex',
            md: 'grid',
          },
          flexDirection: 'column',
          width: '100%',
          maxWidth: '1200px',
          mx: 'auto',
          gap: 2,
          gridTemplateColumns: {
            md: 'repeat(auto-fit,minmax(400px,1fr))',
          },
          placeContent: 'center',
        }}>
        {[...appointments, ...appointments].map((appointment) => (
          <OldAppointmentCard
            key={appointment.id}
            appointment={appointment}
            fetchAppointments={fetchAppointments}
          />
        ))}
      </Box>
    </Box>
  ) : null;
};

export default MyOldAppointments;
