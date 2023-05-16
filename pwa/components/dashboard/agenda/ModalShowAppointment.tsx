import React, {useEffect, useState} from "react";
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import {CircularProgress} from "@mui/material";
import {RequestBody} from "@interfaces/Resource";
import {openingHoursResource} from "@resources/openingHours";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import {appointmentResource} from "@resources/appointmentResource";
import {Appointment} from "@interfaces/Appointment";

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

type ModalShowAppointmentProps = {
    id: string;
    openModal: boolean;
    handleCloseModal: () => void;
};

const ModalShowAppointment = ({id, openModal, handleCloseModal}: ModalShowAppointmentProps): JSX.Element => {

    const [loading, setLoading] = useState<boolean>(false);
    const [appointment, setAppointment] = useState<Appointment|null>(null);

    useEffect(() => {
        fetchAppointment();
    }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

    const fetchAppointment = async () => {
        const appointmentsFetch = await appointmentResource.get(id, true);
        setAppointment(appointmentsFetch);
    }

    return (
        <Modal
            open={openModal}
            onClose={() => handleCloseModal()}
            aria-labelledby="Show appointment"
            aria-describedby="popup_show_appointment"
        >
            <Box sx={style}>
                <Box sx={{ mt: 1 }}>
                    {loading && <CircularProgress />}
                    {!loading && appointment &&
                        <Box>
                            {appointment.autoDiagnostic && <Typography variant="h5">{appointment.autoDiagnostic.prestation}</Typography>}
                            Client : ${appointment.customer.firstName} ${appointment.customer.lastName}
                        </Box>
                    }

                </Box>
            </Box>
        </Modal>
    )
}

export default ModalShowAppointment;
