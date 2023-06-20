import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import Link from 'next/link';
import {discussionResource} from '@resources/discussionResource';
import {useAccount} from '@contexts/AuthContext';
import {ENTRYPOINT} from '@config/entrypoint';
import {Box, CircularProgress, Paper, Typography} from '@mui/material';
import {formatDate} from '@helpers/dateHelper';
import {Discussion} from '@interfaces/Discussion';

type CustomerDiscussionListProps = {
  display?: any;
};

const CustomerDiscussionList = ({
  display,
}: CustomerDiscussionListProps): JSX.Element => {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const {user} = useAccount({});
  const router = useRouter();

  const subscribeMercureDiscussions = async (): Promise<void> => {
    const hubUrl = `${ENTRYPOINT}/.well-known/mercure`;
    const hub = new URL(hubUrl);
    discussions.map((discussion) => {
      hub.searchParams.append('topic', `${ENTRYPOINT}${discussion['@id']}`);
    });

    const eventSource = new EventSource(hub);
    eventSource.onmessage = (event) => {
      fetchDiscussions();
    };
  };

  const fetchDiscussions = async () => {
    if (!user) {
      return;
    }
    setLoading(true);
    const response = await discussionResource.getAll(true, {
      'order[lastMessage]': 'DESC',
      customer: user['@id'],
    });
    setDiscussions(response['hydra:member']);
    setLoading(false);
  };

  useEffect(() => {
    fetchDiscussions();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (discussions.length > 0) {
      subscribeMercureDiscussions();
    }
  }, [discussions]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {discussions.length ? (
        <Box
          flexDirection="column"
          width={{xs: '100%', md: '30%'}}
          pr={{md: 4}}
          display={display}>
          {discussions.map(({id, repairer, lastMessage}) => {
            return (
              <Link
                key={id}
                href={`/messagerie/${id}`}
                style={{textDecoration: 'none'}}>
                <Paper
                  elevation={4}
                  sx={{
                    cursor: 'pointer',
                    width: '100%',
                    backgroundColor:
                      +router.query.id! === +id ? 'primary.main' : '',
                    mb: 2,
                  }}>
                  <Box px={2} py={1}>
                    <Typography
                      color={+router.query.id! === +id ? 'white' : 'black'}>
                      {repairer.name}
                    </Typography>

                    <Typography
                      color={+router.query.id! === +id ? 'white' : 'grey'}
                      fontSize={12}
                      fontStyle="italic">
                      {lastMessage
                        ? `Dernier message : ${formatDate(lastMessage, true)}`
                        : 'Pas encore de message'}
                    </Typography>
                  </Box>
                </Paper>
              </Link>
            );
          })}
        </Box>
      ) : null}
    </>
  );
};

export default CustomerDiscussionList;
