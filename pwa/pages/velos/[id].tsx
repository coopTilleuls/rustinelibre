import {NextPageWithLayout} from 'pages/_app';
import React, {useState, useEffect} from 'react';
import Head from "next/head";
import Box from "@mui/material/Box";
import {NextRouter, useRouter} from "next/router";
import {CircularProgress} from "@mui/material";
import {bikeResource} from "@resources/bikeResource";
import {Bike} from "@interfaces/Bike";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import WebsiteLayout from "@components/layout/WebsiteLayout";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import {apiImageUrl} from "@helpers/apiImagesHelper";
import BikeTabs from "@components/bike/BikeTabs";
import Container from "@mui/material/Container";
import {GetStaticProps} from "next";
import {ENTRYPOINT} from "@config/entrypoint";
import {bikeTypeResource} from "@resources/bikeTypeResource";
import {BikeType} from "@interfaces/BikeType";
import {Collection} from "@interfaces/Resource";

type EditBikeProps = {
    bikeTypes: BikeType[];
};

const EditBike: NextPageWithLayout<EditBikeProps> = ({bikeTypes = []}) => {

    const router: NextRouter = useRouter();
    const { id } = router.query;
    const [bike, setBike] = useState<Bike|null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        async function fetchBike() {
            if (typeof id === 'string' && id.length > 0) {
                setLoading(true);
                const bikeFetch: Bike = await bikeResource.getById(id);
                setBike(bikeFetch);
                setLoading(false);
            }
        }
        if (id) {
            fetchBike();
        }
    }, [id]);

    return (
        <>
            <div style={{width: "100vw", overflowX: "hidden"}}>
                <Head>
                    <title>{bike?.name}</title>
                </Head>
                <WebsiteLayout />
                <div style={{width: "100vw", marginBottom: '100px'}}>
                    <Container component="main" maxWidth="xs">
                        <Box
                            sx={{
                                marginTop: 8,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            {loading && <CircularProgress />}
                            {
                                bike && <Typography variant="h3">
                                    <Link href="/velos/mes-velos">
                                        <ArrowBackIcon />
                                    </Link>
                                    {bike.name}
                                </Typography>
                            }
                            {bike && bike.picture && <Box sx={{marginTop: '20px'}}>
                                <img src={apiImageUrl(bike.picture.contentUrl)} alt="Photo du vélo" />
                            </Box>}
                            {bike && <BikeTabs bike={bike} bikeTypes={bikeTypes} />}
                        </Box>
                    </Container>
                </div>
            </div>
        </>
    );
};

export const getStaticProps: GetStaticProps = async () => {

    if (!ENTRYPOINT) {
        return {
            props: {},
        };
    }

    const bikeTypesCollection: Collection<BikeType> = await bikeTypeResource.getAll(false);
    const bikeTypes: BikeType[] = bikeTypesCollection['hydra:member'];

    return {
        props: {
            bikeTypes
        },
        revalidate: 10
    };
}

export async function getStaticPaths() {
    return {
        paths: [],
        fallback: true,
    };
}

export default EditBike;
