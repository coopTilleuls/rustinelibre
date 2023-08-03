import React from 'react';
import {Box, Typography} from '@mui/material';
import {Repairer} from '@interfaces/Repairer';

interface CommentProps {
  repairer: Repairer;
}

export const Comment = ({repairer}: CommentProps): JSX.Element => {
  return (
    <Box sx={{marginTop: 3}}>
      <Typography variant="body1">
        {`Commentaire laissé à l'inscription :`} <br />
        <strong>
          {repairer.comment ? repairer.comment : 'Pas de commentaire laissé'}
        </strong>
      </Typography>
    </Box>
  );
};

export default Comment;
