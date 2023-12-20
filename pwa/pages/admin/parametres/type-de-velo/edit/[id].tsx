import {NextPageWithLayout} from 'pages/_app';
import React, {useState, useEffect} from 'react';
import Head from 'next/head';
import Box from '@mui/material/Box';
import {useRouter} from 'next/router';
import {CircularProgress, Container, Paper} from '@mui/material';
import AdminLayout from '@components/admin/AdminLayout';
import {BikeType} from '@interfaces/BikeType';
import {bikeTypeResource} from '@resources/bikeTypeResource';
import BikeTypeForm from '@components/admin/parameters/bikeType/BikeTypeForm';

const EditBikeType: NextPageWithLayout = () => {
  const router = useRouter();
  const {id} = router.query;
  const [bikeType, setBikeType] = useState<BikeType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchBikeType = async () => {
    if (typeof id === 'string' && id.length > 0) {
      setLoading(true);
      const bikeTypeFetch: BikeType = await bikeTypeResource.getById(id);
      setBikeType(bikeTypeFetch);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBikeType();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Head>
        <title>Éditer un type de vélo | Rustine Libre</title>
      </Head>
      <AdminLayout />
      <Box component="main" sx={{marginLeft: '20%', marginRight: '5%'}}>
        {loading && <CircularProgress />}

        <Container sx={{width: {xs: '100%', md: '50%'}}}>
          <Paper elevation={4} sx={{maxWidth: 400, p: 4, mt: 4, mx: 'auto'}}>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}>
              <BikeTypeForm bikeType={bikeType} />
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default EditBikeType;
