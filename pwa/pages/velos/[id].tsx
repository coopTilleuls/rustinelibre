import {NextPageWithLayout} from 'pages/_app';
import React, {useState, useEffect} from 'react';
import {NextRouter, useRouter} from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import {bikeResource} from '@resources/bikeResource';
import {bikeTypeResource} from '@resources/bikeTypeResource';
import {useAccount} from '@contexts/AuthContext';
import WebsiteLayout from '@components/layout/WebsiteLayout';
import FullLoading from '@components/common/FullLoading';
import BikeTabs from '@components/bike/BikeTabs';
import ConfirmationModal from '@components/common/ConfirmationModal';
import {
  Container,
  Box,
  Button,
  Divider,
  Paper,
  Typography,
} from '@mui/material';
import {Delete} from '@mui/icons-material';
import {errorRegex} from '@utils/errorRegex';
import {Bike} from '@interfaces/Bike';
import {BikeType} from '@interfaces/BikeType';

const EditBike: NextPageWithLayout = ({}) => {
  const router: NextRouter = useRouter();
  const {user, isLoadingFetchUser} = useAccount({
    redirectIfNotFound: '/velos/mes-velos',
  });
  const {id} = router.query;
  const [bike, setBike] = useState<Bike | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [bikeTypes, setBikeTypes] = useState<BikeType[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchBikeTypes = async () => {
    const responseBikeTypes = await bikeTypeResource.getAll(false);
    setBikeTypes(responseBikeTypes['hydra:member']);
  };

  const handleDelete = async () => {
    setErrorMessage(null);
    setLoading(true);
    try {
      await bikeResource.delete(bike!['@id']);
    } catch (e: any) {
      setErrorMessage(
        `Suppression du vélo impossible: ${e.message?.replace(
          errorRegex,
          '$2'
        )}, veuillez réessayer`
      );
      setTimeout(() => setErrorMessage(null), 3000);
    }
    router.push('/velos/mes-velos');
    setLoading(false);
  };

  useEffect(() => {
    fetchBikeTypes();
  }, []);

  useEffect(() => {
    const fetchBike = async () => {
      if (typeof id === 'string' && id.length > 0) {
        setLoading(true);
        const bikeFetch: Bike = await bikeResource.getById(id);
        setBike(bikeFetch);
        setLoading(false);
      }
    };
    if (id && user) {
      fetchBike();
    }
  }, [id, user]);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <>
      <Head>
        <title>{bike?.name}</title>
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
        {(loading || isLoadingFetchUser) && <FullLoading />}
        {bike && (
          <Container sx={{py: 4}}>
            <Link href="/velos/mes-velos" legacyBehavior passHref>
              <Button variant="outlined" color="secondary" size="small">
                Retour
              </Button>
            </Link>
            <Box
              display="flex"
              flexDirection={{xs: 'column-reverse', md: 'row-reverse'}}
              gap={4}
              my={4}
              alignItems="flex-start">
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 5,
                  width: '100%',
                  flex: 1,
                  overflow: 'hidden',
                  boxShadow: '0px 0px 30px rgba(0,0,0,0.1)',
                }}>
                <BikeTabs bike={bike} setBike={setBike} bikeTypes={bikeTypes} />
              </Paper>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 5,
                  width: {xs: '100%', md: '300px'},
                  display: 'flex',
                  flexDirection: {xs: 'column', sm: 'row', md: 'column'},
                  position: {xs: 'static', md: 'sticky'},
                  top: '120px',
                  overflow: 'hidden',
                  boxShadow: '0px 0px 30px rgba(0,0,0,0.1)',
                }}>
                <Box
                  width={{xs: '100%', sm: '30%', md: '100%'}}
                  height={{xs: '200px', sm: 'auto', md: '200px'}}
                  position="relative">
                  <Image
                    src={
                      bike.picture?.contentUrl || '/img/placeholder-bike.jpg'
                    }
                    style={{objectFit: 'cover'}}
                    fill
                    sizes="350px"
                    alt=""
                  />
                </Box>
                <Box
                  p={2}
                  display="flex"
                  flex={1}
                  flexDirection="column"
                  alignItems={{xs: 'flex-start', md: 'center'}}
                  textAlign={{xs: 'left', md: 'left'}}>
                  <Typography variant="h4" color="primary">
                    {bike.name}
                  </Typography>
                  <Typography variant="h6">{bike.bikeType?.name}</Typography>
                  <Divider sx={{my: 2, width: '100%'}} />
                  <Button
                    sx={{display: 'flex', ml: {xs: 'auto', md: '0'}}}
                    onClick={() => setOpenModal(true)}
                    variant="contained"
                    size="small"
                    startIcon={<Delete />}
                    color="error">
                    Supprimer
                  </Button>
                </Box>
              </Paper>
            </Box>
          </Container>
        )}
        {bike && (
          <ConfirmationModal
            open={openModal}
            onClose={handleCloseModal}
            onConfirm={handleDelete}
            errorMessage={errorMessage}>
            {`Êtes-vous sûr de vouloir supprimer le vélo "${bike.name}" ?`}
          </ConfirmationModal>
        )}
      </WebsiteLayout>
    </>
  );
};

export default EditBike;
