import React, {useEffect, useState} from 'react';
import {Box, Typography, useTheme} from '@mui/material';
import CustomerDiscussionList from '@components/messagerie/CustomerDiscussionList';
import CustomerMessagesContent from '@components/messagerie/CustomerMessagesContent';
import {Discussion} from '@interfaces/Discussion';
import {useAccount} from '@contexts/AuthContext';
import {discussionResource} from '@resources/discussionResource';
import {useRouter} from 'next/router';
import BackToDiscussions from './BackToDiscussions';
import FullLoading from '@components/common/FullLoading';

const Messagerie = () => {
  const theme = useTheme();
  useAccount({redirectIfNotFound: '/login'});
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
  }, [id]);

  return (
    <Box
      sx={{
        width: '100%',
        height: {
          xs: 'calc(100vh - 112px)',
          sm: 'calc(100vh - 120px)',
          md: 'calc(100vh - 152px)',
        },
        overflow: 'clip',
      }}>
      {loading ? <FullLoading /> : null}
      <Box
        sx={{
          display: 'flex',
          height: '100%',
          flexDirection: {xs: 'column', md: 'row'},
        }}>
        <Box
          sx={{
            position: 'relative',
            width: {xs: '100%', md: '35%'},
            minWidth: '300px',
            bgcolor: 'white',
            height: {xs: !id ? '100%' : 'initial', md: '100%'},
            display: 'flex',
            flexDirection: 'column',
            alignItems: {xs: 'center', md: 'flex-end'},
            borderRight: {
              xs: 'none',
              md: `1px solid ${theme.palette.grey[300]}`,
            },
            borderBottom: {
              xs: `1px solid ${theme.palette.grey[300]}`,
              md: 'none',
            },
          }}>
          <Box
            display="flex"
            flexDirection="column"
            width="100%"
            py={2}
            px={4}
            alignItems={{xs: 'flex-start', md: 'flex-end'}}
            borderBottom={{
              xs: 'none',
              md: `1px solid ${theme.palette.grey[300]}`,
            }}>
            <Box
              width="100%"
              maxWidth={{xs: '100%', md: '350px'}}
              display="flex"
              flexDirection="column"
              alignItems="flex-start">
              {id ? <BackToDiscussions /> : null}
              <Typography
                variant="h2"
                color="primary.main"
                mt={1}
                sx={{textAlign: {xs: 'center', md: 'left'}}}>
                Messages
              </Typography>
              {discussion?.repairer.name && (
                <Typography variant="body2" sx={{display: {md: 'none'}}}>
                  {discussion?.repairer.name}
                </Typography>
              )}
            </Box>
          </Box>
          <Box
            display={{xs: id ? 'none' : 'flex', md: 'flex'}}
            flexDirection="column"
            width="100%"
            py={2}
            my={2}
            px={4}
            flex={1}
            sx={{overflowY: 'auto'}}
            alignItems={{xs: 'center', md: 'flex-end'}}>
            <Box width="100%" maxWidth={{xs: '100%', md: '350px'}}>
              <CustomerDiscussionList
                discussion={discussion}
                setDiscussion={id ? undefined : setDiscussion}
              />
            </Box>
          </Box>
        </Box>
        {discussion && (
          <Box
            flex={1}
            flexDirection="column"
            height={{xs: '0', md: '100%'}}
            display={{xs: id ? 'flex' : 'none', md: 'flex'}}>
            {discussion ? (
              <CustomerMessagesContent
                discussion={discussion}
                loading={loading}
              />
            ) : null}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Messagerie;
