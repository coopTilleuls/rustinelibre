import {NextPageWithLayout} from 'pages/_app';
import {ENTRYPOINT} from '@config/entrypoint';
import React, {useContext, useEffect, useState} from 'react';
import {GetStaticProps} from 'next';
import Head from 'next/head';
import {useRouter} from 'next/router';
import {useAccount} from '@contexts/AuthContext';
import {bikeResource} from '@resources/bikeResource';
import {bikeTypeResource} from '@resources/bikeTypeResource';
import {
  Container,
  CircularProgress,
  Typography,
  Box,
  Paper,
  Button,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  List,
} from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import AddIcon from '@mui/icons-material/Add';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import BuildIcon from '@mui/icons-material/Build';
import ModalAddBike from '@components/bike/ModalAddBike';
import WebsiteLayout from '@components/layout/WebsiteLayout';
import BikeCard from '@components/bike/BikeCard';
import {Bike} from '@interfaces/Bike';
import {BikeType} from '@interfaces/BikeType';

type MyBikesProps = {
  bikeTypesFetched: BikeType[];
};

const MyBikes: NextPageWithLayout<MyBikesProps> = ({bikeTypesFetched = []}) => {
  const {user, isLoadingFetchUser} = useAccount({});
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [bikeTypes, setBikeTypes] = useState<BikeType[]>(bikeTypesFetched);
  const router = useRouter();

  async function fetchBikeTypes() {
    const responseBikeTypes = await bikeTypeResource.getAll(false);
    setBikeTypes(responseBikeTypes['hydra:member']);
  }

  useEffect(() => {
    if (bikeTypes.length === 0) {
      fetchBikeTypes();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

  const handleLogin = () => {
    router.push(`/login?next=${encodeURIComponent(router.asPath)}`);
  };

  const handleOpenModal = () => setOpenModal(true);

  const handleCloseModal = () => {
    setOpenModal(false);
    fetchBikes();
  };

  return (
    <>
      <Head>
        <title>Mes vélos</title>
      </Head>
      <WebsiteLayout>
        <Container
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mt: 4,
            mb: 10,
          }}>
          <Typography fontSize={{xs: 24, md: 40}} fontWeight={600}>
            Mes vélos
          </Typography>

          {!user && !isLoadingFetchUser ? (
            <Paper
              elevation={4}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                my: 4,
                p: 4,
              }}>
              <Typography>
                Connectez-vous pour accéder à la liste de vos vélos
              </Typography>
              <Button variant="contained" onClick={handleLogin} sx={{mt: 4}}>
                Me Connecter
              </Button>
            </Paper>
          ) : (
            <>
              {(loading || isLoadingFetchUser) && <CircularProgress />}
              {bikes.length === 0 && !loading && !isLoadingFetchUser && (
                <Box>
                  <Typography>
                    Vous n&apos;avez pas encore de vélos enregistrés
                  </Typography>
                  <List
                    sx={{
                      width: '100%',
                      maxWidth: 360,
                      bgcolor: 'background.paper',
                    }}
                    component="nav"
                    aria-labelledby="nested-list-subheader">
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
              )}
              <Grid2 container sx={{width: '100%', py: 6}} spacing={4}>
                {bikes.length
                  ? !loading &&
                    bikes.map((bike) => {
                      return (
                        <Grid2 key={bike.id} xs={12} md={6} lg={4}>
                          <BikeCard bike={bike} />
                        </Grid2>
                      );
                    })
                  : null}
              </Grid2>
              <Button variant="contained" onClick={handleOpenModal}>
                <AddIcon /> Ajouter un vélo
              </Button>
              <ModalAddBike
                openModal={openModal}
                handleCloseModal={handleCloseModal}
                bikeTypes={bikeTypes}
              />
            </>
          )}
        </Container>
      </WebsiteLayout>
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
  const bikeTypesFetched = bikeTypesCollection['hydra:member'];

  return {
    props: {
      bikeTypesFetched,
    },
    revalidate: 10,
  };
};

export default MyBikes;
