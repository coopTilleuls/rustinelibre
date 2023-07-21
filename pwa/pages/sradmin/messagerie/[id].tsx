import {NextPageWithLayout} from 'pages/_app';
import React, {useState, useEffect} from 'react';
import Head from 'next/head';
import {useRouter} from 'next/router';
import {discussionResource} from '@resources/discussionResource';
import {Box, Typography} from '@mui/material';
import DashboardLayout from '@components/dashboard/DashboardLayout';
import RepairerMessagesContent from '@components/messagerie/RepairerMessagesContent';
import RepairerDiscussionList from '@components/messagerie/RepairerDiscussionList';
import BackToDiscussions from '@components/messagerie/BackToDiscussions';
import {Discussion} from '@interfaces/Discussion';

const SrAdminMessagerie: NextPageWithLayout = () => {
  const router = useRouter();
  const {id} = router.query;
  const [discussion, setDiscussion] = useState<Discussion | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchDiscussion = async (id: string) => {
    setLoading(true);
    const response: Discussion = await discussionResource.getById(id);
    setDiscussion(response);
    setLoading(false);
  };

  useEffect(() => {
    if (id) {
      fetchDiscussion(id as string);
    }
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Head>
        <title>Messagerie Réparateur</title>
      </Head>
      <DashboardLayout>
        <BackToDiscussions isRepairer />
        <Typography
          fontSize={{xs: 28, md: 30}}
          fontWeight={600}
          pb={1}
          pl={{md: 2}}>
          Messages
        </Typography>
        {discussion && (
          <Box display="flex" gap={4}>
            <RepairerDiscussionList
              discussionGiven={discussion}
              display={{xs: 'none', md: 'block'}}
            />
            <RepairerMessagesContent
              discussion={discussion}
              loading={loading}
            />
          </Box>
        )}
      </DashboardLayout>
    </>
  );
};

export default SrAdminMessagerie;
