import React from 'react';
import Link from 'next/link';
import {Box, Button} from '@mui/material';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';

type BackToDiscussionsProps = {
  isRepairer?: boolean;
};

const BackToDiscussions = ({
  isRepairer,
}: BackToDiscussionsProps): JSX.Element => {
  return (
    <Link
      href={isRepairer ? '/sradmin/messagerie' : '/messagerie'}
      legacyBehavior
      passHref>
      <Button
        variant="outlined"
        color="secondary"
        size="small"
        startIcon={<ArrowBackIosNewRoundedIcon />}>
        Retour aux discussions
      </Button>
    </Link>
  );
};

export default BackToDiscussions;
