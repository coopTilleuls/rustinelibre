import React from 'react';
import {Typography, Box} from '@mui/material';
import {intellectualProperty} from '@data/cgu/intellectual-property';

const IntellectualProperty = (): JSX.Element => {
  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Typography variant="h3" color="primary">
        11 - Propriété Intellectuelle
      </Typography>
      <Box display="flex" flexDirection="column" gap={1}>
        {intellectualProperty.map(({id, content}) => {
          return <Typography key={id}>{content}</Typography>;
        })}
      </Box>
    </Box>
  );
};

export default IntellectualProperty;
