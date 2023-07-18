import React, {ChangeEvent, useEffect, useState} from 'react';
import {
  TextField,
  Autocomplete,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import {useTheme} from '@mui/material/styles';
import {customerResource} from '@resources/customerResource';
import Box from '@mui/material/Box';
import {Customer} from '@interfaces/Customer';
import {User} from '@interfaces/User';
import {appointmentResource} from '@resources/appointmentResource';
import {useAccount} from '@contexts/AuthContext';
import {RequestBody} from '@interfaces/Resource';
import {Repairer} from '@interfaces/Repairer';
import AppointmentCreateAddPhoto from '@components/dashboard/appointments/AppointmentCreateAddPhoto';
import AppointmentCreateAddPrestation from '@components/dashboard/appointments/AppointmentCreateAddPrestation';
import AppointmentCreateAddBikeType from '@components/dashboard/appointments/AppointmentCreateAddBikeType';
import {BikeType} from '@interfaces/BikeType';
import {MediaObject} from '@interfaces/MediaObject';
import {autoDiagnosticResource} from '@resources/autoDiagResource';
import {Appointment} from '@interfaces/Appointment';
import AppointmentCreateAddComment from './AppointmentCreateAddComment';
import router from 'next/router';
import CloseIcon from '@mui/icons-material/Close';
import {errorRegex} from '@utils/errorRegex';
import {DatePicker, frFR, TimePicker} from '@mui/x-date-pickers';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, {Dayjs} from 'dayjs';
import 'dayjs/locale/fr';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import {padNumber} from '@helpers/dateHelper';
import {isItinerant} from '@helpers/rolesHelpers';
import dynamic from 'next/dynamic';
const PinMap = dynamic(() => import('@components/rendez-vous/PinMap'), {
  ssr: false,
});

interface AppointmentCreateProps {
  repairer: Repairer;
  appointmentSelectedDate: string | null;
  openModal: boolean;
  handleCloseModal: (refresh: boolean) => void;
  handleRedirectToAgenda?: () => void;
}

const ModalAppointmentCreate = ({
  repairer,
  appointmentSelectedDate,
  openModal,
  handleCloseModal,
}: AppointmentCreateProps): JSX.Element => {
  const {user} = useAccount({});
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerInput, setCustomerInput] = useState<string>('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [success, setSuccess] = useState<boolean>(false);
  const [slotSelected, setSlotSelected] = useState<string>();
  const selectedDate = appointmentSelectedDate ? appointmentSelectedDate : null;
  const [prestation, setPrestation] = useState<string>('');
  const [selectedBikeType, setSelectedBikeType] = useState<BikeType | null>(
    null
  );
  const [photo, setPhoto] = useState<MediaObject | null>(null);
  const [newAppointment, setNewAppointment] = useState<Appointment | null>(
    null
  );
  const [comment, setComment] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [details, setDetails] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pickedDate, setPickedDate] = React.useState<Dayjs | null>(null);
  const [pickedTime, setPickedTime] = React.useState<Dayjs | null>(null);
  const [latitude, setLatitude] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const isItinerantRepairer = user && isItinerant(user);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  dayjs.extend(timezone);
  dayjs.extend(utc);
  const fetchCustomers = async () => {
    const response = await customerResource.getAll(true, {
      userSearch: customerInput,
    });
    setCustomers(response['hydra:member']);
  };

  useEffect(() => {
    if (customerInput.length >= 2) {
      fetchCustomers();
    }
  }, [customerInput]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (selectedDate) {
      setSlotSelected(selectedDate);
      setPickedDate(dayjs(selectedDate));
      setPickedTime(dayjs(selectedDate));
    } else {
      if (pickedTime || pickedDate) {
        let newDate = `${pickedDate?.year()}-${pickedDate?.month()}-${pickedDate?.day()}T${pickedTime?.hour()}:${pickedTime?.minute()}:00`;
        setSlotSelected(newDate);
      }
    }
  }, [selectedDate]);

  useEffect(() => {
    if (!details && newAppointment) {
      handleSuccess();
    }
  }, [details, newAppointment]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCustomerChange = async (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): Promise<void> => {
    setCustomerInput(event.target.value);
  };

  const handleSelectCustomer = (customer: Customer): void => {
    setSelectedCustomer(customer);
  };

  const slotDate = new Date(slotSelected!).toLocaleString('fr-FR', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });

  const handleCreateAppointment = async (selectedCustomer: Customer) => {
    setLoading(true);
    if (!user || !repairer || !selectedCustomer || !slotSelected) {
      return;
    }

    const requestBody: RequestBody = {
      repairer: repairer['@id'],
      slotTime: slotSelected,
      customer: selectedCustomer['@id'],
    };

    if (isItinerantRepairer && address && latitude && longitude) {
      requestBody['address'] = address;
      requestBody['latitude'] = latitude.toString();
      requestBody['longitude'] = longitude.toString();
    }

    try {
      setErrorMessage(null);
      const appointment = await appointmentResource.post(requestBody);
      setNewAppointment(appointment);
      if (!details) {
        handleSuccess();
      }
    } catch (e: any) {
      setErrorMessage(e.message?.replace(errorRegex, '$2'));
    }
    setLoading(false);
  };

  const handleAddInformations = async () => {
    setLoading(true);
    setDetails(true);
    if (!newAppointment) {
      return;
    }

    if (prestation || photo) {
      const requestBody: RequestBody = {
        appointment: newAppointment['@id'],
      };
      if (prestation) {
        requestBody['prestation'] = prestation;
      }
      if (photo) {
        requestBody['photo'] = photo['@id'];
      }

      try {
        await autoDiagnosticResource.post(requestBody);
      } catch (e: any) {
        setErrorMessage(e.message?.replace(errorRegex, '$2'));
        setLoading(false);
        return;
      }
    }

    if (selectedBikeType || comment) {
      const putRequest: RequestBody = {};

      if (selectedBikeType) {
        putRequest['bikeType'] = selectedBikeType['@id'];
      }
      if (comment) {
        putRequest['comment'] = comment;
      }

      try {
        await appointmentResource.put(newAppointment['@id'], putRequest);
      } catch (e: any) {
        setErrorMessage(e.message?.replace(errorRegex, '$2'));
        setLoading(false);
        return;
      }
    }
    setLoading(false);
    if (!errorMessage) {
      handleSuccess();
    }
  };

  const handleCreateWithoutDetails = async (selectedCustomer: Customer) => {
    await setDetails(false);
    handleCreateAppointment(selectedCustomer);
  };

  const handleDatePicker = (newValue: dayjs.Dayjs | null) => {
    if (newValue && newValue.year() && newValue.month() && newValue.date()) {
      let month = padNumber(newValue.month() + 1);
      let day = padNumber(newValue.date());
      let newDate = `${newValue.year()}-${month}-${day}`;
      setPickedDate(dayjs(newDate));
      setSlotSelected(`${newDate}T${pickedTime?.format('HH:mm')}`);
    }
    if (
      !newValue ||
      isNaN(newValue.year()) ||
      isNaN(newValue.month()) ||
      isNaN(newValue.date())
    ) {
      setPickedDate(null);
    }
  };

  const handleTimePicker = (newValue: dayjs.Dayjs | null) => {
    if (newValue && newValue.hour() !== null && newValue.minute() !== null) {
      let hour = padNumber(newValue.hour());
      let minutes = padNumber(newValue.minute());
      let newTime = `${hour}:${minutes}:00`;
      setPickedTime(dayjs(`2023-01-01T${newTime}`));
      setSlotSelected(`${pickedDate?.format('YYYY-MM-DD')}T${newTime}`);
    }
    if (!newValue || isNaN(newValue.hour()) || isNaN(newValue.minute())) {
      setPickedTime(null);
    }
  };
  const cancelPinMap = () => {
    return;
  };

  const confirmPinMap = () => {
    return;
  };

  const handleResetStates = () => {
    setSelectedCustomer(null);
    setCustomers([]);
    setCustomerInput('');
    setNewAppointment(null);
    setSelectedBikeType(null);
    setPrestation('');
    setPhoto(null);
    setComment('');
    setPickedTime(null);
    setPickedDate(null);
    setSlotSelected(undefined);
    setAddress('');
    setLatitude('');
    setLongitude('');
    handleCloseModal(false);
  };

  const handleSuccess = () => {
    setSuccess(true);
    router.push(`/sradmin/agenda?selectedDate=${slotSelected}`);
    setTimeout(async () => {
      handleCloseModal(true);
      setSelectedCustomer(null);
      setCustomerInput('');
      setSuccess(false);
    }, 2000);
  };

  return (
    <Dialog
      open={openModal}
      onClose={handleResetStates}
      fullScreen={fullScreen}
      maxWidth={'xl'}
      aria-describedby="popup_appointment_create">
      <DialogTitle id="service-type-label">Création de rendez-vous</DialogTitle>
      <DialogContent
        sx={{
          overflowY: 'scroll',
          backgroundColor: 'background.paper',
        }}>
        <CloseIcon
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            cursor: 'pointer',
            fontSize: '2em',
          }}
          onClick={handleResetStates}
        />
        {slotSelected && pickedTime && pickedDate && (
          <Typography
            align="justify"
            sx={{display: {xs: 'none', md: 'block'}, my: 2}}>
            {`Rendez-vous le ${slotDate} `}
          </Typography>
        )}
        {!newAppointment && (
          <>
            {!address && (
              <Box>
                <LocalizationProvider
                  localeText={
                    frFR.components.MuiLocalizationProvider.defaultProps
                      .localeText
                  }
                  adapterLocale="fr"
                  dateAdapter={AdapterDayjs}>
                  {selectedDate && (
                    <InputLabel id="service-type-label" sx={{my: 2}}>
                      Modifier le créneau
                    </InputLabel>
                  )}
                  {!selectedDate && (
                    <InputLabel id="service-type-label" sx={{my: 2}}>
                      Choisir un créneau
                    </InputLabel>
                  )}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-evenly',
                      gap: 2,
                    }}>
                    <DatePicker
                      defaultValue={dayjs(selectedDate)}
                      format="DD/MM/YYYY"
                      onChange={(newValue) => handleDatePicker(newValue)}
                    />
                    <TimePicker
                      defaultValue={dayjs.tz(selectedDate, 'Europe/Paris')}
                      format="HH:mm"
                      onChange={(newValue) => handleTimePicker(newValue)}
                      ampm={false}
                    />
                  </Box>
                </LocalizationProvider>
                <Autocomplete
                  sx={{mt: 2, mb: 1}}
                  freeSolo
                  value={customerInput}
                  options={customers}
                  getOptionLabel={(customer) =>
                    typeof customer === 'string'
                      ? customer
                      : `${customer.firstName} ${customer.lastName} (${customer.email})`
                  }
                  onChange={(event, value) =>
                    handleSelectCustomer(value as User)
                  }
                  renderInput={(params) => (
                    <TextField
                      label="Client"
                      required
                      {...params}
                      value={customerInput}
                      onChange={(e) => handleCustomerChange(e)}
                    />
                  )}
                />
              </Box>
            )}
            {selectedCustomer && pickedDate && pickedTime && (
              <>
                {isItinerantRepairer && (
                  <PinMap
                    repairer={repairer}
                    latitude={latitude}
                    longitude={longitude}
                    cancelPinMap={cancelPinMap}
                    confirmPinMap={confirmPinMap}
                    setLatitude={setLatitude}
                    setLongitude={setLongitude}
                    address={address}
                    setAddress={setAddress}
                  />
                )}
                <DialogActions
                  sx={{
                    display: {md: 'flex'},
                    flexDirection: {xs: 'column', md: 'row'},
                    justifyContent: {xs: 'center', md: 'space-around'},
                    gap: {md: 4},
                  }}>
                  <Button
                    onClick={() => handleCreateAppointment(selectedCustomer)}
                    disabled={isItinerantRepairer! && !address}
                    variant="contained"
                    sx={{mt: 2, mb: {sm: 1, md: 2}, width: {xs: '100%'}}}>
                    {loading && <CircularProgress sx={{color: 'white'}} />}
                    {!loading && <Box>Créer et Compléter le rendez vous</Box>}
                  </Button>
                  <Button
                    onClick={() => handleCreateWithoutDetails(selectedCustomer)}
                    disabled={isItinerantRepairer! && !address}
                    variant="outlined"
                    sx={{mt: 2, mb: {sm: 1, md: 2}, width: {xs: '100%'}}}>
                    {loading && <CircularProgress sx={{color: 'outlined'}} />}
                    {!loading && <Box>Créer sans ajouter de détails</Box>}
                  </Button>
                </DialogActions>
              </>
            )}
          </>
        )}
        {newAppointment && details && (
          <Box>
            <Typography
              align="justify"
              sx={{display: {xs: 'none', md: 'block'}, mt: 2}}>
              {`Avec ${newAppointment.customer.firstName} ${newAppointment.customer.lastName} `}
            </Typography>
            <Box sx={{display: 'flex'}}>
              <AppointmentCreateAddPrestation
                prestation={prestation}
                setPrestation={setPrestation}
              />
              <AppointmentCreateAddBikeType
                selectedBikeType={selectedBikeType}
                setSelectedBikeType={setSelectedBikeType}
              />
            </Box>
            <AppointmentCreateAddPhoto photo={photo} setPhoto={setPhoto} />
            <AppointmentCreateAddComment
              comment={comment}
              setComment={setComment}
            />
            <DialogActions>
              <Button
                onClick={handleAddInformations}
                variant="contained"
                sx={{my: 2}}>
                {!loading && <Box>Ajouter les éléments au rendez vous</Box>}
                {loading && <CircularProgress sx={{color: 'white'}} />}
              </Button>
            </DialogActions>
          </Box>
        )}
        {success && (
          <Box>
            {!details && newAppointment && (
              <Typography
                align="justify"
                sx={{display: {xs: 'none', md: 'block'}, mt: 2}}>
                {`Avec ${newAppointment.customer.firstName} ${newAppointment.customer.lastName} `}
              </Typography>
            )}
            <Alert sx={{width: '100%'}} severity="success">
              Rendez-vous créé avec succès
            </Alert>
          </Box>
        )}
        {errorMessage && (
          <Typography color="error" textAlign="center" sx={{pt: 4}}>
            {errorMessage}
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ModalAppointmentCreate;
