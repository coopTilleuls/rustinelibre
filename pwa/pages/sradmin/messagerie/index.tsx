import React from 'react';
import Head from 'next/head';
import {Typography} from '@mui/material';
import DashboardLayout from '@components/dashboard/DashboardLayout';
import RepairerDiscussionList from '@components/messagerie/RepairerDiscussionList';

const DashboardMessages = () => {
  return (
    <>
      <Head>
        <title>Messagerie Réparateur | Rustine Libre</title>
      </Head>
      <DashboardLayout>
        <Typography variant="h3" py={2} pl={2}>
          Messages
        </Typography>
        <RepairerDiscussionList discussionGiven={null} />
      </DashboardLayout>
    </>
  );
};

export default DashboardMessages;
