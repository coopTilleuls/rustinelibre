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
        <Typography fontSize={{xs: 22, md: 48}} fontWeight={600}>
          Carnet d&apos;entretien
        </Typography>
        <Box width={{md: '50%'}}>
          <Typography fontSize={14} fontWeight={400}>
            Envie de bichonner votre monture ?
          </Typography>
          <Typography fontSize={14} fontWeight={400}>
            Créez-lui un carnet d’entretien.
          </Typography>
          <Typography
            fontSize={14}
            fontWeight={400}
            display={{xs: 'none', md: 'block'}}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. In varius
            fermentum finibus.
          </Typography>
        </Box>
        <Link href="/velos/mes-velos">
          <Button variant="contained" sx={{textTransform: 'none'}}>
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
