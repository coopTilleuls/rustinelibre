import {NextPageWithLayout} from 'pages/_app';
import React, {useState, useEffect} from 'react';
import Head from 'next/head';
import Box from '@mui/material/Box';
import {useRouter} from 'next/router';
import {CircularProgress} from '@mui/material';
import AdminLayout from '@components/admin/AdminLayout';
import {repairerResource} from '@resources/repairerResource';
import {Repairer} from '@interfaces/Repairer';
import InformationsContainer from '@components/dashboard/informations/InformationsContainer';

const EditRepairer: NextPageWithLayout = () => {
  const router = useRouter();
  const {id} = router.query;
  const [repairer, setRepairer] = useState<Repairer | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchRepairer = async () => {
    if (typeof id === 'string' && id.length > 0) {
      setLoading(true);
      const response: Repairer = await repairerResource.getById(id);
      setRepairer(response);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepairer();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Head>
        <title>Éditer un utilisateur</title>
      </Head>
      <AdminLayout />
      <Box component="main" sx={{marginLeft: '20%', marginRight: '5%'}}>
        {loading && <CircularProgress />}
        {!loading && repairer && (
          <InformationsContainer editRepairer={repairer} />
        )}
      </Box>
    </>
  );
};

export default EditRepairer;
