import {NextPageWithLayout} from 'pages/_app';
import React, {useState, useEffect, useContext} from 'react';
import Head from "next/head";
import WebsiteLayout from "@components/layout/WebsiteLayout";
import {useRouter} from "next/router";
import {Repairer} from "@interfaces/Repairer";
import {repairerResource} from "@resources/repairerResource";
import Button from '@mui/material/Button';
import CameraIcon from '@mui/icons-material/PhotoCamera';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {CircularProgress} from "@mui/material";
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import {SearchRepairerContext} from "@contexts/SearchRepairerContext";
import Link from "next/link";

const RepairerPage: NextPageWithLayout = () => {

    const router = useRouter();
    const { id } = router.query;
    const [repairer, setRepairer] = useState<Repairer|null>(null);
    const [loading, setLoading] = useState<boolean>(false);


    const {cityInput, setCityInput, city, setCity, selectedBike, setSelectedBike, showMap, setShowMap,
        setSelectedRepairer, selectedRepairer, repairers, setRepairers} = useContext(SearchRepairerContext);
    console.log(city);

    useEffect(() => {
        async function fetchRepairer() {
            if (typeof id === 'string' && id.length > 0) {
                setLoading(true);
                const repairerFetch: Repairer = await repairerResource.getById(id);
                setRepairer(repairerFetch);
                setLoading(false);
            }
        }
        if (id) {
            fetchRepairer();
        }
    }, [id]);

    return (
        <>
            <div style={{width: "100vw", overflowX: "hidden"}}>
                <Head>
                    <title>Réparateur {repairer?.name}</title>
                </Head>
                <WebsiteLayout />
                <Link href={`/reparateur/chercher-un-reparateur`} passHref>
                    <Button variant="outlined">Retour</Button>
                </Link>
                <main>
                    <Box
                        sx={{
                            bgcolor: 'background.paper',
                            pt: 8,
                            pb: 6,
                        }}
                    >
                        {loading && <CircularProgress />}
                        {
                            repairer &&
                                <Container maxWidth="sm">
                                    <Typography
                                        component="h1"
                                        variant="h2"
                                        align="center"
                                        color="text.primary"
                                        gutterBottom
                                    >
                                        {repairer.name}
                                    </Typography>
                                    <Button variant="outlined" style={{marginLeft: '30%'}}>{repairer.repairerType?.name}</Button>
                                    <Typography paragraph variant="h5" align="left" color="text.secondary" style={{marginTop: '10px'}}>
                                        <FmdGoodIcon /> {repairer.street} - {repairer.postcode} {repairer.city}
                                    </Typography>
                                    <Typography paragraph variant="h5" align="left" color="text.secondary" style={{marginTop: '10px'}}>
                                        <PhoneAndroidIcon /> {repairer.mobilePhone}
                                    </Typography>

                                    <Button variant="outlined" style={{marginLeft: '30%', marginTop: '20px', backgroundColor: 'lightblue', color: 'white'}}>
                                        Je réserve
                                    </Button>

                                    <Typography paragraph variant="h5" align="justify" color="text.secondary" style={{marginTop: '30px'}}>
                                        {repairer.description}
                                    </Typography>
                                </Container>
                        }
                    </Box>
                </main>
            </div>
        </>
    );
};

export default RepairerPage;
