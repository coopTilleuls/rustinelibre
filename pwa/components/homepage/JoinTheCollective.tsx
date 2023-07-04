import React from 'react';
import Link from 'next/link';
import {Box, Typography, Button} from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';

const args = ['Argument 1', 'Argument 2', 'Argument 3'];

const JoinTheCollective = () => {
  return (
    <Box px={{xs: 4, md: 0}} py={4}>
      <Box
        width="100%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        textAlign="center"
        marginBottom={4}>
        <Typography
          color="primary"
          variant="h2"
          component="h2"
          marginBottom={4}>
          Tu es réparateur&nbsp;? Rejoins-nous&nbsp;!
        </Typography>
        <Typography variant="body1" marginBottom={3} maxWidth="sm">
          Vous êtes réparateur ou réparatrice de vélos sur la métropole
          lilloise, Rustine libre vous file un vrai coup de pouce.
        </Typography>
        <Link href="/reparateur/inscription">
          <Button variant="contained" size="large">
            Je rejoins le collectif
          </Button>
        </Link>
      </Box>
      <Grid2
        display={{xs: 'none', md: 'flex'}}
        container
        width="100%"
        spacing={4}>
        {args.map((arg, index) => {
          return (
            <Grid2
              key={index}
              xs={12}
              md={4}
              display="flex"
              flexDirection="column"
              gap={4}
              alignItems="center">
              <Box
                width={{xs: '80%', md: '100%'}}
                height={150}
                bgcolor="grey.300"
                borderRadius={5}
              />
              <Typography variant="h3" component="h3">
                {arg}
              </Typography>
            </Grid2>
          );
        })}
      </Grid2>
    </Box>
  );
};

export default JoinTheCollective;
