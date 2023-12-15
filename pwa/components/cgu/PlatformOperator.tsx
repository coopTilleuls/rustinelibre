import React from 'react';
import {Typography, Box, Link} from '@mui/material';
import NextLink from 'next/link';

const PlatformOperator = (): JSX.Element => {
  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Typography variant="h3" color="primary">
        2 - Opérateur de la Plateforme
      </Typography>
      <Box display="flex" flexDirection="column" gap={1}>
        <Typography variant="h5" color="secondary">
          2.1 - La Plateforme est opérée par l’association ANIS Catalyst qui en
          est le représentant légal.
        </Typography>
        <Typography>
          Cette association est appelée Administration dans les présentes CGU.
        </Typography>
      </Box>
      <Box display="flex" flexDirection="column" gap={1}>
        <Typography variant="h5" color="secondary">
          2.2 - L’Administration peut être contactée à l’adresse suivante :
        </Typography>
        <NextLink href="mailto:contact@rustinelibre.fr" legacyBehavior passHref>
          <Link sx={{fontWeight: 800}} underline="none">
            contact@rustinelibre.fr
          </Link>
        </NextLink>
      </Box>
    </Box>
  );
};

export default PlatformOperator;
