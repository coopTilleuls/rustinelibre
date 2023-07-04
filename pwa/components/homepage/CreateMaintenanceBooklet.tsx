import React from 'react';
import Link from 'next/link';
import {CardMedia, Box, Stack, Typography, Button} from '@mui/material';

const CreateMaintenanceBooklet = () => {
  return (
    <Box
      width="100%"
      display="flex"
      justifyContent={{xs: 'center', md: 'start'}}
      bgcolor="primary.light"
      borderRadius={{md: 5}}
      position="relative"
      p={{xs: 4, md: 8}}>
      <Stack
        width={{md: '60%'}}
        spacing={5}
        pr={{md: 10}}
        display="flex"
        flexDirection="column"
        alignItems={{xs: 'center', md: 'start'}}>
        <Typography variant="h1" component="h2">
          Mon carnet d&apos;entretien
        </Typography>
        <Box width={{md: '80%'}}>
          <Typography variant="h4" component="p" marginBottom={2}>
            Envie de bichonner votre monture ?
          </Typography>
          <Typography variant="body1">
            Créez son carnet d&apos;entretien gratuitement. Son petit nom, sa
            dernière réparation, son huile de chaîne préférée, ses rendez-vous,
            vous avez tout son suivi en poche !
          </Typography>
        </Box>
        <Link href="/velos/mes-velos">
          <Button variant="contained" size="large">
            Je crée mon carnet
          </Button>
        </Link>
      </Stack>
      <Box
        display={{xs: 'none', md: 'block'}}
        width="40%"
        height={400}
        position="absolute" // Ajout de la propriété position absolute pour la box de l'image
        bottom="-20px" // Dépassement vers le bas de 20px
        right={64}
        top={45}
        borderRadius={5}>
        <CardMedia
          sx={{
            borderRadius: 15,
            width: '100%',
            height: '100%',
            transform: 'translateY(20px)',
          }}
          image={
            'https://cdn.cleanrider.com/uploads/2021/04/prime-reparation-velo_140920-3.jpg'
          }></CardMedia>
      </Box>
    </Box>
  );
};

export default CreateMaintenanceBooklet;
