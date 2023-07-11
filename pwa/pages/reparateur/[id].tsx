import {NextPageWithLayout} from 'pages/_app';
import React, {useEffect, useState} from 'react';
import {GetStaticProps} from 'next';
import Head from 'next/head';
import {useRouter} from 'next/router';
import {ENTRYPOINT} from '@config/entrypoint';
import {repairerResource} from '@resources/repairerResource';
import WebsiteLayout from '@components/layout/WebsiteLayout';
import RepairerPresentation from '@components/repairers/RepairerPresentation';
import {Box} from '@mui/material';
import {Repairer} from '@interfaces/Repairer';
import FullLoading from '@components/common/FullLoading';

type RepairerPageProps = {
  repairerProps: Repairer | null;
};

const RepairerPage: NextPageWithLayout<RepairerPageProps> = ({
  repairerProps,
}) => {
  const router = useRouter();
  const {id} = router.query;
  const [loading, setLoading] = useState<boolean>(false);
  const [repairer, setRepairer] = useState<Repairer | null>(repairerProps);

  // If no repairerProps loaded
  const fetchRepairer = async () => {
    if (id) {
      setLoading(true);
      const repairer = await repairerResource.getById(id.toString());
      setLoading(false);
      setRepairer(repairer);
    }
  };

  useEffect(() => {
    fetchRepairer();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{width: '100vw', overflowX: 'hidden'}}>
      <Head>
        <title>Réparateur {repairer?.name}</title>
      </Head>
      <WebsiteLayout>
        <Box
          component="main"
          sx={{
            minHeight: {
              xs: 'calc(100vh - 112px)',
              sm: 'calc(100vh - 120px)',
              md: 'calc(100vh - 152px)',
            },
          }}>
          {!repairer && <FullLoading />}
          {repairer && <RepairerPresentation repairer={repairer} />}
        </Box>
      </WebsiteLayout>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({params}) => {
  if (!ENTRYPOINT) {
    return {
      notFound: true,
      revalidate: 0,
    };
  }

  if (!params) {
    return {
      notFound: true,
      revalidate: 10,
    };
  }

  const {id} = params;
  if (!id) {
    return {
      notFound: true,
      revalidate: 10,
    };
  }

  const repairerProps: Repairer = await repairerResource.getById(
    id.toString(),
    false
  );

  console.log(id);

  return {
    props: {
      repairerProps,
    },
    revalidate: 10,
    notFound: !repairerProps,
  };
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

export default RepairerPage;
