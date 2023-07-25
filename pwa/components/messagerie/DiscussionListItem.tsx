import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import Link from 'next/link';
import {discussionResource} from '@resources/discussionResource';
import {ENTRYPOINT} from '@config/entrypoint';
import {Avatar, Box, Typography} from '@mui/material';
import {formatDate} from '@helpers/dateHelper';
import {Discussion} from '@interfaces/Discussion';
import Badge from '@mui/material/Badge';

type DiscussionListItemProps = {
  discussionGiven: Discussion;
  isCustomer: boolean;
  current?: boolean;
};

const DiscussionListItem = ({
  discussionGiven,
  isCustomer,
  current,
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
      }>
      <Box
        sx={{
          cursor: current ? 'default' : 'pointer',
          width: '100%',
          borderRadius: 5,
          mb: 2,
          transition: 'all ease 0.3s',
          bgcolor: current ? 'lightprimary.dark' : 'grey.100',
          '&:hover': {
            filter: current ? 'none' : 'brightness(0.90)',
          },
        }}>
        <Badge badgeContent={unreadCounter} color="primary">
          <Box px={2} py={2} display="flex" gap={2} alignItems="center">
            {isCustomer && (
              <Avatar
                sx={{
                  width: '48px',
                  height: '48px',
                  bgcolor: current ? 'primary.main' : 'grey.300',
                }}
              />
            )}
            <Box>
              <Typography
                variant="body2"
                fontWeight={800}
                gutterBottom
                color={current ? 'primary.main' : 'text.secondary'}>
                {isCustomer
                  ? discussion.repairer.name
                  : `${discussion.customer.firstName} ${discussion.customer.lastName}`}
              </Typography>

              <Typography
                color="grey.500"
                variant="caption"
                fontStyle="italic"
                component="div"
                lineHeight="1.2">
                {discussion.lastMessage
                  ? `Dernier message : ${formatDate(
                      discussion.lastMessage,
                      true
                    )}`
                  : 'Pas encore de message'}
              </Typography>
            </Box>
          </Box>
        </Badge>
      </Box>
    </Link>
  );
};

export default DiscussionListItem;
