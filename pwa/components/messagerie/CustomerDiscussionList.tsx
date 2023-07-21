import React, {useEffect, useState} from 'react';
import {discussionResource} from '@resources/discussionResource';
import {useAccount} from '@contexts/AuthContext';
import {Box} from '@mui/material';
import {Discussion} from '@interfaces/Discussion';
import DiscussionListItem from '@components/messagerie/DiscussionListItem';
import {isBoss, isEmployee} from '@helpers/rolesHelpers';

type CustomerDiscussionListProps = {
  display?: any;
  discussion?: Discussion | null;
  setDiscussion?: React.Dispatch<React.SetStateAction<Discussion | null>>;
};

const CustomerDiscussionList = ({
  display,
  discussion,
  setDiscussion,
}: CustomerDiscussionListProps): JSX.Element => {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const {user} = useAccount({});

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
      response['hydra:member'].length > 0
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
        <Box
          flexDirection="column"
          width={{xs: '100%', md: '30%'}}
          pr={{md: 4}}
          display={display}>
          {discussions.map((discussion) => {
            return (
              <DiscussionListItem
                key={discussion.id}
                discussionGiven={discussion}
                isCustomer={!(isBoss(user) || isEmployee(user))}
              />
            );
          })}
        </Box>
      ) : null}
    </>
  );
};

export default CustomerDiscussionList;
