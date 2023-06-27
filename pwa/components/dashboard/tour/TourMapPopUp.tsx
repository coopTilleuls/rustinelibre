import React, {PropsWithRef, useContext, useState} from 'react';
import {Box, Button, Typography} from '@mui/material';
import {Appointment} from "@interfaces/Appointment";
import {getTimeFromDateAsString} from "@helpers/dateHelper";
import ModalShowAppointment from "@components/dashboard/agenda/ModalShowAppointment";

interface TourMapPopUpProps extends PropsWithRef<any> {
    appointment: Appointment;
}

export const TourMapPopUp = ({appointment}: TourMapPopUpProps): JSX.Element => {

    const [openModal, setOpenModal] = useState<boolean>(false);
    const [appointmentSelected, setAppointmentSelected] = useState<Appointment|null>(null);

    const handleCloseModal = (): void => {
        setOpenModal(false);
        setAppointmentSelected(null);
    };

    const handleClickShowAppointment = (appointment : Appointment): void => {
        setAppointmentSelected(appointment);
        setOpenModal(true);
    };

    const handleOpenGPS = (latitude: number, longitude: number) => {
        const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
        window.open(url, '_blank');
    };

    return (
        <Box
            sx={{
                boxShadow: 0,
                backgroundColor: 'white',
            }}>
            <Typography
                my={0}
                fontSize={14}
                fontWeight={600}
                sx={{wordBreak: 'break-word'}}>
                {`${appointment.customer.firstName} ${appointment.customer.lastName}`}
            </Typography>
            <Typography
                color="text.secondary"
                textTransform="capitalize"
                fontSize={12}>
                {appointment.address}
            </Typography>
            <Typography
                color="text.secondary"
                textTransform="capitalize"
                fontWeight={600}
                fontSize={12}>
                {getTimeFromDateAsString(appointment.slotTime)}
            </Typography>
            <Box textAlign="center" mt={2}>
                <Button variant="contained" onClick={() => handleOpenGPS(Number(appointment.latitude), Number(appointment.longitude))}>
                    Lancer le GPS
                </Button>
                <Button variant="outlined" onClick={() => handleClickShowAppointment(appointment)}>
                    Détail
                </Button>
            </Box>

            {appointmentSelected &&
                <ModalShowAppointment
                    appointment={appointmentSelected}
                    openModal={openModal}
                    handleCloseModal={handleCloseModal}
                />
            }
        </Box>
    );
};
