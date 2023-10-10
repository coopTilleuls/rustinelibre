import React from 'react';
import {Typography, Box} from '@mui/material';

const Purpose = (): JSX.Element => {
  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Typography variant="h3" color="primary">
        1 - Objet
      </Typography>
      <Typography>
        Pour pouvoir utiliser la plateforme www.rustinelibre.fr (ci-après “la
        Plateforme”), vous devez respecter plusieurs obligations. Vous
        bénéficiez également de certains droits. Ces droits et obligations sont
        détaillés dans les présentes Conditions Générales d&apos;Utilisation
        (CGU).
      </Typography>
    </Box>
  );
};

export default Purpose;
