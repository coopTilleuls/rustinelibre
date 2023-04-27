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
import {autoDiagnosticResource} from "@resources/autoDiagResource";
import {AutoDiagnostic} from "@interfaces/AutoDiagnostic";
import {Appointment} from "@interfaces/Appointment";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";

const AutoDiag: NextPageWithLayout = () => {
    const router = useRouter();
    const [tunnelStep, setTunnelStep] = useState<string>('yesOrNo');
    const [prestation, setPrestation] = useState<string>('');
    const [slotSelected, setSlotSelected] = useState<string|null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [appointment, setAppointment] = useState<Appointment | null>(null);
    const [autoDiagnostic, setAutoDiagnostic] = useState<AutoDiagnostic | null>(null);
    const isMobile = useMediaQuery('(max-width: 1024px)');
    const {id} = router.query;
    const user = useAccount({});

    async function fetchAppointment() {
        if (id) {
            setLoading(true);
            const appointmentFetched = await appointmentResource.getById(id.toString());
            setLoading(false);
            setAppointment(appointmentFetched);

            if (!appointmentFetched) {
                return router.push('/');
            }

            if (appointmentFetched.autoDiagnostic) {
                setTunnelStep('prestation');
                setAutoDiagnostic(appointmentFetched.autoDiagnostic);
            }
        }
    }

    useEffect(() => {
        fetchAppointment();
    }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleClickYesOrNo = (autodiagChoice: boolean) => {
        if (autodiagChoice) setTunnelStep('prestation');
    }

    return (
        <div style={{width: '100vw', overflowX: 'hidden'}}>
            <Head>
                <title>Auto diagnostic</title>
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

                    {!loading && appointment && <Box>
                        <Container maxWidth="md" sx={{padding: {xs: 0}}}>
                            <Paper elevation={isMobile ? 0 : 4} sx={{p: 3}}>
                                <Stack
                                    spacing={5}
                                    marginBottom={4}
                                    sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>

                                    {tunnelStep == 'yesOrNo' && <Box>
                                        <Typography
                                            component="p"
                                            align="center"
                                            sx={{mt: 2}}>
                                            Souhaites tu transmettre un autodiagnostic au réparateur ?
                                        </Typography>

                                        <Button variant="outlined" sx={{marginTop:'30px'}} onClick={() => handleClickYesOrNo(true)}>
                                            Oui
                                        </Button>
                                        <Button variant="outlined" sx={{marginTop:'30px'}} onClick={() => handleClickYesOrNo(false)}>
                                            Non
                                        </Button>
                                    </Box>
                                    }
                                    {tunnelStep == 'prestation' && <Box>
                                        <Select
                                            labelId="select_prestation"
                                            id="select_prestation"
                                            fullWidth
                                            value={prestation}
                                            // onChange={handleChangePrestation}
                                        >
                                                <MenuItem key="test" value="test">
                                                    <ListItemText primary="test" />
                                                </MenuItem>
                                        </Select>
                                    </Box>
                                    }

                                {/*        <Button onClick={handleRegistration} variant="outlined" sx={{marginTop:'30px'}}>*/}
                                {/*            S'inscrire*/}
                                {/*        </Button>*/}
                                {/*    </Box>*/}
                                {/*    }*/}
                                {/*    {user && tunnelStep == 'slots' &&*/}
                                {/*        <Box>*/}
                                {/*            <Typography*/}
                                {/*                component="h2"*/}
                                {/*                align="center"*/}
                                {/*                fontSize={{xs: 34, md: 50}}*/}
                                {/*                fontWeight={600}*/}
                                {/*                sx={{mt: 2}}>*/}
                                {/*                Choisissez votre créneau*/}
                                {/*            </Typography>*/}
                                {/*            <Button variant="outlined" value="2023-04-24T10:00:00">*/}
                                {/*                10H30*/}
                                {/*            </Button>*/}
                                {/*            <Button variant="outlined" value="2023-04-24T11:00:00">*/}
                                {/*                11H00*/}
                                {/*            </Button>*/}
                                {/*            <Button variant="outlined" value="2023-04-24T12:00:00">*/}
                                {/*                11H30*/}
                                {/*            </Button>*/}
                                {/*        </Box>*/}
                                {/*    }*/}
                                </Stack>
                            </Paper>
                        </Container>
                    </Box>}

                </Box>
            </main>
        </div>
    );
};

export default AutoDiag;
