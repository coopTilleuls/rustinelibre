import React from 'react';
import {Typography, Box} from '@mui/material';
import {
  cyclistCommitments,
  generalCommitments,
  repairerCommitments,
} from '@data/cgu/users-commitments';

const UsersCommitments = (): JSX.Element => {
  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Typography variant="h3" color="primary">
        8 - Engagements des Utilisateurs
      </Typography>
      <Box display="flex" flexDirection="column" gap={1}>
        <Typography variant="h5" color="secondary">
          8.1 - Engagements Généraux
        </Typography>
        {generalCommitments.map(({id, content}) => {
          return <Typography key={id}>{content}</Typography>;
        })}
      </Box>
      <Box display="flex" flexDirection="column" gap={1}>
        <Typography variant="h5" color="secondary">
          8.2 - Engagements des Cyclistes
        </Typography>
        {cyclistCommitments.map(({id, content}) => {
          return <Typography key={id}>{content}</Typography>;
        })}
      </Box>
      <Box display="flex" flexDirection="column" gap={1}>
        <Typography variant="h5" color="secondary">
          8.3 - Engagements des Réparateurs
        </Typography>
        {repairerCommitments.map(({id, content}) => {
          return <Typography key={id}>{content}</Typography>;
        })}
      </Box>
    </Box>
  );
};

export default UsersCommitments;
