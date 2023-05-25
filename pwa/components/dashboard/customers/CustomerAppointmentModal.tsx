import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import {Appointment} from "@interfaces/Appointment";
import {Customer} from "@interfaces/Customer";
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
                width={{xs: '85%', md: '70%'}}
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
