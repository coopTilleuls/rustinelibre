import React from 'react';
import {Typography, Box} from '@mui/material';
import {glossary} from '@data/cgu/glossary';

const Glossary = (): JSX.Element => {
  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Typography variant="h3" color="primary">
        12 - Glossaire
      </Typography>
      <Box display="flex" flexDirection="column" gap={1}>
        {glossary.map(({id, word, definition}) => {
          return (
            <Box key={id}>
              <Typography fontWeight={600}>{word} : </Typography>
              <Typography>{definition}</Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default Glossary;
