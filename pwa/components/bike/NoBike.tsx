import React from 'react';
import {Typography, Box} from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import BuildIcon from '@mui/icons-material/Build';
import Shape from '@components/common/Shape';

const Arg = ({Icon, text}: {Icon: typeof BuildIcon; text: string}) => (
  <Grid2
    xs={12}
    md={4}
    sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: 1,
      alignItems: 'center',
    }}>
    <Box position="relative" width="60px">
      <Shape outline color="primary" />
      <Icon
        fontSize="large"
        color="primary"
        sx={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />
    </Box>
    <Typography variant="h6" lineHeight="1.1" textAlign="center">
      {text}
    </Typography>
  </Grid2>
);

const NoBike = () => (
  <Box textAlign="center">
    <Typography gutterBottom>
      Vous n&apos;avez pas encore de vélo enregistré.
    </Typography>
    <Grid2
      container
      spacing={2}
      sx={{my: 4, display: {xs: 'none', sm: 'flex'}}}>
      <Arg Icon={DirectionsBikeIcon} text="Enregistrez votre vélo" />
      <Arg Icon={FactCheckIcon} text="Remplissez sa fiche d'identité" />
      <Arg Icon={BuildIcon} text="Créez un historique des réparations" />
    </Grid2>
  </Box>
);

export default NoBike;
