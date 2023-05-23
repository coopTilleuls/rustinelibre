import React, {useEffect, useState} from "react";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import {CircularProgress} from "@mui/material";
import {appointmentResource} from "@resources/appointmentResource";
import {Appointment} from "@interfaces/Appointment";
import {formatDate} from "@helpers/dateHelper";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import {apiImageUrl} from "@helpers/apiImagesHelper";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HandymanIcon from '@mui/icons-material/Handyman';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Link from "next/link";
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
    id: string;
    openModal: boolean;
    handleCloseModal: (refresh: boolean|undefined) => void;
};

const ModalShowAppointment = ({id, openModal, handleCloseModal}: ModalShowAppointmentProps): JSX.Element => {

    const [loading, setLoading] = useState<boolean>(false);
    const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
    const [appointment, setAppointment] = useState<Appointment|null>(null);

    useEffect(() => {
        fetchAppointment();
    }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

    const fetchAppointment = async () => {
        setLoading(true);
        const appointmentsFetch = await appointmentResource.get(id, true);
        setAppointment(appointmentsFetch);
        setLoading(false)
    }

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
