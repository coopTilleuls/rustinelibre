import React from 'react';
import Head from 'next/head';
import {Typography} from '@mui/material';
import DashboardLayout from '@components/dashboard/DashboardLayout';
import RepairerDiscussionList from '@components/messagerie/RepairerDiscussionList';

const DashboardMessages = () => {
  return (
    <>
      <Head>
        <title>Messagerie Réparateur</title>
      </Head>
      <DashboardLayout>
        <Typography variant="h4" pb={1} pl={2}>
          Messages
        </Typography>
        <RepairerDiscussionList />
      </DashboardLayout>
    </>
  );
};

export default DashboardMessages;
