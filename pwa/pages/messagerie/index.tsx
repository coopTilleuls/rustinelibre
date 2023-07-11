import {NextPageWithLayout} from 'pages/_app';
import React, {useState} from 'react';
import Head from 'next/head';
import {Box, Container, Typography} from '@mui/material';
import WebsiteLayout from '@components/layout/WebsiteLayout';
import CustomerDiscussionList from '@components/messagerie/CustomerDiscussionList';
import CustomerMessagesContent from "@components/messagerie/CustomerMessagesContent";
import {Discussion} from "@interfaces/Discussion";
import {useAccount} from "@contexts/AuthContext";

const Messages: NextPageWithLayout = () => {
    useAccount({redirectIfNotFound: '/login'});
    const [discussion, setDiscussion] = useState<Discussion|null>(null);

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
                <Box sx={{display: 'flex'}}>
                    <CustomerDiscussionList display={{xs: 'none', md: 'block'}} discussion={discussion} setDiscussion={setDiscussion} />
                    {discussion && <Box width={{xs: '100%', md: '70%'}}>
                        <CustomerMessagesContent discussion={discussion} loading={false} />
                    </Box>}
                </Box>
            </Container>
          </WebsiteLayout>
        </>
    );
};

export default Messages;
