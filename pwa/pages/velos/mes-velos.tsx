import {NextPageWithLayout} from 'pages/_app';
import React, {useEffect, useState} from 'react';
import Head from 'next/head';
import {useRouter} from 'next/router';
import {useAccount} from '@contexts/AuthContext';
import {bikeResource} from '@resources/bikeResource';
import {bikeTypeResource} from '@resources/bikeTypeResource';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  ButtonBase,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ModalAddBike from '@components/bike/ModalAddBike';
import WebsiteLayout from '@components/layout/WebsiteLayout';
import BikeCard from '@components/bike/BikeCard';
import {Bike} from '@interfaces/Bike';
import {BikeType} from '@interfaces/BikeType';
import FullLoading from '@components/common/FullLoading';
import NoBike from '@components/bike/NoBike';

const MyBikes: NextPageWithLayout = () => {
  const {user, isLoadingFetchUser} = useAccount({});
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [bikeTypes, setBikeTypes] = useState<BikeType[]>([]);
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
        <title>Mes vélos | Rustine Libre</title>
      </Head>
      <WebsiteLayout>
        <Box
          bgcolor="lightprimary.light"
          height="100%"
          width="100%"
          position="absolute"
          top="0"
          left="0"
          zIndex="-1"
        />
        <Container
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            py: 8,
          }}>
          <Typography variant="h1" color="primary" sx={{mb: 4}}>
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
              <Button
                variant="contained"
                size="large"
                onClick={handleLogin}
                sx={{mt: 4}}>
                Me connecter
              </Button>
            </Paper>
          ) : (
            <>
              {(loading || isLoadingFetchUser) && <FullLoading />}
              {bikes.length === 0 && !loading && !isLoadingFetchUser && (
                <NoBike />
              )}
              <Box
                sx={{
                  display: 'grid',
                  width: '100%',
                  gap: 4,
                  gridTemplateColumns: 'repeat(auto-fit,300px)',
                  placeContent: 'center',
                }}>
                {bikes.length
                  ? bikes.map((bike) => {
                      return <BikeCard key={bike.id} bike={bike} />;
                    })
                  : null}
                <ButtonBase
                  onClick={handleOpenModal}
                  sx={{
                    borderRadius: 6,
                    width: '100%',
                    color: 'white',
                    alignSelf: 'center',
                  }}>
                  <Box
                    width="100%"
                    height="100%"
                    bgcolor="secondary.light"
                    sx={{
                      borderRadius: 6,
                      boxShadow: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      minHeight: '180px',
                      justifyContent: 'center',
                      alignItems: 'center',
                      transition: 'all ease 0.5s',
                      ':hover': {
                        boxShadow: 5,
                        bgcolor: 'secondary.main',
                      },
                    }}>
                    <AddIcon color="inherit" fontSize="large" />
                    <Typography variant="h5">Ajouter un vélo</Typography>
                  </Box>
                </ButtonBase>
              </Box>
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

export default MyBikes;
