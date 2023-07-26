import React, {PropsWithRef, useState} from 'react';
import router from 'next/router';
import Link from 'next/link';
import {appointmentResource} from '@resources/appointmentResource';
import ModalCancelAppointment from './ModalCancelAppointment';
import {
  Stack,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
} from '@mui/material';
import {formatDate} from 'helpers/dateHelper';
import {Appointment} from '@interfaces/Appointment';
import {errorRegex} from '@utils/errorRegex';

interface AppointmentCardProps extends PropsWithRef<any> {
  appointment: Appointment;
  future: boolean;
  fetchAppointments: () => void;
}

export const AppointmentCard = ({
  appointment,
  future,
  fetchAppointments,
}: AppointmentCardProps): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const cancelAppointment = async (appointment: Appointment) => {
    setErrorMessage(null);
    setLoading(true);
    try {
      await appointmentResource.updateAppointmentStatus(appointment.id, {
        transition: 'cancellation',
      });
    } catch (e: any) {
      setErrorMessage(
        `Suppression du rendez-vous impossible: ${e.message?.replace(
          errorRegex,
          '$2'
        )}, veuillez réessayer`
      );
    }
    await fetchAppointments();
    setLoading(false);
  };

  return (
    <Card
      sx={{
        boxShadow: 0,
        border: (theme) => `4px solid ${theme.palette.grey[300]}`,
        display: 'flex',
      }}>
      <CardMedia
        component="img"
        sx={{
          width: {xs: 50, md: 100},
          height: {xs: 50, md: 100},
          p: 2,
          borderRadius: '50%',
        }}
        image={
          appointment.repairer.thumbnail
            ? appointment.repairer.thumbnail.contentUrl
            : 'https://cdn.cleanrider.com/uploads/2021/04/prime-reparation-velo_140920-3.jpg'
        }
        alt="Photo du réparateur"
      />
      <CardContent
        sx={{
          pl: 0,
          pr: 2,
          py: 2,
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        }}>
        <Stack spacing={{xs: 1, md: 2}}>
          <div>
            <Typography
              fontSize={{xs: 16, md: 24}}
              fontWeight={600}
              sx={{wordBreak: 'break-word'}}>
              {formatDate(appointment.slotTime)}
            </Typography>
          </div>
          <div>
            <Typography
              color={'primary'}
              fontSize={{xs: 12, md: 16, fontWeight: 700}}>
              {appointment.repairer.name}
            </Typography>
            <Typography fontSize={{xs: 12, md: 16, fontWeight: 700}}>
              {appointment.repairer.streetNumber} {appointment.repairer.street}
            </Typography>
            <Typography fontSize={{xs: 12, md: 16, fontWeight: 700}}>
              {appointment.repairer.postcode} {appointment.repairer.city}
            </Typography>
            {appointment.autoDiagnostic && (
              <Typography
                color="text.secondary"
                fontSize={{xs: 12, md: 16, mt: 10}}>
                {appointment.autoDiagnostic.prestation}
              </Typography>
            )}
          </div>
          <Box sx={{display: 'inline-flex'}}>
            {future && (
              <Box>
                <Button
                  variant="outlined"
                  color="warning"
                  size="small"
                  onClick={() => setOpenModal(true)}>
                  Annuler le RDV
                </Button>
                <ModalCancelAppointment
                  appointment={appointment}
                  openModal={openModal}
                  loading={loading}
                  errorMessage={errorMessage}
                  handleCloseModal={() => setOpenModal(false)}
                  handleCancelAppointment={() => cancelAppointment(appointment)}
                />
                {appointment.discussion && (
                  <Link href={`/messagerie/${appointment.discussion.id}`}>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{marginLeft: '5px'}}>
                      Envoyer un message
                    </Button>
                  </Link>
                )}
              </Box>
            )}
            {!future && (
              <Box>
                <Button
                  onClick={() =>
                    router.push({
                      pathname: `/reparateur/${appointment.repairer.id}`,
                      query: {appointment: 1},
                    })
                  }
                  variant="outlined"
                  size="small"
                  sx={{marginLeft: '5px'}}>
                  Reprendre RDV
                </Button>
              </Box>
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};
