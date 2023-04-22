import {NextPageWithLayout} from 'pages/_app';
import React, {useEffect, useState} from 'react';
import Head from "next/head";
import WebsiteLayout from "@components/layout/WebsiteLayout";
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
import {GetStaticProps} from "next";
import {ENTRYPOINT} from "@config/entrypoint";
import {useRouter} from "next/router";

type RepairerPageProps = {
    repairerProps: Repairer|null;
};

const RepairerPage: NextPageWithLayout<RepairerPageProps> = ({repairerProps}) => {

    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [repairer, setRepairer] = useState<Repairer|null>(repairerProps);

    // If no repairerProps loaded
    async function fetchRepairer() {
        const { id } = router.query;
        if (id) {
            const repairer = await repairerResource.getById(id.toString());
            setLoading(false);
            setRepairer(repairer)
        }
    }

    useEffect(() => {
        if (!repairer) {
            setLoading(true);
            fetchRepairer();
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

export const getStaticProps: GetStaticProps = async ({params}) => {

    if (!ENTRYPOINT) {
        return {
            props: {},
        };
    }

    if (!params) {
        return {
            notFound: true
        };
    }

    const { id } = params;
    if (!id) {
        return {
            notFound: true
        };
    }

    const repairerProps: Repairer = await repairerResource.getById(id.toString(), false);
    return {
        props: {
            repairerProps,
        },
        revalidate: 10
    };
}

export async function getStaticPaths() {

    if (!ENTRYPOINT) {
        return {
            paths: [],
            fallback: true,
        };
    }

    const repairers = await repairerResource.getAll(false,{itemsPerPage: false});
    const paths = repairers['hydra:member'].map((repairer) => ({
        params: { id: repairer.id.toString() },
    }));

    return {
        paths: paths,
        fallback: 'blocking',
    }
}

export default RepairerPage;
