import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {useAccount} from '@contexts/AuthContext';
import {ENTRYPOINT} from '@config/entrypoint';
import {Box, CircularProgress, Typography} from '@mui/material';
import {Discussion} from '@interfaces/Discussion';
import {formatDate} from '@helpers/dateHelper';
import {discussionResource} from '@resources/discussionResource';

type RepairerDiscussionListProps = {
  display?: any;
};

const RepairerDiscussionList = ({
  display,
}: RepairerDiscussionListProps): JSX.Element => {
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
      repairer: user.repairer!.id,
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
    <Box width={{xs: '100%', md: '30%', lg: '20%'}} display={display}>
      {discussions.length > 0 && (
        <Box display="flex" flexDirection="column">
          {discussions.map(({id, customer, lastMessage}) => {
            return (
              <Link
                key={id}
                href={`/sradmin/messagerie/${id}`}
                style={{textDecoration: 'none'}}>
                <Box
                  p={2}
                  mb={1}
                  sx={{
                    borderRadius: 2,
                    color: 'primary.main',
                    backgroundColor:
                      +router.query.id! === +id ? 'grey.200' : '',
                    '&:hover': {
                      backgroundColor:
                        +router.query.id! === +id ? '' : 'grey.100',
                    },
                  }}>
                  <Box display="flex">
                    <Typography sx={{pr: 1}}>{customer.firstName}</Typography>
                    <Typography fontWeight={600} textTransform="uppercase">
                      {customer.lastName}
                    </Typography>
                  </Box>
                  <Typography fontSize={11}>
                    {lastMessage
                      ? `Dernier message : ${formatDate(lastMessage, true)}`
                      : 'Pas encore de message'}
                  </Typography>
                </Box>
              </Link>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default RepairerDiscussionList;
