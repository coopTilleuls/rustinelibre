import React from 'react';
import {Typography, Box} from '@mui/material';

const PlatformOperator = (): JSX.Element => {
  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Typography variant="h3" color="primary">
        2 - Opérateur de la Plateforme
      </Typography>
      <Box display="flex" flexDirection="column" gap={1}>
        <Typography variant="h5" color="secondary">
          2.1 - La Plateforme est opérée par :
        </Typography>
        <Box>
          <Typography>- l’association des réparateurs</Typography>
          <Typography>
            - ANIS Catalyst en attendant la création de l’association
          </Typography>
        </Box>
        <Typography>
          Cette association est appelée Administration dans les présentes CGU.
        </Typography>
      </Box>
      <Box display="flex" flexDirection="column" gap={1}>
        <Typography variant="h5" color="secondary">
          2.2 - L’Administration peut être contactée à l’adresse suivante :
        </Typography>
        <Typography>contact@rustinelibre.fr</Typography>
      </Box>
    </Box>
  );
};

export default PlatformOperator;
