import {NextPageWithLayout} from 'pages/_app';
import React, {useEffect, useState} from 'react';
import Head from 'next/head';
import WebsiteLayout from '@components/layout/WebsiteLayout';
import {Box, Button, CircularProgress, Typography} from '@mui/material';
import {RepairerFormProvider} from "@contexts/RepairerFormContext";
import {appointmentResource} from "@resources/appointmentResource";
import {useRouter} from "next/router";
import {Appointment} from "@interfaces/Appointment";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import Link from "next/link";
import {formatDate} from '@helpers/dateHelper';

const AppointmentSummary: NextPageWithLayout = () => {

    const router = useRouter();
    const {id} = router.query;
    const [loading, setLoading] = useState<boolean>(false);
    const [appointment, setAppointment] = useState<Appointment|null>(null);

    async function fetchAppointment() {
        if (id) {
            setLoading(true);
            const appointmentFetched = await appointmentResource.getById(id.toString());
            setLoading(false);
            setAppointment(appointmentFetched);

            if (!appointmentFetched) {
                return router.push('/');
            }
        }
    }

    useEffect(() => {
        fetchAppointment();
    }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <RepairerFormProvider>
            <div style={{width: '100vw', overflowX: 'hidden'}}>
                <Head>
                    <title>Récapitulatif</title>
                </Head>
                <WebsiteLayout />
                <main>
                    <Box
                        sx={{
                            bgcolor: 'background.paper',
                            mt: {md: 8},
                            mb: 10,
                        }}>
                        {loading && <CircularProgress />}
                        {
                            !loading && appointment && <Box sx={{border: '1px solid black', padding: '10px'}}>

                                <Typography
                                    component="p"
                                    align="center"
                                    sx={{mt: 2}}>
                                    Votre demande de rendez vous
                                </Typography>
                                <EventAvailableIcon sx={{marginLeft: '30%', fontSize: '8em'}} />
                                <Box>
                                    <br/>
                                    <Typography align="center">
                                        {formatDate(appointment.slotTime)}
                                    </Typography>
                                    <Typography align="center">
                                        Chez {appointment.repairer.name}
                                    </Typography>
                                    {appointment.autoDiagnostic &&
                                        <Typography align="center">
                                            Prestation : {appointment.autoDiagnostic.prestation}
                                        </Typography>
                                    }
                                </Box>

                                <Link href="/">
                                    <Button variant="outlined" sx={{marginTop:'30px', marginLeft: '40%'}}>
                                        Retour à l'accueil
                                    </Button><br/>
                                </Link>
                            </Box>
                        }
                    </Box>
                </main>
            </div>
        </RepairerFormProvider>
    );
};

export default AppointmentSummary;
