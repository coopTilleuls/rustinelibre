import {NextPageWithLayout} from 'pages/_app';
import React from 'react';
import Head from 'next/head';
import {Container, Typography, Box, List, ListItem, Link} from '@mui/material';
import WebsiteLayout from '@components/layout/WebsiteLayout';
import NextLink from 'next/link';

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
              variant="h1"
              component="h1"
              textAlign="center"
              color="primary.main"
              pb={2}>
              Qui sommes-nous ?
            </Typography>
            <Typography>
              Nous sommes des réparateurs et réparatrices portant des valeurs.
              Que nous travaillions dans une association, une coopérative ou{' '}
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              sous un statut d'artisan·e indépendant·e, nos pratiques sont{' '}
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              celles de l'économie sociale et solidaire, que nous mettons en
              valeur dans{' '}
              <NextLink href="/notre-charte" legacyBehavior passHref>
                <Link sx={{fontWeight: 800}} underline="none">
                  notre charte
                </Link>
              </NextLink>{' '}
              :
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
                Votre satisfaction est notre priorité: Nous vous conseillons
                dans votre intérêt. Nous sommes transparent·es et prenons le
                temps de vous exposer les options possibles, pour que vous
                choisissiez ce qui vous convient le mieux.
              </ListItem>
              <ListItem
                sx={{
                  display: 'list-item',
                }}>
                Fiabilité : nous aimons le travail bien fait. Si nous ne sommes{' '}
                {/* eslint-disable-next-line react/no-unescaped-entities */}
                pas compétent·es pour effectuer une réparation ou s'il y a un
                problème, nous vous le dirons. Nous sommes aussi à votre{' '}
                {/* eslint-disable-next-line react/no-unescaped-entities */}
                disposition pour vous conseiller sur l'entretien de votre vélo{' '}
                {/* eslint-disable-next-line react/no-unescaped-entities */}
                afin qu'il vous serve le plus longtemps possible.
              </ListItem>
              <ListItem
                sx={{
                  display: 'list-item',
                }}>
                Écologie : lorsque cela est possible et avec votre accord, nous{' '}
                {/* eslint-disable-next-line react/no-unescaped-entities */}
                vous proposerons de réparer plutôt que de remplacer, d'utiliser{' '}
                {/* eslint-disable-next-line react/no-unescaped-entities */}
                des pièces d'occasion plutôt que neuves...
              </ListItem>
              <ListItem
                sx={{
                  display: 'list-item',
                }}>
                {/* eslint-disable-next-line react/no-unescaped-entities */}
                Développer le territoire plutôt que l'uberiser : nous payons nos{' '}
                {/* eslint-disable-next-line react/no-unescaped-entities */}
                impôts en France, favorisons l'activité locale, nos activités
                étant par nature non délocalisables, défendons les emplois de
                qualité. Aucun excédent ne sert à rémunérer des actionnaires :
                ils visent à garantir une juste rémunération et la pérennité de{' '}
                {/* eslint-disable-next-line react/no-unescaped-entities */}
                l'activité.
              </ListItem>
              <ListItem
                sx={{
                  display: 'list-item',
                }}>
                Entraide plutôt que compétition : au delà de notre présence sur
                la plateforme, nous formons une communauté de mécanicien·nes qui{' '}
                {/* eslint-disable-next-line react/no-unescaped-entities */}
                souhaite s'échanger formations, conseils et pièces. Nous
                cherchons aussi à accompagner les personnes voulant se lancer
                dans cette activité.
              </ListItem>
              <ListItem
                sx={{
                  display: 'list-item',
                }}>
                Vers un monde plus cyclable: notre diversité et notre
                coopération va permettre de répondre aux attentes de chaque
                cycliste du territoire, des cyclistes que nous voulons de plus
                en plus nombreux.
              </ListItem>
              <ListItem
                sx={{
                  display: 'list-item',
                }}>
                Démocratie : Rustine Libre est un Commun, un logiciel sous
                licence libre. Sa gestion et son développement sont décidés
                collectivement.
              </ListItem>
            </List>
            <Typography>
              Le projet Rustine Libre est né en Hauts-de-France,. grâce à des{' '}
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              fonds européens et à l'implication de passionné.es du vélo, qui
              cherchaient à faciliter le lien entre les cyclistes et les acteurs
              et actrices locaux de la réparation.
            </Typography>
          </Box>
        </Container>
      </WebsiteLayout>
    </>
  );
};

export default OurCollective;
