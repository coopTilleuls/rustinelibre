import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import Link from 'next/link';
import {discussionResource} from '@resources/discussionResource';
import {ENTRYPOINT} from '@config/entrypoint';
import {Box, Paper, Typography} from '@mui/material';
import {formatDate} from '@helpers/dateHelper';
import {Discussion} from '@interfaces/Discussion';
import Badge from '@mui/material/Badge';

type DiscussionListItemProps = {
  discussionGiven: Discussion;
  isCustomer: boolean;
};

const DiscussionListItem = ({
  discussionGiven,
  isCustomer,
}: DiscussionListItemProps): JSX.Element => {
  const router = useRouter();
  const [unreadCounter, setUnreadCounter] = useState<number>(0);
  const [discussion, setDiscussion] = useState<Discussion>(discussionGiven);

  const subscribeMercureDiscussion = async (): Promise<void> => {
    const hubUrl = `${ENTRYPOINT}/.well-known/mercure`;
    const hub = new URL(hubUrl);
    hub.searchParams.append('topic', `${ENTRYPOINT}${discussion['@id']}`);
    const eventSource = new EventSource(hub);
    eventSource.onmessage = (event) => {
      countUnreadMessagesFromDiscussion();
      refreshDiscussion();
    };
  };

  const countUnreadMessagesFromDiscussion = async (): Promise<void> => {
    const countUnread = await discussionResource.countUnreadDiscussion(
      discussion.id.toString(),
      {}
    );
    setUnreadCounter(countUnread.count);
  };

  const refreshDiscussion = async (): Promise<void> => {
    const refreshDiscussion = await discussionResource.get(
      discussion['@id'],
      true
    );
    if (refreshDiscussion) {
      setDiscussion(refreshDiscussion);
    }
  };

  useEffect(() => {
    countUnreadMessagesFromDiscussion();
    subscribeMercureDiscussion();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Link
      key={discussion.id}
      href={
        isCustomer
          ? `/messagerie/${discussion.id}`
          : `/sradmin/messagerie/${discussion.id}`
      }
      style={{textDecoration: 'none', cursor: 'pointer'}}>
      <Paper
        elevation={4}
        sx={{
          cursor: 'pointer',
          width: '100%',
          backgroundColor:
            +router.query.id! === +discussion.id ? 'primary.main' : '',
          mb: 2,
        }}>
        <Badge badgeContent={unreadCounter} color="primary">
          <Box px={2} py={1}>
            <Typography
              color={+router.query.id! === +discussion.id ? 'white' : 'black'}>
              {isCustomer
                ? discussion.repairer.name
                : `${discussion.customer.firstName} ${discussion.customer.lastName}`}
            </Typography>

            <Typography
              color={+router.query.id! === +discussion.id ? 'white' : 'grey'}
              fontSize={12}
              fontStyle="italic">
              {discussion.lastMessage
                ? `Dernier message : ${formatDate(
                    discussion.lastMessage,
                    true
                  )}`
                : 'Pas encore de message'}
            </Typography>
          </Box>
        </Badge>
      </Paper>
    </Link>
  );
};

export default DiscussionListItem;
