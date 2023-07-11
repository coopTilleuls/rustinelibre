import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import Link from 'next/link';
import {discussionResource} from '@resources/discussionResource';
import {useAccount} from '@contexts/AuthContext';
import {ENTRYPOINT} from '@config/entrypoint';
import {Box, CircularProgress, Paper, Typography} from '@mui/material';
import {formatDate} from '@helpers/dateHelper';
import {Discussion} from '@interfaces/Discussion';
import {BikeType} from "@interfaces/BikeType";
import DiscussionListItem from "@components/messagerie/DiscussionListItem";
import {isBoss, isEmployee} from "@helpers/rolesHelpers";

type CustomerDiscussionListProps = {
  display?: any;
  discussion?: Discussion|null
  setDiscussion?: React.Dispatch<React.SetStateAction<Discussion | null>>;
};

const CustomerDiscussionList = ({
  display,
  discussion,
  setDiscussion,
}: CustomerDiscussionListProps): JSX.Element => {
  const [discussionPage, setDiscussionPage] = useState<number>(1);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const {user} = useAccount({});

  const fetchDiscussions = async () => {
    if (!user) {
      return;
    }

    setLoading(true);
    const response = await discussionResource.getAll(true, {
      'order[lastMessage]': 'DESC',
      customer: user['@id'],
      page: discussionPage
    });

    const discussionsLoaded = discussions;
    response['hydra:member'].map((newDiscuss) => {
      discussionsLoaded.push(newDiscuss)
    })
    setDiscussions(discussionsLoaded);
    setLoading(false);

    // Preload first discussion if none detected
    if (setDiscussion && discussion === null && response['hydra:member'].length > 0) {
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
              <DiscussionListItem discussion={discussion} isCustomer={!(isBoss(user) || isEmployee(user))} />
              // <Link
              //   key={id}
              //   href={`/messagerie/${id}`}
              //   style={{textDecoration: 'none'}}>
              //   <Paper
              //     elevation={4}
              //     sx={{
              //       cursor: 'pointer',
              //       width: '100%',
              //       backgroundColor:
              //         +router.query.id! === +id ? 'primary.main' : '',
              //       mb: 2,
              //     }}>
              //     <Box px={2} py={1}>
              //       <Typography
              //         color={+router.query.id! === +id ? 'white' : 'black'}>
              //         {repairer.name}
              //       </Typography>
              //
              //       <Typography
              //         color={+router.query.id! === +id ? 'white' : 'grey'}
              //         fontSize={12}
              //         fontStyle="italic">
              //         {lastMessage
              //           ? `Dernier message : ${formatDate(lastMessage, true)}`
              //           : 'Pas encore de message'}
              //       </Typography>
              //     </Box>
              //   </Paper>
              // </Link>
            );
          })}
        </Box>
      ) : null}
    </>
  );
};

export default CustomerDiscussionList;
