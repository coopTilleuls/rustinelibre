import {NextPageWithLayout} from 'pages/_app';
import React, {useState, useEffect} from 'react';
import Head from 'next/head';
import {useRouter} from 'next/router';
import {discussionResource} from '@resources/discussionResource';
import {Box, CircularProgress, Container, Typography} from '@mui/material';
import WebsiteLayout from '@components/layout/WebsiteLayout';
import CustomerDiscussionList from '@components/messagerie/CustomerDiscussionList';
import CustomerMessagesContent from '@components/messagerie/CustomerMessagesContent';
import BackToDiscussions from '@components/messagerie/BackToDiscussions';
import {Discussion} from '@interfaces/Discussion';

const Messagerie: NextPageWithLayout = () => {
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
        <title>Messages</title>
      </Head>
      <WebsiteLayout>
        <Container
          sx={{
            pt: 4,
            width: {xs: '100%', md: '70%'},
          }}>
          <BackToDiscussions />
          <Typography fontSize={{xs: 28, md: 30}} fontWeight={600} pb={2}>
            Messages
          </Typography>
          {!loading && discussion ? (
            <Box sx={{display: 'flex'}}>
              <CustomerDiscussionList display={{xs: 'none', md: 'block'}} />
              <Box width={{xs: '100%', md: '70%'}}>
                <CustomerMessagesContent discussion={discussion} />
              </Box>
            </Box>
          ) : (
            <Box textAlign="center">
              <CircularProgress />
            </Box>
          )}
        </Container>
      </WebsiteLayout>
    </>
  );
};

export default Messagerie;
