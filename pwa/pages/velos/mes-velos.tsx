import {NextPageWithLayout} from 'pages/_app';
import React, {useEffect, useState} from 'react';
import Head from "next/head";
import WebsiteLayout from "@components/layout/WebsiteLayout";
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import {CircularProgress} from "@mui/material";
import {useAccount} from "@contexts/AuthContext";
import {Bike} from "@interfaces/Bike";
import {bikeResource} from "@resources/bikeResource";
import Typography from "@mui/material/Typography";
import { useRouter } from 'next/router'
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import ModalAddBike from "@components/bike/ModalAddBike";
import {GetStaticProps} from "next";
import {ENTRYPOINT} from "@config/entrypoint";
import {bikeTypeResource} from "@resources/bikeTypeResource";
import {BikeType} from "@interfaces/BikeType";
import BikeCard from "@components/bike/BikeCard";

type MyBikesProps = {
    bikeTypes: BikeType[];
};

const MyBikes: NextPageWithLayout<MyBikesProps> = ({bikeTypes = []}) => {

    const user = useAccount({});
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [bikes, setBikes] = useState<Bike[]>([]);
    const [selectedBike, setSelectedBike] = useState<Bike|null>(null);
    const router = useRouter()

    // If no repairerProps loaded
    async function fetchBikes() {
        const bikesFetched = await bikeResource.getAll();
        setLoading(false);
        setBikes(bikesFetched['hydra:member']);
    }

    useEffect(() => {
        if (user) {
            setLoading(true);
            fetchBikes();
        }
    }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleLogin = (): void => {
        router.push('/login?next=' + encodeURIComponent(router.asPath))
    }

    const handleOpenModal = (): void => setOpenModal(true);
    const handleCloseModal = (): void => {
        setOpenModal(false)
        fetchBikes();
    };

    return (
        <>
            <div style={{width: "100vw", overflowX: "hidden"}}>
                <Head>
                    <title>Mes vélos</title>
                </Head>
                <WebsiteLayout />
                <main>
                    <Box
                        sx={{
                            bgcolor: 'background.paper',
                            pt: 8,
                            pb: 6,
                            ml: 5,
                        }}
                    >
                        {!user && <Typography><span onClick={handleLogin} style={{cursor: 'pointer'}}><u>Connectez vous</u></span> pour accéder à la liste de vos vélos</Typography>}
                        {loading && <CircularProgress />}
                        {
                            bikes.length > 0 && !loading &&
                            bikes.map(bike => <BikeCard bike={bike} setSelectedBike={setSelectedBike} />)
                        }

                        <Button variant="outlined" sx={{mb: 3, mt: 5}} onClick={handleOpenModal}>
                            <AddIcon />
                            Ajouter un vélo
                        </Button>

                        <Button variant="outlined" sx={{mb: 3, mt: 5}} disabled={selectedBike}>
                            Suivant
                        </Button>

                        <ModalAddBike openModal={openModal} handleCloseModal={handleCloseModal} bikeTypes={bikeTypes} />
                    </Box>
                </main>
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

    const bikeTypesCollection = await bikeTypeResource.getAll(false);
    const bikeTypes = bikeTypesCollection['hydra:member'];

    return {
        props: {
            bikeTypes
        },
        revalidate: 10
    };
}

export default MyBikes;
