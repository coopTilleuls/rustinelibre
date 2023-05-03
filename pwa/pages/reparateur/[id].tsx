import {NextPageWithLayout} from 'pages/_app';
import React, {useEffect, useState} from 'react';
import {GetStaticProps} from 'next';
import Head from 'next/head';
import {useRouter} from 'next/router';
import {ENTRYPOINT} from '@config/entrypoint';
import {repairerResource} from '@resources/repairerResource';
import WebsiteLayout from '@components/layout/WebsiteLayout';
import RepairerPresentation from '@components/repairers/RepairerPresentation';
import Box from '@mui/material/Box';
import {CircularProgress} from '@mui/material';
import {Repairer} from '@interfaces/Repairer';

type RepairerPageProps = {
  repairerProps: Repairer | null;
};

const RepairerPage: NextPageWithLayout<RepairerPageProps> = ({repairerProps}) => {
  const router = useRouter();
  const {id} = router.query;
  const [loading, setLoading] = useState<boolean>(false);
  const [repairer, setRepairer] = useState<Repairer | null>(repairerProps);

  // If no repairerProps loaded
  async function fetchRepairer() {
    if (id) {
      setLoading(true);
      const repairer = await repairerResource.getById(id.toString());
      setLoading(false);
      setRepairer(repairer);
    }
  }

  useEffect(() => {
    if (!repairer) {
      fetchRepairer();
    }
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{width: '100vw', overflowX: 'hidden'}}>
      <Head>
        <title>Réparateur {repairer?.name}</title>
      </Head>
      <WebsiteLayout />
      <main>
        <Box
          sx={{
            bgcolor: 'background.paper',
            mt: {md: 8},
            mb: 10,
          }}>
          {loading && <CircularProgress sx={{marginLeft: '20%'}} />}
          {repairer && <RepairerPresentation repairer={repairer} />}
        </Box>
      </main>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({params}) => {
  if (!ENTRYPOINT) {
    return {
      props: {},
    };
  }

  if (!params) {
    return {
      notFound: true,
    };
  }

  const {id} = params;
  if (!id) {
    return {
      notFound: true,
    };
  }

  const repairerProps: Repairer = await repairerResource.getById(
    id.toString(),
    false
  );
  return {
    props: {
      repairerProps,
    },
    revalidate: 10,
  };
};

export async function getStaticPaths() {
  if (!ENTRYPOINT) {
    return {
      paths: [],
      fallback: true,
    };
  }

  const repairers = await repairerResource.getAll(false, {itemsPerPage: false});
  const paths = repairers['hydra:member'].map((repairer) => ({
    params: {id: repairer.id.toString()},
  }));

  return {
    paths: paths,
    fallback: 'blocking',
  };
}

export default RepairerPage;
