import React, {useEffect, useState} from 'react';
import {appointmentResource} from '@resources/appointmentResource';
import {openingHoursResource} from '@resources/openingHours';
import AppointmentActions from '../appointments/AppointmentActions';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  Link,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PedalBikeIcon from '@mui/icons-material/PedalBike';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import {Appointment} from '@interfaces/Appointment';
import {formatDate, formatDateInSelect} from '@helpers/dateHelper';
import {getAppointmentStatus} from '@helpers/appointmentStatus';

type ModalShowAppointmentProps = {
  appointment: Appointment;
  openModal: boolean;
  handleCloseModal: (refresh: boolean | undefined) => void;
};

const ModalShowAppointment = ({
  appointment,
  openModal,
  handleCloseModal,
}: ModalShowAppointmentProps): JSX.Element => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [loadingNewSlot, setLoadingNewSlot] = useState<boolean>(false);
  const [proposeOtherSlot, setProposeOtherSlot] = useState<boolean>(false);
  const [slotsAvailable, setSlotsAvailable] = useState<any>(null);
  const [dates, setDates] = useState<string[]>([]);
  const [times, setTimes] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | undefined>(
    undefined
  );
  const [selectedTime, setSelectedTime] = useState<string | undefined>('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    checkSlotTimePast();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClickProposeOtherSlot = async () => {
    setProposeOtherSlot(true);
    const slots = await openingHoursResource.getRepairerSlotsAvailable(
      appointment.repairer.id
    );
    setSlotsAvailable(slots);
    const dates = Object.keys(slots);
    setDates(dates);
  };

  const checkSlotTimePast = async () => {
    const date = new Date(appointment.slotTime);
    const currentDate = new Date();
    if (date < currentDate && appointment.status === 'pending_repairer') {
      await appointmentResource.updateAppointmentStatus(appointment.id, {
        transition: 'cancellation',
      });
    }
  };
  const handleDateChange = (event: SelectChangeEvent) => {
    const newDateSelected = event.target.value as string;
    setSelectedDate(newDateSelected);
    const timesAvailable = slotsAvailable[newDateSelected];
    setTimes(timesAvailable);
  };

  const handleTimeChange = (event: SelectChangeEvent) => {
    setSelectedTime(event.target.value as string);
  };

  const sendNewSlot = async () => {
    if (!selectedDate || !selectedTime) {
      return;
    }
    try {
      setLoadingNewSlot(true);
      await appointmentResource.updateAppointmentStatus(appointment.id, {
        transition: 'propose_another_slot',
        slotTime: `${selectedDate} ${selectedTime}`,
      });
      setLoadingNewSlot(false);
      setSuccessMessage('Le rendez-vous a bien été modifié.');
      setTimeout(() => {
        setSuccessMessage(null);
        setProposeOtherSlot(false);
        handleCloseModal(true);
      }, 3000);
    } catch (e) {
      setLoadingNewSlot(false);
      setErrorMessage(
        "Le rendez-vous n'a pas pu être modifié, veuillez réessayer."
      );
      setTimeout(() => {
        setErrorMessage(null);
        setProposeOtherSlot(false);
        handleCloseModal(true);
      }, 3000);
    }
  };

  return (
    <Dialog
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      open={openModal}
      onClose={() => handleCloseModal(false)}
      aria-labelledby="Affichage d'un rendez-vous"
      aria-describedby="popup_show_appointment">
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Typography variant="h3" color="primary">
          Rendez-vous
        </Typography>
        <IconButton
          aria-label="close"
          color="primary"
          onClick={() => handleCloseModal(false)}>
          <CloseIcon fontSize="large" />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <>
          {appointment.autoDiagnostic && (
            <Typography
              id="appointment_title"
              fontSize={20}
              fontWeight={600}
              sx={{pb: 1}}>
              {appointment.autoDiagnostic.prestation}
            </Typography>
          )}
          <Box display="flex" flexDirection="column" gap={2}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center">
              <Box display="flex" gap={2}>
                <AccountCircleIcon color="primary" />
                <Typography>Client:</Typography>
                <Typography>
                  {appointment.customer.firstName}{' '}
                  {appointment.customer.lastName}
                </Typography>
              </Box>
              <Box>
                <Link
                  href={`/sradmin/messagerie/${appointment.discussion!.id}`}>
                  {isMobile ? (
                    <IconButton
                      color="secondary"
                      disabled={!appointment.discussion}
                      sx={{
                        borderRadius: '50%',
                        padding: '8px',
                      }}>
                      <EmailIcon />
                    </IconButton>
                  ) : (
                    <Button
                      size="small"
                      color="secondary"
                      disabled={!appointment.discussion}
                      variant="outlined">
                      Envoyer un message
                    </Button>
                  )}
                </Link>
              </Box>
            </Box>
            {appointment.bike && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center">
                <Box display="flex" gap={2}>
                  <PedalBikeIcon color="primary" />
                  <Typography>Vélo:</Typography>
                  <Typography>{appointment.bike.name}</Typography>
                </Box>
                <Box>
                  <Link href={`/sradmin/clients/velos/${appointment.bike.id}`}>
                    {isMobile ? (
                      <IconButton
                        color="secondary"
                        disabled={!appointment.bike}
                        sx={{
                          borderRadius: '50%',
                          padding: '8px',
                        }}>
                        <AssignmentIcon />
                      </IconButton>
                    ) : (
                      <Button
                        size="small"
                        color="secondary"
                        disabled={!appointment.bike}
                        variant="outlined">
                        Voir le carnet du vélo
                      </Button>
                    )}
                  </Link>
                </Box>
              </Box>
            )}
            {appointment.address && (
              <Box display="flex" gap={2}>
                <LocationOnIcon color="primary" />
                <Typography>Adresse:</Typography>
                <Typography>{appointment.address}</Typography>
              </Box>
            )}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center">
              <Box display="flex" gap={2}>
                <CalendarMonthIcon color="primary" />
                <Typography>Date:</Typography>{' '}
                {formatDate(appointment.slotTime)}
              </Box>
            </Box>
            <Box display="flex" gap={2}>
              <CheckCircleOutlineIcon color="primary" />
              <Typography>Status:</Typography>
              <Typography>
                {getAppointmentStatus(appointment.status)}
              </Typography>
            </Box>
            {appointment.bikeType && (
              <Box display="flex" gap={2}>
                <PedalBikeIcon color="primary" />
                <Typography>Type de vélo:</Typography>
                <Typography>{appointment.bikeType.name}</Typography>
              </Box>
            )}
          </Box>
          {appointment.autoDiagnostic && appointment.autoDiagnostic.photo && (
            <Box
              width={isMobile ? '100%' : '200'}
              mt={3}
              mb={2}
              sx={{
                borderRadius: 6,
                boxShadow: 4,
                overflow: 'hidden',
                minHeight: 150,
              }}>
              <img
                style={{objectFit: 'cover', display: 'block'}}
                width="100%"
                height="100%"
                src={appointment.autoDiagnostic.photo.contentUrl}
                alt="Photo autodiag"
              />
            </Box>
          )}
          {proposeOtherSlot && (
            <Box
              pt={2}
              width="100%"
              display="flex"
              alignItems={'end'}
              flexDirection="column">
              <Box
                width="100%"
                display="flex"
                flexDirection={isMobile ? 'column' : 'row'}
                gap={2}>
                <FormControl sx={{width: isMobile ? '100%' : '50%'}}>
                  <InputLabel id="select_date_label">Jour</InputLabel>
                  <Select
                    labelId="select_date_label"
                    id="select_date"
                    value={selectedDate}
                    label="Jour"
                    onChange={handleDateChange}>
                    {dates.map((date) => (
                      <MenuItem key={date} value={date}>
                        {formatDateInSelect(date)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl sx={{width: isMobile ? '100%' : '50%'}}>
                  <InputLabel id="select_time_label">Heure</InputLabel>
                  <Select
                    labelId="select_time_label"
                    id="select_time"
                    value={selectedTime}
                    label="Heure"
                    onChange={handleTimeChange}>
                    {times.map((time) => (
                      <MenuItem key={time} value={time}>
                        {time}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box
                mt={1}
                display="flex"
                justifyContent="center"
                alignItems="center"
                gap={1}>
                <Button
                  color="error"
                  size="small"
                  variant="outlined"
                  onClick={() => setProposeOtherSlot(false)}>
                  Annuler
                </Button>
                <Button
                  sx={{width: 'fit-content'}}
                  disabled={!selectedDate || !selectedTime}
                  size="small"
                  variant="contained"
                  onClick={sendNewSlot}
                  startIcon={
                    loadingNewSlot && (
                      <CircularProgress size={18} sx={{color: 'white'}} />
                    )
                  }>
                  Valider
                </Button>
              </Box>
              {successMessage && (
                <Alert color="success" sx={{mt: 2, width: '100%'}}>
                  {successMessage}
                </Alert>
              )}
              {errorMessage && (
                <Alert color="error" sx={{mt: 2, width: '100%'}}>
                  {errorMessage}
                </Alert>
              )}
            </Box>
          )}
        </>
      </DialogContent>
      {appointment.status !== 'cancel' && appointment.status !== 'refused' && (
        <DialogActions sx={{p: 2}}>
          <AppointmentActions
            appointment={appointment}
            closeModal={() => handleCloseModal(true)}
            proposeOtherSlot={proposeOtherSlot}
            handleClickProposeOtherSlot={handleClickProposeOtherSlot}
          />
        </DialogActions>
      )}
    </Dialog>
  );
};

export default ModalShowAppointment;
