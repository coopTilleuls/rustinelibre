import React, {useEffect, useState} from 'react';
import {discussionResource} from '@resources/discussionResource';
import {useAccount} from '@contexts/AuthContext';
import {Box, useMediaQuery, useTheme} from '@mui/material';
import {Discussion} from '@interfaces/Discussion';
import DiscussionListItem from '@components/messagerie/DiscussionListItem';
import {isBoss, isEmployee} from '@helpers/rolesHelpers';
import NoMessageListItem from '@components/messagerie/NoMessageListItem';

type CustomerDiscussionListProps = {
  discussion?: Discussion | null;
  setDiscussion?: React.Dispatch<React.SetStateAction<Discussion | null>>;
};

const CustomerDiscussionList = ({
  discussion,
  setDiscussion,
}: CustomerDiscussionListProps): JSX.Element => {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const {user} = useAccount({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const fetchDiscussions = async () => {
    if (!user) {
      return;
    }

    const response = await discussionResource.getAll(true, {
      'order[lastMessage]': 'DESC',
      customer: user['@id'],
      itemsPerPage: 50,
    });

    setDiscussions(response['hydra:member']);

    // Preload first discussion if none detected
    if (
      setDiscussion &&
      discussion === null &&
      response['hydra:member'].length > 0 &&
      !isMobile
    ) {
      setDiscussion(response['hydra:member'][0]);
    }
  };

  useEffect(() => {
    fetchDiscussions();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {user && discussions.length ? (
        <Box flexDirection="column" width="100%">
          {discussions.map((discussionItem) => {
            return (
              <DiscussionListItem
                key={discussionItem.id}
                current={discussionItem.id === discussion?.id}
                discussionGiven={discussionItem}
                isCustomer={!(isBoss(user) || isEmployee(user))}
              />
            );
          })}
        </Box>
      ) : (
        <NoMessageListItem />
      )}
    </>
  );
};

export default CustomerDiscussionList;
