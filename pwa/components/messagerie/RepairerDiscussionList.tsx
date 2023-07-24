import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {useAccount} from '@contexts/AuthContext';
import {Box} from '@mui/material';
import {Discussion} from '@interfaces/Discussion';
import {discussionResource} from '@resources/discussionResource';
import {isBoss, isEmployee} from '@helpers/rolesHelpers';
import DiscussionListItem from '@components/messagerie/DiscussionListItem';

type RepairerDiscussionListProps = {
  display?: any;
  discussionGiven: Discussion | null;
};

const RepairerDiscussionList = ({
  display,
  discussionGiven,
}: RepairerDiscussionListProps): JSX.Element => {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [discussion, setDiscussion] = useState<Discussion | null>(
    discussionGiven
  );
  const {user} = useAccount({});
  const router = useRouter();

  const fetchDiscussions = async () => {
    if (!user) {
      return;
    }

    const repairer = user.repairer
      ? user.repairer
      : user.repairerEmployee
      ? user.repairerEmployee.repairer
      : null;
    if (!repairer) {
      return;
    }

    const response = await discussionResource.getAll(true, {
      'order[lastMessage]': 'DESC',
      repairer: repairer.id,
      itemsPerPage: 50,
    });

    setDiscussions(response['hydra:member']);

    if (!discussion && response['hydra:member'].length > 0) {
      setDiscussion(response['hydra:member'][0]);
    }
  };

  useEffect(() => {
    fetchDiscussions();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (discussion) {
      router.push(`/sradmin/messagerie/${discussion.id}`);
    }
  }, [discussion]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box width={{xs: '100%', md: '40%'}} maxWidth="350px" display={display}>
      {user && discussions.length > 0 && (
        <Box display="flex" flexDirection="column">
          {discussions.map((discussionItem) => {
            return (
              <DiscussionListItem
                key={discussionItem.id}
                discussionGiven={discussionItem}
                current={discussion?.id === discussionItem.id}
                isCustomer={!(isBoss(user) || isEmployee(user))}
              />
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default RepairerDiscussionList;
