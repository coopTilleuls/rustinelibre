import React from 'react';
import {Box, Typography, Link} from '@mui/material';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';

type BackToDiscussionsProps = {
  isRepairer?: boolean;
};

const BackToDiscussions = ({
  isRepairer,
}: BackToDiscussionsProps): JSX.Element => {
  return (
    <Box display={{xs: 'block', md: 'none'}} pb={1}>
      <Link
        href={isRepairer ? '/sradmin/messagerie' : '/messagerie'}
        style={{textDecoration: 'none'}}>
        <Typography display="flex" alignItems="center" color="grey.500" gap={1}>
          <ArrowBackIosNewRoundedIcon /> Retour aux discussions
        </Typography>
      </Link>
    </Box>
  );
};

export default BackToDiscussions;
