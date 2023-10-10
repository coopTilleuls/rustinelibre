import React from 'react';
import {Typography, Box} from '@mui/material';
import {
  acceptance,
  accessibility,
} from '@data/cgu/acceptance-and-accessibility';

const AcceptanceAndAccessibility = (): JSX.Element => {
  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Typography variant="h3" color="primary">
        4 - Acceptation et accessibilité des CGU
      </Typography>
      <Box display="flex" flexDirection="column" gap={1}>
        <Typography variant="h5" color="secondary">
          4.1 - Acceptation
        </Typography>
        {acceptance.map(({id, content}) => {
          return <Typography key={id}>{content}</Typography>;
        })}
      </Box>
      <Box display="flex" flexDirection="column" gap={1}>
        <Typography variant="h5" color="secondary">
          4.2 - Accessibilité
        </Typography>
        {accessibility.map(({id, content}) => {
          return <Typography key={id}>{content}</Typography>;
        })}
      </Box>
    </Box>
  );
};

export default AcceptanceAndAccessibility;
