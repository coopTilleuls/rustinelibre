import {NextPageWithLayout} from 'pages/_app';
import React, {useState, useEffect, useContext} from 'react';
import Head from "next/head";
import WebsiteLayout from "@components/layout/WebsiteLayout";
import {useRouter} from "next/router";
import {Repairer} from "@interfaces/Repairer";
import {repairerResource} from "@resources/repairerResource";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {CircularProgress} from "@mui/material";
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import Link from "next/link";
import {apiImageUrl} from "@helpers/apiImagesHelper";
import Image from "next/image";

const RepairerPage: NextPageWithLayout = () => {

    const router = useRouter();
    const { id } = router.query;
    const [repairer, setRepairer] = useState<Repairer|null>(null);
    const [loading, setLoading] = useState<boolean>(false);

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
                                    {repairer.thumbnail && <Image src={apiImageUrl(repairer.thumbnail.contentUrl)} alt={'Photo de profil du réparateur'} width={100} height={100}></Image>}
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
