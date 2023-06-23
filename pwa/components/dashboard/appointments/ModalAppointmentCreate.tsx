import React, {ChangeEvent, useEffect, useState} from 'react';
import {
  TextField,
  Autocomplete,
  Button,
  Stack,
  Typography,
  Alert, CircularProgress,
} from '@mui/material';
import {customerResource} from '@resources/customerResource';
import Box from '@mui/material/Box';
import {Customer} from '@interfaces/Customer';
import {User} from '@interfaces/User';
import {appointmentResource} from '@resources/appointmentResource';
import {useAccount} from '@contexts/AuthContext';
import {RequestBody} from '@interfaces/Resource';
import {Repairer} from '@interfaces/Repairer';
import AppointmentCreateAddPhoto from "@components/dashboard/appointments/AppointmentCreateAddPhoto";
import AppointmentCreateAddPrestation from "@components/dashboard/appointments/AppointmentCreateAddPrestation";
import AppointmentCreateAddBikeType from "@components/dashboard/appointments/AppointmentCreateAddBikeType";
import Modal from "@mui/material/Modal";
import {BikeType} from "@interfaces/BikeType";
import {MediaObject} from "@interfaces/MediaObject";
import {autoDiagnosticResource} from "@resources/autoDiagResource";
import {Appointment} from "@interfaces/Appointment";
import AppointmentCreateAddComment from './AppointmentCreateAddComment';
import router from "next/router";
import CloseIcon from "@mui/icons-material/Close";
import {dateObjectAsString, getDateTimeZoned} from "@helpers/dateHelper";

interface AppointmentCreateProps {
  repairer: Repairer
  appointmentSelectedDate: string | null;
  openModal: boolean;
  handleCloseModal: (refresh: boolean) => void;
  handleRedirectToAgenda?: () => void
}

