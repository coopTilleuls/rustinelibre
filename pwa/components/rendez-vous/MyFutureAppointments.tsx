import React, {useEffect, useState} from 'react';
import {Typography, Box} from '@mui/material';
import {User} from '@interfaces/User';
import {appointmentResource} from '@resources/appointmentResource';
import {Appointment} from '@interfaces/Appointment';
import {dateObjectAsString} from '@helpers/dateHelper';
import {AppointmentCard} from '@components/rendez-vous/AppointmentCard';

interface MyFutureAppointmentProps {
  currentUser: User;
  setLoading: (b: boolean) => void;
}

const MyFutureAppointment = ({
  currentUser,
  setLoading,
}: MyFutureAppointmentProps) => {
  const [isEmpty, setEmpty] = useState<boolean | undefined>();
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const fetchAppointments = async () => {
    setLoading(true);
    const validated = await appointmentResource.getAll(true, {
      customer: currentUser.id,
      'order[slotTime]': 'ASC',
      'slotTime[after]': dateObjectAsString(new Date()),
      status: 'validated',
    });
    const pending = await appointmentResource.getAll(true, {
      customer: currentUser.id,
      'order[slotTime]': 'ASC',
      'slotTime[after]': dateObjectAsString(new Date()),
      status: 'pending_repairer',
    });
    const response = [...validated['hydra:member'], ...pending['hydra:member']];

    setAppointments(response);
    setEmpty(!response?.length);
    setLoading(false);
  };

  useEffect(() => {
    fetchAppointments();
  }, [currentUser]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box width="100%" textAlign="center">
      <Box
        sx={{
          display: {
            xs: 'flex',
            md: 'grid',
          },
          width: '100%',
          flexDirection: 'column',
          maxWidth: '1200px',
          mx: 'auto',
          gap: 4,
          gridTemplateColumns: {
            md: 'repeat(auto-fit,minmax(400px,1fr))',
          },
          placeContent: 'center',
        }}>
        {appointments.map((appointment) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
            fetchAppointments={fetchAppointments}
          />
        ))}
      </Box>
      {isEmpty && (
        <Typography sx={{my: 2}} variant="body1" color="text.secondary">
          Vous n&apos;avez aucun rendez-vous à venir
        </Typography>
      )}
    </Box>
  );
};

export default MyFutureAppointment;
