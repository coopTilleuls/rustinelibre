import React from 'react';
import {Box, useMediaQuery} from '@mui/material';
import {Repairer} from '@interfaces/Repairer';
import theme from 'styles/theme';

interface RepairerPresentationProps {
  repairer: Repairer;
}

const RepairerPresentationImage = ({repairer}: RepairerPresentationProps) => {
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box mt={isMobile ? 0 : 4}>
      <img
        style={{
          width: '100%',
          height: 'auto',
          maxHeight: '350px',
          alignSelf: 'flex-start',
          borderRadius: '24px',
          objectFit: 'cover',
        }}
        src={repairer.descriptionPicture?.contentUrl}
        alt="Photo de description du réparateur"
      />
    </Box>
  );
};

export default RepairerPresentationImage;
