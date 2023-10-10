import React from 'react';
import {Typography, Box} from '@mui/material';

const IndependenceOfClauses = (): JSX.Element => {
  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Typography variant="h3" color="primary">
        10 - Indépendance des Clauses
      </Typography>
      <Box display="flex" flexDirection="column" gap={1}>
        <Typography>
          Si une partie quelconque des présentes conditions générales
          d’utilisation devait s&apos;avérer nulle, invalide ou inapplicable
          pour quelque raison que ce soit, le terme ou les termes en question
          seraient déclarés inexistants et les termes restants garderaient toute
          leur force et leur portée et continueraient à être applicables. Les
          termes déclarés inexistants seraient alors remplacés par les termes
          qui se rapprocheront le plus du contenu et du sens de la clause
          annulée.
        </Typography>
      </Box>
    </Box>
  );
};

export default IndependenceOfClauses;
