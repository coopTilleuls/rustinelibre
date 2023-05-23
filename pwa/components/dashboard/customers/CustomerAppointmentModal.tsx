import React from 'react';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import {Appointment} from "@interfaces/Appointment";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import List from "@mui/material/List";
import {formatDate} from "@helpers/dateHelper";
import {apiImageUrl} from "@helpers/apiImagesHelper";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BuildIcon from '@mui/icons-material/Build';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import {Customer} from "@interfaces/Customer";
import {Button} from "@mui/material";
import AppointmentContent from "@components/dashboard/appointments/AppointmentContent";

type ModalAddBikeProps = {
    appointment: Appointment|null;
    customer: Customer;
    openModal: boolean;
    handleCloseModal: (refresh: boolean|undefined) => void;
};

const CustomerAppointmentModal = ({
                          appointment,
                          customer,
                          openModal,
                          handleCloseModal,
                      }: ModalAddBikeProps): JSX.Element => {


    return (
        <Modal
            open={openModal}
            onClose={() => handleCloseModal(false)}
            aria-labelledby="Ajouter un vélo"
            aria-describedby="popup_add_bike">
            <Box
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

                {appointment && <AppointmentContent appointment={appointment} handleCloseModal={handleCloseModal} />}
            </Box>
        </Modal>
    );
};

export default CustomerAppointmentModal;
