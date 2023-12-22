import {Box, Link, ListItem, Typography} from '@mui/material';
import React from 'react';
import List from '@mui/material/List';
import NextLink from 'next/link';

export const questions = [
  {
    id: 1,
    question: 'Dois-je me créer un compte pour utiliser Rustine Libre ?',
    answer: () => (
      <Box>
        <Typography>
          Pas besoin de créer un compte pour faire une recherche de solution de
          réparation près de chez vous !
        </Typography>
        <Typography>
          Cela vous sera demandé au moment de la prise de rendez-vous, mais pas{' '}
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          d'inquiétude, c'est très simple.
        </Typography>
      </Box>
    ),
  },
  {
    id: 2,
    question: "Pourquoi utiliser l'application Rustine Libre ?",
    answer: () => (
      <Box>
        <Typography>
          Parce que Rustine Libre est pratique, elle regroupe des mécanicien·nes{' '}
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          portant des valeurs et c\'est une plateforme éthique :
        </Typography>
        <List
          sx={{
            listStyleType: 'disc',
            pl: 4,
            py: 0,
          }}>
          <ListItem
            sx={{
              display: 'list-item',
            }}>
            <Typography>
              pratique : où que vous soyez, vous trouverez facilement le ou la
              réparatrice proche et disponible. De plus un système de tchat et{' '}
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              d'auto&#x2011;diagnostic (facultatif) permet de s'assurer que la
              réparation{' '}
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              pourra être effectuée. Enfin un carnet d'entretien du vélo compile
              toutes les réparations effectuées dessus.
            </Typography>
          </ListItem>
          <ListItem
            sx={{
              display: 'list-item',
            }}>
            <Typography>
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              des mécanicien·nes engagé·es : étant membres de l'économie sociale
              et solidaire, ou artisan·es indépendant·es, les mécanicien·nes
              tendent à être le plus vertueux possible dans leurs pratiques
              (voir
              <NextLink href="/notre-collectif" legacyBehavior passHref>
                <Link sx={{fontWeight: 800}} underline="none">
                  {' '}
                  qui sommes-nous
                </Link>
              </NextLink>{' '}
              et
              <NextLink href="/notre-charte" legacyBehavior passHref>
                <Link sx={{fontWeight: 800}} underline="none">
                  {' '}
                  notre charte
                </Link>
              </NextLink>
              ).
            </Typography>
          </ListItem>
          <ListItem
            sx={{
              display: 'list-item',
            }}>
            <Typography>
              une plateforme éthique : développée sous licence libre, Rustine
              Libre ne revend pas vos données.
            </Typography>
          </ListItem>
        </List>
      </Box>
    ),
  },
  {
    id: 3,
    question: "Est-ce que l’utilisation de l'application est payante ?",
    answer: () => (
      <Box>
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        <Typography>L'utilisation de l'application est gratuite.</Typography>
        <Typography>
          Aucune transaction ne se fait sur la plateforme, et le paiement des
          réparations se fait selon les modalités de chaque mécanicien·ne
          référencée.
        </Typography>
      </Box>
    ),
  },
  {
    id: 4,
    question: 'Qui garantit les réparations faites sur mon vélo ?',
    answer: () => (
      <Box>
        <Typography>
          Chaque professionnel·les référencé·e sur la plateforme garantit ses
          propres réparations.
        </Typography>
        <Typography>
          Rustine Libre garantit de vous proposer des mécanicien·nes qui se sont
          engagé·es à respecter la charte, et veille au respect de celle-ci.
        </Typography>
      </Box>
    ),
  },
  {
    id: 5,
    question: 'Qui contacter en cas de problème ?',
    answer: () => (
      <Box>
        <Typography>
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          L'adresse{' '}
          <NextLink
            href="mailto:contact@rustinelibre.fr"
            legacyBehavior
            passHref>
            <Link sx={{fontWeight: 800}} underline="none">
              {' '}
              contact@rustinelibre.fr{' '}
            </Link>
          </NextLink>{' '}
          est à votre écoute pour toute difficulté avec notre plateforme.
        </Typography>
      </Box>
    ),
  },
  {
    id: 6,
    question: 'Comment devenir réparateur sur Rustine Libre ?',
    answer: () => (
      <Box>
        <Typography>
          Pour rejoindre les réparateur·ices de Rustine Libre, vous pouvez{' '}
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          remplir le formulaire "Devenir réparateur".
        </Typography>
        <Typography>
          Votre collectif local prendra contact avec vous pour vous expliquer
          les modalités.
        </Typography>
      </Box>
    ),
  },
  {
    id: 7,
    question: 'Comment supprimer mon compte ?',
    answer: () => (
      <Box>
        <Typography>
          La suppression de votre compte supprimera immédiatement vos données.
        </Typography>
      </Box>
    ),
  },
];

export default questions;
