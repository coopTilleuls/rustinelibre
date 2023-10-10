import React from 'react';
import {Typography, Box} from '@mui/material';
import {serviceAvailability} from '@data/cgu/service-availability';

const ServiceAvailability = (): JSX.Element => {
  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Typography variant="h3" color="primary">
        7 - Disponibilité du Service
      </Typography>
      <Box display="flex" flexDirection="column" gap={1}>
        {serviceAvailability.map(({id, content}) => {
          return <Typography key={id}>{content}</Typography>;
        })}
      </Box>
    </Box>
  );
};

export default ServiceAvailability;
