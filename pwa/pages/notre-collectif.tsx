import {NextPageWithLayout} from 'pages/_app';
import React from 'react';
import Head from 'next/head';
import {Container, Typography, Box, List, ListItem} from '@mui/material';
import WebsiteLayout from '@components/layout/WebsiteLayout';
import Link from 'next/link';

const OurCollective: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Qui sommes-nous ?</title>
      </Head>
      <WebsiteLayout>
        <Container sx={{width: {xs: '100%', md: '70%'}}}>
          <Box
            display="flex"
            flexDirection="column"
            gap={2}
            sx={{mx: 'auto', mt: 8}}>
            <Typography
              component="h1"
              textAlign="center"
              fontSize={{xs: 28, md: 30}}
              fontWeight={600}
              pb={2}>
              Qui sommes-nous ?
            </Typography>
            <Typography>
              Le projet « Rustine libre » est né d’échanges entre l’Apes
              (Acteurs Pour une Economie Solidaire) et certains de ses
              adhérents, Les Boîtes à Vélo et la Bici.
            </Typography>
            <Typography>
              Début 2022, l’arrivée sur la Région d’un nouveau protagoniste
              national de la réparation de vélo inquiétait fortement les acteurs
              locaux. Sa communication écrasante tendait à les rendre invisibles
              et sa politique de recrutement, se targuant de former des
              réparateurs en 3 jours, mettait en péril la qulalité des emplois.
              Les réparateurs locaux ont craint de voir leur métier « s’uberiser
              ».
            </Typography>
            <Typography>
              L’Apes travaillait alors (dans le cadre d’un projet européen :
              PlateformCoop) sur le moyen de proposer aux acteurs de l’économie
              solidaire locaux une alternative aux grandes plateformes
              numériques au code fermé : le développement de plateformes
              coopératives et solidaires, sous licence libre, modifiable par la
              communauté de leurs utilisateurs et qui ne captent pas les données
              des utilisateurs pour les revendre.
            </Typography>
            <Typography>
              L’Apes a rapidement constitué un groupe de travail d’une vingtaine
              de réparateurs (individuels ou associations) qui ont confirmé le
              besoin d’une application qui leur soit dédiée. Le cahier des
              charges de l’application a alors été défini. Il implique de :
            </Typography>
            <List
              sx={{
                listStyleType: 'disc',
                pl: 4,
              }}>
              <ListItem
                sx={{
                  display: 'list-item',
                }}>
                répondre aux besoins immédiats des cyclistes : une panne quand
                on est loin de chez soi, par exemple. Le choix s’est donc porté
                sur une application téléchargeable sur téléphone
              </ListItem>
              <ListItem
                sx={{
                  display: 'list-item',
                }}>
                permettre la prise de rendez-vous en ligne sur des créneaux
                alimentés par les réparateurs
              </ListItem>
              <ListItem
                sx={{
                  display: 'list-item',
                }}>
                accompagner un auto-diagnostic de la panne par les cyclistes,
                afin que le réparateur s’assure qu’il a la compétence et puisse
                réorienter sur un autre réparateur si nécessaire
              </ListItem>
              <ListItem
                sx={{
                  display: 'list-item',
                }}>
                génèrer un carnet d’entretien du vélo
              </ListItem>
              <ListItem
                sx={{
                  display: 'list-item',
                }}>
                permettre des échanges directs entre cycliste et réparateur par
                un « chat » en ligne. L’application est complétée par des fiches
                qui présentent les compétences, le projet sociétal (le cas
                échéant), les coordonnées et les horaires de chaque réparateur.
              </ListItem>
            </List>
            <Typography>
              Une charte (
              <Link style={{textDecoration: 'none'}} href="/notre-charte">
                lien ici
              </Link>
              ) liste les engagements professionnels, coopératifs et sociétaux
              des réparareurs de Rustine libre.
            </Typography>
          </Box>
        </Container>
      </WebsiteLayout>
    </>
  );
};

export default OurCollective;
