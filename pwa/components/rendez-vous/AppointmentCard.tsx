import React, {PropsWithRef, useState} from 'react';
import Link from 'next/link';
import {appointmentResource} from '@resources/appointmentResource';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Avatar,
  IconButton,
} from '@mui/material';
import ConfirmationModal from '@components/common/ConfirmationModal';
import {formatDate, getTimeFromDateAsString} from 'helpers/dateHelper';
import {Appointment} from '@interfaces/Appointment';
import {errorRegex} from '@utils/errorRegex';
import {CalendarMonth, Message, Schedule} from '@mui/icons-material';

interface AppointmentCardProps extends PropsWithRef<any> {
  appointment: Appointment;
  fetchAppointments: () => void;
}

export const AppointmentCard = ({
  appointment,
  fetchAppointments,
}: AppointmentCardProps): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const cancelAppointment = async (appointment: Appointment) => {
    setLoading(true);
    try {
      await appointmentResource.updateAppointmentStatus(appointment.id, {
        transition: 'cancellation',
      });
      await fetchAppointments();
    } catch (e: any) {
      setErrorMessage(
        `Suppression du rendez-vous impossible: ${e.message?.replace(
          errorRegex,
          '$2'
        )}, veuillez réessayer`
      );
      setTimeout(() => setErrorMessage(null), 3000);
    }
    setLoading(false);
  };

  return (
    <Card
      elevation={1}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 6,
        transition: 'all ease 0.5s',
        justifyContent: 'flex-start',
        width: '100%',
        maxWidth: '600px',
        mx: 'auto',
        minHeight: '200px',
        textAlign: 'left',
        p: 0,
        opacity: appointment.status === 'validated' ? 1 : 0.7,
      }}>
      <Box
        bgcolor={
          appointment.status === 'validated' ? 'secondary.main' : 'grey.600'
        }
        display="flex"
        flexDirection="column"
        px={3}
        py={2}>
        <Typography
          variant="caption"
          fontWeight="bold"
          color="white"
          textTransform="uppercase"
          sx={{opacity: 0.9}}>
          {appointment.status === 'validated'
            ? 'Rendez-vous confirmé'
            : 'En attente de validation'}
        </Typography>
        <Box
          display="flex"
          flexDirection="row"
          gap={2}
          textAlign="center"
          color="white">
          <Box display="flex" gap={1}>
            <CalendarMonth color="inherit" />
            <Typography color="white" variant="body1">
              {formatDate(appointment.slotTime, false)}
            </Typography>
          </Box>
          <Box display="flex" gap={1}>
            <Schedule color="inherit" />
            <Typography color="white" variant="body1">
              {getTimeFromDateAsString(appointment.slotTime)}
            </Typography>
          </Box>
        </Box>
      </Box>
      <CardContent
        sx={{
          p: 0,
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        }}>
        <Box display="flex" p={2} gap={3}>
          <Avatar
            sx={{width: 60, height: 60}}
            src={
              appointment.repairer?.thumbnail?.contentUrl ||
              'https://cdn.cleanrider.com/uploads/2021/04/prime-reparation-velo_140920-3.jpg'
            }></Avatar>
          <Box display="flex" flexDirection="column" flex={1}>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center">
              <Box display="flex" flex={1} flexDirection="column">
                <Typography variant="h5">
                  {appointment.repairer.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {appointment.repairer.streetNumber}{' '}
                  {appointment.repairer.street}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {appointment.repairer.postcode} {appointment.repairer.city}
                </Typography>
              </Box>
              <ConfirmationModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onConfirm={() => cancelAppointment(appointment)}
                loading={loading}
                errorMessage={errorMessage}>
                <Typography variant="h5" gutterBottom>
                  Êtes-vous sûr(e) de vouloir annuler ce rendez-vous ?
                </Typography>
                <Typography color="text.secondary">
                  {`Vous êtes sur le point d'annuler votre rendez-vous du ${formatDate(
                    appointment?.slotTime
                  )} avec le réparateur ${appointment.repairer.name}.`}
                </Typography>
              </ConfirmationModal>
              {appointment.discussion && (
                <Link
                  href={`/messagerie/${appointment.discussion.id}`}
                  legacyBehavior
                  passHref>
                  <IconButton
                    size="small"
                    color="secondary"
                    sx={{
                      border: '1px solid',
                      borderColor: 'secondary.main',
                      padding: 1,
                    }}>
                    <Message />
                  </IconButton>
                </Link>
              )}
            </Box>
            <Box my={1}>
              <Typography
                color="text.secondary"
                variant="body2"
                fontWeight="bold"
                component="span">
                Prestation&nbsp;:&nbsp;
              </Typography>
              <Typography
                color="text.secondary"
                component="span"
                variant="body2">
                {appointment.autoDiagnostic
                  ? appointment.autoDiagnostic.prestation
                  : 'N.C.'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
      <Box display="flex" width="100%" justifyContent="flex-end" gap={1} p={2}>
        <>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => setOpenModal(true)}>
            Annuler le RDV
          </Button>
        </>
      </Box>
    </Card>
  );
};
