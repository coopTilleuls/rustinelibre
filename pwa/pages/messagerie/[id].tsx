import {NextPageWithLayout} from 'pages/_app';
import React from 'react';
import Head from 'next/head';
import WebsiteLayout from '@components/layout/WebsiteLayout';
import Messagerie from '@components/messagerie/Messagerie';

const MessagerieId: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Messages | Rustine Libre</title>
      </Head>
      <WebsiteLayout withLegalFooter={false}>
        <Messagerie />
      </WebsiteLayout>
    </>
  );
};

export default MessagerieId;
