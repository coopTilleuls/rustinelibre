import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import {appointmentResource} from '@resources/appointmentResource';
import {openingHoursResource} from '@resources/openingHours';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputLabel,
  MenuItem,
  FormControl,
  Typography,
} from '@mui/material';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import useMediaQuery from '@mui/material/useMediaQuery';
import {useTheme} from '@mui/material/styles';
import PedalBikeIcon from '@mui/icons-material/PedalBike';
import TodayIcon from '@mui/icons-material/Today';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import {formatDate, isPast} from '@helpers/dateHelper';
import {getAppointmentStatus} from '@helpers/appointmentStatus';
import {Appointment} from '@interfaces/Appointment';

type AppointmentContentProps = {
  appointmentProps: Appointment;
  handleCloseModal: (refresh: boolean | undefined) => void;
};

const AppointmentContent = ({
  appointmentProps,
  handleCloseModal,
}: AppointmentContentProps): JSX.Element => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [appointment, setAppointment] = useState<Appointment>(appointmentProps);
  const [loadingNewSlot, setLoadingNewSlot] = useState<boolean>(false);
  const [proposeOtherSlot, setProposeOtherSlot] = useState<boolean>(false);
  const [slotsAvailable, setSlotsAvailable] = useState<any>(null);
  const [dates, setDates] = useState<string[]>([]);
  const [times, setTimes] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | undefined>(
    undefined
  );
  const [selectedTime, setSelectedTime] = useState<string | undefined>('');

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
      const appointmentUpdate =
        await appointmentResource.updateAppointmentStatus(appointment.id, {
          transition: 'cancellation',
        });

      setAppointment(appointmentUpdate);
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
    setLoadingNewSlot(true);
    await appointmentResource.updateAppointmentStatus(appointment.id, {
      transition: 'propose_another_slot',
      slotTime: `${selectedDate} ${selectedTime}`,
    });
    setLoadingNewSlot(false);
    handleCloseModal(true);
  };

  return (
    <>
      <Typography id="appointment_title" fontSize={20} fontWeight={600}>
        {appointment.autoDiagnostic && appointment.autoDiagnostic.prestation}
      </Typography>
      <Box display="flex" flexDirection="column" gap={2}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" gap={2}>
            <AccountCircleIcon color="primary" />
            <Typography>Client:</Typography>
            <Typography>
              {appointment.customer.firstName} {appointment.customer.lastName}
            </Typography>
          </Box>
          <Box>
            <Link href={`/sradmin/messagerie/${appointment.discussion!.id}`}>
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
        {appointment.address && (
          <Box display="flex" gap={2}>
            <LocationOnIcon color="primary" />
            <Typography>Adresse:</Typography>
            <Typography>{appointment.address}</Typography>
          </Box>
        )}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" gap={2}>
            <CalendarMonthIcon color="primary" />
            <Typography>Date:</Typography> {formatDate(appointment.slotTime)}
          </Box>
          {appointment.status === 'validated' && (
            <Box>
              {isMobile ? (
                <IconButton
                  color="secondary"
                  disabled={isPast(appointment.slotTime)}
                  onClick={handleClickProposeOtherSlot}
                  sx={{
                    borderRadius: '50%',
                    padding: '8px',
                  }}>
                  <TodayIcon />
                </IconButton>
              ) : (
                <Button
                  size="small"
                  disabled={isPast(appointment.slotTime)}
                  color="secondary"
                  variant="outlined"
                  onClick={handleClickProposeOtherSlot}>
                  Modifier le rendez-vous
                </Button>
              )}
            </Box>
          )}
        </Box>
        {proposeOtherSlot && (
          <Box
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
                      {date}
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
          </Box>
        )}
        <Box display="flex" gap={2}>
          <CheckCircleOutlineIcon color="primary" />
          <Typography>Status:</Typography>
          <Typography>{getAppointmentStatus(appointment.status)}</Typography>
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
          mt={1}
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
    </>
  );
};

export default AppointmentContent;
