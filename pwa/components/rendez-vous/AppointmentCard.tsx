import React, {PropsWithRef} from 'react';
import Link from 'next/link';
import {
    Stack,
    Card,
    CardContent,
    CardMedia,
    Typography,
} from '@mui/material';
import {apiImageUrl} from '@helpers/apiImagesHelper';
import {formatDate} from 'helpers/dateHelper';
import {Appointment} from "@interfaces/Appointment";

interface AppointmentCardProps extends PropsWithRef<any> {
    appointment: Appointment;
}

export const AppointmentCard = ({appointment}: AppointmentCardProps): JSX.Element => {
    
    return (
        <Link href={`/reparateur/${appointment.repairer.id}`} style={{textDecoration: 'none'}}>
            <Card
                sx={{
                    boxShadow: 0,
                    border: (theme) => `4px solid ${theme.palette.grey[300]}`,
                    display: 'flex',
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
                                {appointment.repairer.name}
                            </Typography>
                        </div>
                        <div>
                            <Typography
                                color="text.secondary"
                                fontSize={{xs: 12, md: 16}}
                                fontWeight={300}>
                                Date du rendez-vous :
                            </Typography>
                            <Typography color="text.secondary" fontSize={{xs: 12, md: 16}}>
                                <strong>{formatDate(appointment.slotTime)}</strong>
                            </Typography>
                        </div>
                    </Stack>
                </CardContent>
            </Card>
        </Link>
    );
};