const ModalAppointmentCreate = ({repairer, appointmentSelectedDate, openModal, handleCloseModal,  handleRedirectToAgenda}: AppointmentCreateProps ): JSX.Element => {

  const {user} = useAccount({});
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerInput, setCustomerInput] = useState<string>('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [slotSelected, setSlotSelected] = useState<string>();
  const selectedDate = appointmentSelectedDate? appointmentSelectedDate : null;
  const [prestation, setPrestation] = useState<string>('');
  const [selectedBikeType, setSelectedBikeType]= useState<BikeType | null>(null);
  const [photo, setPhoto]= useState<MediaObject | null>(null)
  const [newAppointment, setNewAppointment] = useState<Appointment | null>(null)
  const [comment, setComment] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [details, setDetails] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    if (selectedDate){
      setSlotSelected(selectedDate)
    } else {
      const date = getDateTimeZoned( repairer.firstSlotAvailable)
      const stringDate = dateObjectAsString(date)
      setSlotSelected(stringDate)
    }
  }, [repairer.firstSlotAvailable, selectedDate]);

  const handleCustomerChange = async (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): Promise<void> => {
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
    setLoading(true)
    if (!user || !repairer || !selectedCustomer || !slotSelected) {
      return;
    }

    const requestBody: RequestBody = {
      repairer: repairer['@id'],
      slotTime: slotSelected,
      customer: selectedCustomer['@id'],
    };

    try {
     const appointment = await appointmentResource.post(requestBody);
     setNewAppointment(appointment)
    } catch (e) {
      setErrorMessage('Création du rendez-vous impossible, veuillez réessayer');
    }

    setLoading(false)
  };

  const handleAddInformations = async ()=>{
    setLoading(true)
    setDetails(true)
    if (!newAppointment) {
      return;
    }

    if(prestation || photo) {
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
      } catch (e) {
        setErrorMessage('Ajout d\'autodiagnostic impossible, veuillez réessayer');
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
        await appointmentResource.put(newAppointment['@id'], putRequest)
      } catch (e) {
        setErrorMessage('mise à jour du rendez-vous impossible, veuillez réessayer');
      }

    }
    setLoading(false)
    handleSuccess();
  }

  const handleSuccess = () => {
    setSuccess(true);
    setTimeout(async () => {
      handleCloseModal(true);
      router.push(`/sradmin/agenda?selectedDate=${slotSelected}`)
      setSelectedCustomer(null);
      setCustomerInput('');
      setSuccess(false)
    }, 3000);
  }

  const handleCreateWithoutDetails = (selectedCustomer: Customer) =>{
    setDetails(false)
    handleCreateAppointment(selectedCustomer);
    handleSuccess()
  }
  const handleResetStates = () => {
    setSelectedCustomer(null);
    setCustomers([]);
    setCustomerInput('');
    setNewAppointment(null);
    setSelectedBikeType(null);
    setPrestation('');
    setPhoto(null);
    setComment('');
    handleCloseModal(false);
  };

  return (
      <Modal
          open={openModal}
          onClose={handleResetStates}
          aria-labelledby="Créer un rendez-vous"
          aria-describedby="popup_appointment_create">
        <Stack
            position={'absolute'}
            top={'50%'}
            left={'50%'}
            width={{xs: '85%', md: '100%'}}
            maxWidth={900}
            p={4}
            boxShadow={24}
            sx={{
              overflow: 'scroll',
              backgroundColor: 'background.paper',
              transform: 'translate(-50%, -50%)',
            }}>
          <CloseIcon sx={{position: 'absolute', top: 10, right : 10, cursor: 'pointer', fontSize: '2em'}} onClick={handleResetStates} />
          <Typography align="justify" sx={{mt: 2}}>
            {`Rendez-vous le ${slotDate} `}
          </Typography>
          {!newAppointment &&(
              <>
                <Autocomplete
                  sx={{mt: 2, mb: 1}}
                  freeSolo
                  value={customerInput}
                  options={customers}
                  getOptionLabel={(customer) => typeof customer === 'string'
                      ? customer
                      : `${customer.firstName} ${customer.lastName} (${customer.email})`}
                  onChange={(event, value) => handleSelectCustomer(value as User)}
                  renderInput={(params) => (
                      <TextField
                          label="Client"
                          required
                          {...params}
                          value={customerInput}
                          onChange={(e) => handleCustomerChange(e)}/>
                  )}/>
                {loading && <CircularProgress />}
                {selectedCustomer &&
                <Box sx={{display:'flex', justifyContent:'space-around'}}>
                  <Button onClick={()=>handleCreateAppointment(selectedCustomer)} variant="contained" sx={{my: 2}}>
                  Créer et Compléter le rendez vous
                  </Button>
                  <Button onClick={()=>handleCreateWithoutDetails(selectedCustomer)} variant="outlined" sx={{my: 2}}>
                  Créer sans ajouter de détails
                  </Button>
                </Box>
                }
              </>
          )}
          {newAppointment && details &&(
          <Box>
            <Typography align="justify" sx={{mt: 2}}>
              {`Avec ${newAppointment.customer.firstName} ${newAppointment.customer.lastName} `}
            </Typography>
            <Box sx={{display:'flex'}}>
            <AppointmentCreateAddPrestation prestation={prestation} setPrestation={setPrestation}/>
            <AppointmentCreateAddBikeType selectedBikeType={selectedBikeType} setSelectedBikeType={setSelectedBikeType}/>
            </Box>
            <AppointmentCreateAddPhoto photo={photo} setPhoto={setPhoto}/>
            <AppointmentCreateAddComment comment={comment} setComment={setComment}/>
              {loading && <CircularProgress />}
              <Button onClick={handleAddInformations} variant="contained" sx={{my: 2}}>
                Ajouter les éléments au rendez vous
              </Button>
            </Box>
          )}
        {success && (
            <Box>
              {!details && newAppointment &&
                  <Typography align="justify" sx={{mt: 2}}>
                    {`Avec ${newAppointment.customer.firstName} ${newAppointment.customer.lastName} `}
                  </Typography>
              }
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
        </Stack>
      </Modal>
  );
};

export default ModalAppointmentCreate;
