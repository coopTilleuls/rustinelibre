import React, {useEffect, useState} from "react";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import {CircularProgress} from "@mui/material";
import {appointmentResource} from "@resources/appointmentResource";
import {Appointment} from "@interfaces/Appointment";
import AppointmentContent from "@components/dashboard/appointments/AppointmentContent";

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

type ModalShowAppointmentProps = {
    appointment: Appointment;
    openModal: boolean;
    handleCloseModal: (refresh: boolean|undefined) => void;
};

const ModalShowAppointment = ({appointment, openModal, handleCloseModal}: ModalShowAppointmentProps): JSX.Element => {

    const [loading, setLoading] = useState<boolean>(false);

    return (
        <Modal
            open={openModal}
            onClose={() => handleCloseModal(false)}
            aria-labelledby="Show appointment"
            aria-describedby="popup_show_appointment"
        >
            <Box sx={style}>
                <Box sx={{ mt: 1 }}>
                    {loading && <CircularProgress />}
                    {!loading && appointment &&
                        <AppointmentContent appointment={appointment} handleCloseModal={handleCloseModal} />
                    }
                </Box>
            </Box>
        </Modal>
    )
}

export default ModalShowAppointment;
