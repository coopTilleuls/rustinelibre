import React, {PropsWithRef, useState} from 'react';
import {
    Stack,
    Card,
    CardContent,
    CardMedia,
    Typography, Box, Button, CircularProgress,
} from '@mui/material';
import {apiImageUrl} from '@helpers/apiImagesHelper';
import {formatDate} from 'helpers/dateHelper';
import {Appointment} from "@interfaces/Appointment";
import Link from "next/link";
import {appointmentResource} from "@resources/appointmentResource";

interface AppointmentCardProps extends PropsWithRef<any> {
    appointment: Appointment;
    future: boolean;
    fetchAppointments: () => void;
}

export const AppointmentCard = ({appointment, future, fetchAppointments}: AppointmentCardProps): JSX.Element => {

    const [loading, setLoading] = useState<boolean>(false);

    const cancelAppointment = async (appointment: Appointment) => {

        setLoading(true);
        await appointmentResource.updateAppointmentStatus(appointment.id, {
            transition: 'cancellation'
        });

        await fetchAppointments();
        setLoading(false);
    }

    return (
        <Card
            sx={{
                boxShadow: 0,
                border: (theme) => `4px solid ${theme.palette.grey[300]}`,
                display: 'flex',
                height: '200px'
            }}
        >
            <CardMedia
                component="img"
                sx={{
                    width: {xs: 50, md: 100},
                    height: {xs: 50, md: 100},
                    p: 2,
                    borderRadius: '50%',
                }}
                image={
                    appointment.repairer.thumbnail
                        ? apiImageUrl(appointment.repairer.thumbnail.contentUrl)
                        : 'https://cdn.cleanrider.com/uploads/2021/04/prime-reparation-velo_140920-3.jpg'
                }
                alt="Photo du réparateur"
            />
            <CardContent
                sx={{
                    pl: 0,
                    pr: 2,
                    py: 2,
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                <Stack spacing={{xs: 1, md: 2}}>
                    <div>
                        <Typography
                            fontSize={{xs: 16, md: 24}}
                            fontWeight={600}
                            sx={{wordBreak: 'break-word'}}>
                            {formatDate(appointment.slotTime)}
                        </Typography>
                    </div>
                    <div>
                        <Typography fontSize={{xs: 12, md: 16}}>
                            <strong>{appointment.repairer.name}</strong>
                        </Typography>
                        <Typography fontSize={{xs: 12, md: 16}}>
                            <strong>
                                {appointment.repairer.streetNumber}
                                {appointment.repairer.street},
                                {appointment.repairer.postcode}
                                {appointment.repairer.city}
                            </strong>
                        </Typography>
                        {appointment.autoDiagnostic && <Typography color="text.secondary" fontSize={{xs: 12, md: 16, mt: 10}}>
                            {appointment.autoDiagnostic.prestation}
                            </Typography>
                        }
                    </div>
                    <Box sx={{display: 'inline-flex'}}>
                        {future && <Box>
                            <Button variant="outlined" color={`warning`} size="small" onClick={() => cancelAppointment(appointment)}>
                                {loading ? <CircularProgress /> : 'Annuler le RDV'}
                            </Button>
                            {!appointment.discussion && <Button onClick={() => cancelAppointment(appointment)} disabled={true} variant="contained" size="small" sx={{marginLeft: '5px'}}>
                                Envoyer un message
                            </Button>}
                            {appointment.discussion && <Link href={`/messagerie/${appointment.discussion.id}`}><Button variant="contained" size="small" sx={{marginLeft: '5px'}}>
                                Envoyer un message
                            </Button></Link>}
                        </Box>}
                        {!future && <Box>
                            <Link href={`/reparateur/${appointment.repairer.id}`}><Button variant="outlined" size="small" sx={{marginLeft: '5px'}}>
                                Reprendre RDV
                            </Button></Link>
                        </Box>}
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
};
