import React from 'react';
import Link from 'next/link';
import {
  Box,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
} from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import bikeRepairer from '@public/img/bike-repairer.jpg';
import bikeMan from '@public/img/bike-man.jpg';
import bikeWoman from '@public/img/bike-woman.jpg';
import Image from 'next/image';

const args = [
  {
    title: 'Du soin et de la qualité',
    text: "Je répare, j'améliore, je sécurise: je cherche le meilleur pour mon client.\u00A0\nJe suis Rustine Libre!",
    img: bikeRepairer,
  },
  {
    title: 'Pignon\nsur rue',
    text: 'Je veux un outil facile pour gérer mes rendez-vous.\u00A0\nJe suis Rustine Libre!',
    img: bikeMan,
  },
  {
    title: 'Libre comme une chambre à air',
    text: 'Mes horaires, mes conditions, mes tarifs, la coopération avec mes pairs.\u00A0\nJe suis Rustine Libre!',
    img: bikeWoman,
  },
];

const JoinTheCollective = () => {
  return (
    <Box py={4}>
      <Box
        width="100%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        textAlign="center"
        position="relative"
        marginBottom={4}>
        <Typography
          color="primary"
          variant="h2"
          component="h2"
          marginBottom={4}>
          Tu es réparateur.ice&nbsp;? Rejoins-nous&nbsp;!
        </Typography>
        <Typography variant="body1" maxWidth="sm">
          Un collectif de professionnels gère démocratiquement la plateforme.
        </Typography>
        <Box
          display={{xs: 'none', md: 'block'}}
          zIndex={5}
          sx={{
            position: 'absolute',
            left: '100%',
            top: '65%',
            transform: 'translateY(20%) translateX(-20%)',
          }}>
          <img alt="" src="/img/flower.svg" width="100px" />
        </Box>
      </Box>
      <Grid2
        container
        spacing={4}
        maxWidth={{xs: '450px', md: 'none'}}
        mx="auto"
        my={4}>
        {args.map((arg, index) => {
          return (
            <Grid2 xs={12} md={4} key={arg.title}>
              <Card sx={{height: '100%', borderRadius: 8}} elevation={1}>
                <CardMedia sx={{height: 160}}>
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '100%',
                    }}>
                    <Image
                      alt=""
                      src={arg.img}
                      fill
                      style={{objectFit: 'cover', objectPosition: 'top'}}
                    />
                  </div>
                </CardMedia>
                <CardContent sx={{marginY: 3, textAlign: 'center'}}>
                  <Typography
                    variant="h3"
                    gutterBottom
                    color="primary"
                    sx={{minHeight: '70px', whiteSpace: 'pre-line', px: 3}}>
                    {arg.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{px: 4, whiteSpace: 'pre-line'}}>
                    {arg.text}
                  </Typography>
                </CardContent>
              </Card>
            </Grid2>
          );
        })}
        <Link legacyBehavior passHref href="/reparateur/inscription">
          <Button variant="contained" size="large" sx={{mx: 'auto', mt: 4}}>
            Je rejoins le collectif
          </Button>
        </Link>
      </Grid2>
    </Box>
  );
};

export default JoinTheCollective;
