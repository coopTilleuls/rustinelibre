import {NextPageWithLayout} from 'pages/_app';
import React, {useEffect, useState} from 'react';
import Head from "next/head";
import WebsiteLayout from "@components/layout/WebsiteLayout";
import Box from '@mui/material/Box';
import {CircularProgress} from "@mui/material";
import {useAccount} from "@contexts/AuthContext";
import {Bike} from "@interfaces/Bike";
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
import Container from "@mui/material/Container";
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import FactCheckIcon from '@mui/icons-material/FactCheck';
import BuildIcon from '@mui/icons-material/Build';
import {bikeResource} from "@resources/bikeResource";

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
        if (user) {
            setLoading(true);
            const bikesFetched = await bikeResource.getAll(true, {owner: user.id});
            setLoading(false);
            setBikes(bikesFetched['hydra:member']);
        }
    }

    useEffect(() => {
        fetchBikes();
    }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleLogin = (): void => {
        router.push('/login?next=' + encodeURIComponent(router.asPath))
    }

    const handleOpenModal = (): void => setOpenModal(true);
    const handleCloseModal = (): void => {
        setOpenModal(false)
        fetchBikes();
    };

    const handleClickFollow = () => {
        if (!selectedBike) {
            return;
        }
        router.push(`/velos/${selectedBike.id}`);
    }

    return (
        <div style={{width: "100vw", overflowX: "hidden"}}>
            <Head>
                <title>Mes vélos</title>
            </Head>
            <WebsiteLayout />
            <div style={{width: "100vw", marginBottom: '100px'}}>
                <Container component="main" maxWidth="xs">
                    <Box
                        sx={{
                            marginTop: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Typography variant="h2">
                            Mes vélos
                        </Typography>
                        {!user && <Typography><span onClick={handleLogin} style={{cursor: 'pointer'}}><u>Connectez vous</u></span> pour accéder à la liste de vos vélos</Typography>}
                        {loading && <CircularProgress />}
                        {
                            bikes.length > 0 && !loading &&
                            bikes.map(bike => <BikeCard key={bike.id} bike={bike} setSelectedBike={setSelectedBike} />)
                        }

                        {
                            bikes.length == 0 && !loading && user &&
                            <Box>
                                <Typography>
                                    Vous n'avez pas encore de vélos enregistrés
                                </Typography>
                                <List
                                    sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                                    component="nav"
                                    aria-labelledby="nested-list-subheader"
                                >
                                    <ListItemButton>
                                        <ListItemIcon>
                                            <DirectionsBikeIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Enregistrez votre vélo" />
                                    </ListItemButton>
                                    <ListItemButton>
                                        <ListItemIcon>
                                            <FactCheckIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Remplissez sa fiche d'identité" />
                                    </ListItemButton>
                                    <ListItemButton>
                                        <ListItemIcon>
                                            <BuildIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Créeez un historique des réparations" />
                                    </ListItemButton>
                                </List>
                            </Box>
                        }

                        <Button variant="outlined" sx={{mb: 3, mt: 2}} onClick={handleOpenModal}>
                            <AddIcon />
                            Ajouter un vélo
                        </Button>

                        <Button variant="outlined" sx={{mb: 3, mt: 2}} disabled={!selectedBike} onClick={handleClickFollow}>
                            Suivant
                        </Button>

                        <ModalAddBike openModal={openModal} handleCloseModal={handleCloseModal} bikeTypes={bikeTypes} />
                    </Box>
                </Container>
            </div>
        </div>
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
