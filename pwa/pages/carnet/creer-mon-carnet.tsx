import {NextPageWithLayout} from 'pages/_app';
import React from 'react';
import Head from 'next/head';
import WebsiteLayout from '@components/layout/WebsiteLayout';

const CreateMaintenanceBook: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Mon carnet d’entretien | Rustine Libre</title>
      </Head>
      <WebsiteLayout />
    </>
  );
};

export default CreateMaintenanceBook;
