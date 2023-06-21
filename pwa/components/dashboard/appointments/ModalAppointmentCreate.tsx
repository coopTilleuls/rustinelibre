import React, {ChangeEvent, useEffect, useState} from 'react';
import {
  TextField,
  Autocomplete,
  Button,
  Stack,
  Typography,
  Alert,
} from '@mui/material';
import {customerResource} from '@resources/customerResource';
import Box from '@mui/material/Box';
import {Customer} from '@interfaces/Customer';
import {User} from '@interfaces/User';
import {appointmentResource} from '@resources/appointmentResource';
import {useAccount} from '@contexts/AuthContext';
import {RequestBody} from '@interfaces/Resource';
import {Repairer} from '@interfaces/Repairer';
import {RepairerEmployee} from '@interfaces/RepairerEmployee';
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

interface AppointmentCreateProps {
  repairer: Repairer
  appointmentSelectedDate: string | null;
  openModal: boolean;
  handleCloseModal: () => void;
  handleRedirectToAgenda?: () => void
}
export const ModalAppointmentCreate = ({repairer, appointmentSelectedDate, openModal, handleCloseModal,  handleRedirectToAgenda}: AppointmentCreateProps ): JSX.Element => {
  const {user} = useAccount({});
  const [currentRepairer, setCurrentRepairer] = useState<Repairer>(repairer);
  const [loadingList, setLoadingList] = useState<boolean>(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerInput, setCustomerInput] = useState<string>('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [tunnelStep, setTunnelStep] = useState<string>('');
  const [slotSelected, setSlotSelected] = useState<string>();
  const [selectedDate, setSelectedDate]= useState<string | null>(appointmentSelectedDate? appointmentSelectedDate : null)
  const [prestation, setPrestation] = useState<string>('');
  const [selectedBikeType, setSelectedBikeType]= useState<BikeType | null>(null);
  const [photo, setPhoto]= useState<MediaObject | null>(null)
  const [newAppointment, setNewAppointment] = useState<Appointment | null>(null)
  const [comment, setComment] = useState<string>('');

  const fetchCustomers = async () => {
    setLoadingList(true);
    const response = await customerResource.getAll(true, {
      userSearch: customerInput,
    });
    setCustomers(response['hydra:member']);
    setLoadingList(false);
  };

  useEffect(() => {
    if (customerInput.length >= 2) {
      fetchCustomers();
    }
  }, [customerInput]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if(selectedDate){
      setSlotSelected(selectedDate)
    } else {
      setSlotSelected(currentRepairer.firstSlotAvailable)
    }
  }, [currentRepairer.firstSlotAvailable, selectedDate]);

  const handleCustomerChange = async (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): Promise<void> => {
    setCustomerInput(event.target.value);
  };

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    handleConfirmAppointment(customer);
    setTunnelStep('customerSelected')
  };

  const slotDate = new Date(slotSelected!).toLocaleString('fr-FR', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });

  const handleConfirmAppointment = async (customer: Customer) => {
    if (!user || !repairer || !customer || !slotSelected) {
      return;
    }

    const requestBody: RequestBody = {
      repairer: repairer['@id'],
      slotTime: slotSelected,
      customer: customer['@id'],
    };
    setNewAppointment(await appointmentResource.post(requestBody));
  };
  const handleAddInformations = async ()=>{
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

      await autoDiagnosticResource.post(requestBody
      );
    }
    if(selectedBikeType || comment) {
      const putRequest: RequestBody = {
      };

      if (selectedBikeType) {
        putRequest['bikeType'] = selectedBikeType['@id'];
      }
      if (comment) {
        putRequest['comment'] = comment;
      }
    await appointmentResource.put(newAppointment['@id'], putRequest)
    }
    await appointmentResource.updateAppointmentStatus(newAppointment.id, {
      transition: 'validated_by_repairer',
    });
    setTunnelStep('success');
    setTimeout(() => {
      handleCloseModal();
      router.push(`/sradmin/agenda?selectedDate=${slotSelected}`)
      setSelectedCustomer(null);
      setCustomerInput('');
      setTunnelStep('')
    }, 3000);
  }

  return (
      <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="Créer un rendez-vous"
          aria-describedby="popup_appointment_create">
        <Stack
            position={'absolute'}
            top={'50%'}
            left={'50%'}
            width={{xs: '85%', md: '40%'}}
            maxWidth={700}
            p={4}
            boxShadow={24}
            sx={{
              backgroundColor: 'background.paper',
              transform: 'translate(-50%, -50%)',
            }}>
          <Typography align="justify" sx={{mt: 2}}>
            {`Rendez-vous le ${slotDate} `}
          </Typography>
          {selectedCustomer &&
          <Typography align="justify" sx={{mt: 2}}>
            {`Avec ${selectedCustomer?.firstName} ${selectedCustomer?.lastName} `}
          </Typography>
          }
          {tunnelStep == '' &&(
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
            onChange={(event, value) => handleSelectCustomer(value as User)}
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
          )}
          {tunnelStep == 'customerSelected' &&(
          <Box>
            <AppointmentCreateAddPrestation prestation={prestation} setPrestation={setPrestation}/>
            <AppointmentCreateAddBikeType selectedBikeType={selectedBikeType} setSelectedBikeType={setSelectedBikeType}/>
            <AppointmentCreateAddPhoto photo={photo} setPhoto={setPhoto}/>
            <AppointmentCreateAddComment comment={comment} setComment={setComment}/>
            <Button onClick={handleAddInformations} variant="contained" sx={{my: 2}}>
              Enregistrer le rendez vous
            </Button>
          </Box>
          )}
        {tunnelStep == 'success' && (
          <Alert sx={{width: '100%'}} severity="success">
            Rendez-vous créé avec succès
          </Alert>
        )}
        </Stack>
      </Modal>
  );
};

export default ModalAppointmentCreate;
