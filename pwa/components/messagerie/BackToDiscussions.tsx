import React from 'react';
import Link from 'next/link';
import {Button} from '@mui/material';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';

const BackToDiscussions = (): JSX.Element => {
  return (
    <Link href={'/messagerie'} legacyBehavior passHref>
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
