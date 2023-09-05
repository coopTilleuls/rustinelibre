import React from 'react';
import Link from 'next/link';
import {Box, Typography, Button} from '@mui/material';
import Shape from '@components/common/Shape';
import Image from 'next/image';

const CreateMaintenanceBooklet = () => {
  return (
    <Box
      width="100%"
      display="flex"
      flexDirection={{xs: 'column', md: 'row'}}
      gap={4}
      alignItems="center"
      position="relative"
      textAlign={{xs: 'center', md: 'left'}}>
      <Box
        width={{xs: '100%', md: '50%'}}
        maxWidth={{xs: '400px', md: 'none'}}
        position="relative"
        sx={{aspectRatio: '1/1'}}>
        <Box
          position="absolute"
          width="100%"
          height="100%"
          sx={{transform: {xs: 'none', md: 'translateX(-10%)'}}}>
          <Shape color="lightprimary" />
          <Image
            src="/img/phones.png"
            fill
            style={{objectFit: 'contain'}}
            alt=""
          />
        </Box>
        <Box
          zIndex={5}
          sx={{
            position: 'absolute',
            left: '0',
            top: '65%',
            transform: 'translateX(-50%)',
          }}>
          <img alt="" src="/img/flower.svg" width="100px" />
        </Box>
      </Box>
      <Box
        flex={1}
        display="flex"
        flexDirection="column"
        py={15}
        position="relative">
        <Box
          zIndex={5}
          sx={{
            position: 'absolute',
            left: '80%',
            top: '0',
          }}>
          <img alt="" src="/img/eclair.svg" width="60px" />
        </Box>
        <Typography variant="h2" component="h2" color="primary.main" mb={2}>
          Mon carnet
          <br />
          d&apos;entretien
        </Typography>
        <Box width={{md: '80%'}}>
          <Typography variant="h4" component="p" marginBottom={2}>
            Envie de bichonner votre monture&nbsp;?
          </Typography>
          <Typography variant="body1" mb={3}>
            Créez son carnet d&apos;entretien gratuitement. Son petit nom, sa
            dernière réparation, son huile de chaîne préférée, ses rendez-vous,
            vous avez tout son suivi en poche&nbsp;!
          </Typography>
          <Link legacyBehavior passHref href="/velos/mes-velos">
            <Button variant="contained" size="large">
              Je crée mon carnet
            </Button>
          </Link>
          <Box
            zIndex={5}
            sx={{
              position: 'absolute',
              left: '70%',
              bottom: '0',
            }}>
            <img alt="" src="/img/wheel.svg" width="100px" />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CreateMaintenanceBooklet;
