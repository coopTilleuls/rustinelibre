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
import {apiImageUrl} from '@helpers/apiImagesHelper';
import BikeTabs from '@components/bike/BikeTabs';
import Container from '@mui/material/Container';
import {GetStaticProps} from 'next';
import {ENTRYPOINT} from '@config/entrypoint';
import {bikeTypeResource} from '@resources/bikeTypeResource';
import {BikeType} from '@interfaces/BikeType';
import {Collection} from '@interfaces/Resource';
import DeleteIcon from '@mui/icons-material/Delete';
import ModalDeleteBike from '@components/bike/ModalDeleteBike';
import {useAccount} from "@contexts/AuthContext";

type EditBikeProps = {
  bikeTypesFetched: BikeType[];
};

const EditBike: NextPageWithLayout<EditBikeProps> = ({bikeTypesFetched = []}) => {

  const router: NextRouter = useRouter();
  const {user, isLoadingFetchUser} = useAccount({redirectIfNotFound: '/velos/mes-velos'});
  const {id} = router.query;
  const [bike, setBike] = useState<Bike | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [bikeTypes, setBikeTypes] = useState<BikeType[]>(bikeTypesFetched);
  const [openModal, setOpenModal] = useState<boolean>(false);

  async function fetchBikeTypes() {
    const responseBikeTypes = await bikeTypeResource.getAll(false);
    setBikeTypes(responseBikeTypes['hydra:member']);
  }

  useEffect(() => {
    if (bikeTypes.length == 0) {
      fetchBikeTypes();
    }
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

  //   const handleOpenModal = () => setOpenModal(true);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <>
      <Head>
        <title>{bike?.name}</title>
      </Head>
      <WebsiteLayout />
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
                src={apiImageUrl(bike.picture.contentUrl)}
                alt="Photo du vélo"
              />
            )}
            <BikeTabs bike={bike} bikeTypes={bikeTypes} />
          </Box>
        )}
        <ModalDeleteBike
          openModal={openModal}
          handleCloseModal={handleCloseModal}
          bike={bike!}
        />
      </Container>
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
  const bikeTypesFetched: BikeType[] = bikeTypesCollection['hydra:member'];

  return {
    props: {
      bikeTypesFetched,
    },
    revalidate: 10,
  };
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

export default EditBike;
