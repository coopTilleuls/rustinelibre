import {NextPageWithLayout} from 'pages/_app';
import React, {useState} from 'react';
import Head from 'next/head';
import {Box, Container, Typography} from '@mui/material';
import WebsiteLayout from '@components/layout/WebsiteLayout';
import CustomerDiscussionList from '@components/messagerie/CustomerDiscussionList';
import CustomerMessagesContent from "@components/messagerie/CustomerMessagesContent";
import {Discussion} from "@interfaces/Discussion";

const Messages: NextPageWithLayout = () => {
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
                    <CustomerDiscussionList display={{xs: 'none', md: 'block'}} />
                    {discussion && <Box width={{xs: '100%', md: '70%'}}>
                        <CustomerMessagesContent discussion={discussion} />
                    </Box>}
                </Box>
            </Container>
          </WebsiteLayout>
        </>
    );
};

export default Messages;
