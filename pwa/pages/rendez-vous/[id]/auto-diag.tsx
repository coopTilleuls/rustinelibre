import {NextPageWithLayout} from 'pages/_app';
import React, {useEffect, useState} from 'react';
import Head from 'next/head';
import {useRouter} from 'next/router';
import {repairerResource} from '@resources/repairerResource';
import WebsiteLayout from '@components/layout/WebsiteLayout';
import {Repairer} from '@interfaces/Repairer';
import Link from "next/link";
import {Container, CircularProgress, Box, Typography, Paper, Stack, Button, Icon} from '@mui/material';
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
import Select, {SelectChangeEvent} from "@mui/material/Select";
import {MediaObject} from "@interfaces/MediaObject";
import {uploadFile} from "@helpers/uploadFile";
import {bikeResource} from "@resources/bikeResource";
import {mediaObjectResource} from "@resources/mediaObjectResource";
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import {apiImageUrl} from "@helpers/apiImagesHelper";
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

const AutoDiag: NextPageWithLayout = () => {
    const router = useRouter();
    const [tunnelStep, setTunnelStep] = useState<string>('yesOrNo');
    const [prestation, setPrestation] = useState<string>('Entretien classique');
    const [slotSelected, setSlotSelected] = useState<string|null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [appointment, setAppointment] = useState<Appointment | null>(null);
    const [autoDiagnostic, setAutoDiagnostic] = useState<AutoDiagnostic | null>(null);
    const [photo, setPhoto] = useState<MediaObject|null>(null);
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
                setAutoDiagnostic(appointmentFetched.autoDiagnostic);
                setPrestation(appointmentFetched.autoDiagnostic.prestation);
                setTunnelStep('photo')
                if (appointmentFetched.autoDiagnostic.photo) {
                    setPhoto(photo);
                    setTunnelStep('recap')
                }
            }
        }
    }

    const handleChangePrestation = (event: SelectChangeEvent) => {
        setPrestation(event.target.value as string);
    };

    useEffect(() => {
        fetchAppointment();
    }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleClickYesOrNo = (autodiagChoice: boolean) => {
        if (autodiagChoice) setTunnelStep('prestation');
    }

    const handleClickNextPrestation = async() => {
        if (!appointment) {
            return;
        }

        if (!autoDiagnostic) {
            const newAutodiag = await autoDiagnosticResource.post({
                'prestation': prestation,
                'appointment': appointment['@id']
            })

            if (newAutodiag) setAutoDiagnostic(newAutodiag);
        } else {
            await autoDiagnosticResource.put(autoDiagnostic['@id'], {
                'prestation' : prestation
            })
        }

        setTunnelStep('autoDiagPhoto');
    }

    const handleClickNextPhoto = async() => {
        if (!appointment || !autoDiagnostic) {
            return;
        }

        if (photo) {
            const autodiag = await autoDiagnosticResource.put(autoDiagnostic['@id'], {
                'photo' : photo['@id']
            })
            setAutoDiagnostic(autodiag);
        }

        setTunnelStep('recap');
    }

    const handleConfirm = () => {
        router.push('/')
    }

    const handleCancel = () => {
        if (appointment) {
            appointmentResource.delete(appointment['@id']);
        }
        if (autoDiagnostic) {
            autoDiagnosticResource.delete(autoDiagnostic['@id']);
        }
        if (photo) {
            mediaObjectResource.delete(photo['@id']);
        }
    }

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
        if (event.target.files) {
            // Upload new picture
            const response = await uploadFile(event.target.files[0]);
            const mediaObjectResponse = await response?.json() as MediaObject;
            if (mediaObjectResponse) {
                // Display new photo
                setPhoto(mediaObjectResponse);
            }
        }
    };

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
                                        <Typography
                                            component="p"
                                            align="center"
                                            sx={{mt: 2}}>
                                            De quelle prestation as tu besoin ?
                                        </Typography>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={prestation}
                                            label="Prestation"
                                            onChange={handleChangePrestation}
                                        >
                                            <MenuItem value="Entretien classique">Entretien classique</MenuItem>
                                            <MenuItem value="Électrifier mon vélo">Électrifier mon vélo</MenuItem>
                                            <MenuItem value="Problème de frein">Problème de frein</MenuItem>
                                            <MenuItem value="Problème de pneu">Problème de pneu</MenuItem>
                                            <MenuItem value="Problème de roue">Problème de roue</MenuItem>
                                            <MenuItem value="Problème de vitesse">Problème de vitesse</MenuItem>
                                            <MenuItem value="Autre prestation">Autre prestation</MenuItem>
                                        </Select> <br />

                                        <Button variant="outlined" sx={{marginTop:'30px'}} onClick={handleClickNextPrestation}>
                                            Suivant
                                        </Button>
                                    </Box>
                                    }
                                    {tunnelStep == 'autoDiagPhoto' && <Box>
                                        <Typography
                                            component="p"
                                            align="center"
                                            sx={{mt: 2}}>
                                            Ajouter une photo
                                        </Typography>
                                        <Box sx={{border: '1px solid black', padding: '10px', cursor: 'pointer'}}>
                                            <label htmlFor="fileUpload">
                                                {!photo ? <Box>
                                                    <Typography
                                                        component="p"
                                                        align="center"
                                                        sx={{mt: 2}}>
                                                        Sélectionner la photo de votre vélo
                                                    </Typography>
                                                    <AddAPhotoIcon sx={{marginLeft:'30%', fontSize: '3em'}} />
                                                </Box> : <img src={apiImageUrl(photo.contentUrl)} />
                                                }
                                            </label>
                                            <input
                                                id="fileUpload"
                                                name="fileUpload"
                                                type="file"
                                                hidden
                                                onChange={(e) => handleFileChange(e)}
                                            />
                                        </Box>

                                        <Button variant="outlined" sx={{marginTop:'30px'}} onClick={handleClickNextPhoto}>
                                            Suivant
                                        </Button>
                                    </Box>
                                    }
                                    {tunnelStep == 'recap' && <Box sx={{border: '1px solid black', padding: '10px'}}>
                                        <Typography
                                            component="p"
                                            align="center"
                                            sx={{mt: 2}}>
                                            Votre demande de rendez vous
                                        </Typography>
                                        <Box sx={{border: '1px solid black', padding: '10px', cursor: 'pointer'}}>
                                            <EventAvailableIcon sx={{marginLeft: '30%'}} />
                                        </Box>

                                        <Button variant="outlined" sx={{marginTop:'30px'}} onClick={handleConfirm}>
                                            Envoyer la demander
                                        </Button><br/>
                                        <Button variant="outlined" sx={{marginTop:'30px'}} onClick={handleCancel}>
                                            Annuler
                                        </Button>
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

export default AutoDiag;
