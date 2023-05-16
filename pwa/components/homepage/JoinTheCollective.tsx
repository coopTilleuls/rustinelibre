import React from 'react';
import Link from 'next/link';
import {Box, Stack, Typography, Button} from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';

const args = ['Argument 1', 'Argument 2', 'Argument 3', 'Argument 4'];

const JoinTheCollective = () => {
  return (
    <Box px={{xs: 4, md: 0}}>
      <Stack
        width="100%"
        spacing={4}
        display="flex"
        flexDirection="column"
        alignItems={{xs: 'center', md: 'start'}}>
        <Typography
          fontSize={22}
          fontWeight={600}
          textAlign={{xs: 'center', md: 'start'}}>
          Rejoins le collectif
        </Typography>
        <Box
          width={{xs: '100%', md: '50%'}}
          textAlign={{xs: 'center', md: 'start'}}>
          <Typography fontSize={14} fontWeight={400}>
            Rejoins notre collectif de réparateurs sur la plateforme.
          </Typography>
          <Typography fontSize={14} fontWeight={400}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. In varius
            fermentum finibus. Aenean.
          </Typography>
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
                md={3}
                display="flex"
                flexDirection="column"
                alignItems="center">
                <Box
                  width={{xs: '80%', md: '100%'}}
                  height={150}
                  bgcolor="grey.300"
                  borderRadius={5}
                />
                <Typography fontSize={20} fontWeight={700}>
                  {arg}
                </Typography>
              </Grid2>
            );
          })}
        </Grid2>
        <Box display="flex" justifyContent="center">
          <Link href="/reparateur/inscription">
            <Button variant="contained" sx={{textTransform: 'none', mt: 0}}>
              Je rejoins le collectif
            </Button>
          </Link>
        </Box>
      </Stack>
    </Box>
  );
};

export default JoinTheCollective;
