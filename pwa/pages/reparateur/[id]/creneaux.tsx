import {NextPageWithLayout} from 'pages/_app';
import React, {useEffect, useState} from 'react';
import Head from 'next/head';
import {useRouter} from 'next/router';
import {repairerResource} from '@resources/repairerResource';
import WebsiteLayout from '@components/layout/WebsiteLayout';
import {Repairer} from '@interfaces/Repairer';
import Link from "next/link";
import {Container, CircularProgress, Box, Typography, Paper, Stack, Button} from '@mui/material';
import useMediaQuery from "@hooks/useMediaQuery";
import {appointmentResource} from "@resources/appointmentResource";
import {useAccount} from "@contexts/AuthContext";

const RepairerSlots: NextPageWithLayout = () => {
    const router = useRouter();
    const [tunnelStep, setTunnelStep] = useState<string>('slots');
    const [slotSelected, setSlotSelected] = useState<string|null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [repairer, setRepairer] = useState<Repairer | null>(null);
    const isMobile = useMediaQuery('(max-width: 1024px)');
    const {id} = router.query;
    const user = useAccount({});

    async function fetchRepairer() {
        if (id) {
            setLoading(true);
            const repairer = await repairerResource.getById(id.toString());
            setLoading(false);
            setRepairer(repairer);
        }
    }

    useEffect(() => {
        fetchRepairer();
    }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSelectSlot = (): void => {
        setSlotSelected('2023-05-24T12:00:00+00:00'); // @todo click select real slot
        setTunnelStep('optionalPage');
    }

    const confirmAppointmentRequest = () => {
        setTunnelStep('confirm');
    }

    const handleConfirmAppointment = async() => {
        if (!repairer || !user || !slotSelected) {
            return;
        }

        const newAppointment = await appointmentResource.post({
            'repairer': repairer['@id'],
            'slotTime': slotSelected
        });

        if (newAppointment) {
            router.push(`/rendez-vous/${newAppointment.id}/auto-diagnostic`)
        }
    }

    const handleLogin = (): void => {
        router.push('/login?next=' + encodeURIComponent(router.asPath))
    }

    const handleRegistration = (): void => {
        router.push('/inscription?next=' + encodeURIComponent(router.asPath))
    }

    return (
        <div style={{width: '100vw', overflowX: 'hidden'}}>
            <Head>
                <title>Demande de rendez vous {repairer?.name}</title>
            </Head>
            <WebsiteLayout />
            <main>
                <Box
                    sx={{
                        bgcolor: 'background.paper',
                        mt: {md: 8},
                        mb: 10,
                    }}>
                    {loading && <CircularProgress sx={{marginLeft: '30%'}} />}

                    {!loading && repairer && <Box>
                        <Container maxWidth="md" sx={{padding: {xs: 0}}}>
                            <Paper elevation={isMobile ? 0 : 4} sx={{p: 3}}>
                                {tunnelStep == 'slots' && <Link href={`/reparateur/${repairer.id}`}>
                                    <Button variant="outlined">Retour</Button>
                                </Link>}
                                {tunnelStep == 'optionalPage' && <Button variant="outlined" onClick={() => setTunnelStep('slots')}>
                                    Consulter les créneaux
                                </Button>}
                                {tunnelStep == 'confirm' && <Button variant="outlined" onClick={() => setTunnelStep('optionalPage')}>
                                    Précédent
                                </Button>}
                                    <Stack
                                    spacing={5}
                                    marginBottom={4}
                                    sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                        {!user && <Box>
                                                <Typography
                                                    component="p"
                                                    align="center"
                                                    sx={{mt: 2}}>
                                                    Connectez vous ou inscrivez vous pour envoyer la demande au réparateur
                                                </Typography>

                                                <Button onClick={handleLogin} variant="outlined" sx={{marginTop:'30px'}}>
                                                    Se connecter
                                                </Button>

                                                <Button onClick={handleRegistration} variant="outlined" sx={{marginTop:'30px'}}>
                                                    S&apos;inscrire
                                                </Button>
                                            </Box>
                                        }
                                        {user && tunnelStep == 'slots' &&
                                            <Box>
                                                <Typography
                                                    component="h2"
                                                    align="center"
                                                    fontSize={{xs: 34, md: 50}}
                                                    fontWeight={600}
                                                    sx={{mt: 2}}>
                                                    Choisissez votre créneau
                                                </Typography>
                                                <Button variant="outlined" value="2023-04-24T10:00:00" onClick={handleSelectSlot}>
                                                    10H30
                                                </Button>
                                                <Button variant="outlined" value="2023-04-24T11:00:00" onClick={handleSelectSlot}>
                                                    11H00
                                                </Button>
                                                <Button variant="outlined" value="2023-04-24T12:00:00" onClick={handleSelectSlot}>
                                                    11H30
                                                </Button>
                                            </Box>
                                        }
                                        {user && tunnelStep == 'optionalPage' &&
                                            <Box>
                                                <Typography
                                                    component="h2"
                                                    align="center"
                                                    fontSize={{xs: 34, md: 50}}
                                                    fontWeight={600}
                                                    sx={{mt: 2}}>
                                                    À lire avant de prendre rendez vous
                                                </Typography>
                                                <Typography
                                                    paragraph
                                                    fontSize={{xs: 16, md: 18}}
                                                    color="text.secondary">
                                                    {repairer.optionalPage}
                                                </Typography>

                                                <Typography fontSize={{xs: 16, md: 18, textAlign: 'center'}}>
                                                    <Button variant="outlined" sx={{marginTop:'30px'}} onClick={confirmAppointmentRequest}>
                                                        Suivant
                                                    </Button>
                                                </Typography>
                                            </Box>
                                        }
                                        {user && tunnelStep == 'confirm' &&
                                            <Box>
                                                <Typography
                                                    component="h2"
                                                    align="center"
                                                    fontSize={{xs: 34, md: 50}}
                                                    fontWeight={600}
                                                    sx={{mt: 2}}>
                                                    Récapitulatif
                                                </Typography>
                                                <Typography
                                                    align="justify"
                                                    sx={{mt: 2}}>
                                                    17 février chez VéloBobos
                                                </Typography>

                                                <Box>
                                                    <Button onClick={handleConfirmAppointment} variant="outlined" sx={{marginTop:'30px'}}>
                                                        Confirmer le rendez vous
                                                    </Button>
                                                </Box>
                                            </Box>
                                        }
                                </Stack>
                            </Paper>
                        </Container>
                    </Box>}

                </Box>
            </main>
        </div>
    );
};

export default RepairerSlots;
