import {NextPageWithLayout} from 'pages/_app';
import React from 'react';
import Head from 'next/head';
import {Container, Typography} from '@mui/material';
import WebsiteLayout from '@components/layout/WebsiteLayout';
import CustomerDiscussionList from '@components/messagerie/CustomerDiscussionList';

const Messages: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Messages</title>
      </Head>
      <WebsiteLayout>
        <Container
          sx={{
            pt: 4,
            width: {xs: '100%', md: '70%'},
          }}>
          <Typography fontSize={{xs: 28, md: 30}} fontWeight={600} pb={2}>
            Messages
          </Typography>
          <CustomerDiscussionList />
        </Container>
      </WebsiteLayout>
    </>
  );
};

export default Messages;
