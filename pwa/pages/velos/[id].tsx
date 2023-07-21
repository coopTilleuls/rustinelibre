import {NextPageWithLayout} from 'pages/_app';
import React, {useState, useEffect} from 'react';
import Head from 'next/head';
import Box from '@mui/material/Box';
import {NextRouter, useRouter} from 'next/router';
import {Button, CircularProgress} from '@mui/material';
import {bikeResource} from '@resources/bikeResource';
import {Bike} from '@interfaces/Bike';
import WebsiteLayout from '@components/layout/WebsiteLayout';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import BikeTabs from '@components/bike/BikeTabs';
import Container from '@mui/material/Container';
import {bikeTypeResource} from '@resources/bikeTypeResource';
import {BikeType} from '@interfaces/BikeType';
import DeleteIcon from '@mui/icons-material/Delete';
import ModalDeleteBike from '@components/bike/ModalDeleteBike';
import {useAccount} from '@contexts/AuthContext';
import useMediaQuery from '@hooks/useMediaQuery';

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
  const isMobile = useMediaQuery('(max-width: 1024px)');

  async function fetchBikeTypes() {
    const responseBikeTypes = await bikeTypeResource.getAll(false);
    setBikeTypes(responseBikeTypes['hydra:member']);
  }

  useEffect(() => {
    fetchBikeTypes();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    async function fetchBike() {
      if (typeof id === 'string' && id.length > 0) {
        setLoading(true);
        const bikeFetch: Bike = await bikeResource.getById(id);
        setBike(bikeFetch);
        setLoading(false);
      }
    }
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
        <Container
          sx={{
            mt: {xs: 2, md: 6},
            mb: {xs: 10, md: 18},
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          {(loading || isLoadingFetchUser) && <CircularProgress />}
          {bike && (
            <Box width={{xs: '100%', md: '50%'}}>
              <Box width={'100%'} display="flex" justifyContent="space-between">
                <Link href="/velos/mes-velos">
                  <Button variant="outlined" sx={{fontSize: 12}}>
                    Retour
                  </Button>
                </Link>
                <Button
                  variant="contained"
                  color="error"
                  sx={{fontSize: 12, p: 1}}
                  onClick={() => setOpenModal(true)}>
                  <DeleteIcon />
                </Button>
              </Box>
              <Typography
                fontSize={40}
                fontWeight={600}
                textTransform="capitalize"
                sx={{pt: {xs: 2, md: 4}, pb: 1}}
                textAlign="center">
                {bike.name}
              </Typography>
              {bike.picture && (
                <img
                  width="300"
                  height="auto"
                  src={bike.picture.contentUrl}
                  alt="Photo du vélo"
                  style={{marginLeft: isMobile ? '5%' : '20%'}}
                />
              )}
              <BikeTabs bike={bike} setBike={setBike} bikeTypes={bikeTypes} />
            </Box>
          )}
          <ModalDeleteBike
            openModal={openModal}
            handleCloseModal={handleCloseModal}
            bike={bike!}
          />
        </Container>
      </WebsiteLayout>
    </>
  );
};

export default EditBike;
