import React from 'react';
import {Typography, Box, ListItem} from '@mui/material';
import {
  administrationLevels,
  cyclistsCan,
  managerCan,
  repairerCriteria,
  repairersCan,
} from '@data/cgu/general-operation';

const GeneralOperation = (): JSX.Element => {
  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Typography variant="h3" color="primary">
        3 - Fonctionnement Général
      </Typography>
      <Box display="flex" flexDirection="column" gap={2}>
        <Typography variant="h5" color="secondary">
          3.1 - La Plateforme offre aux internautes un ensemble de
          fonctionnalités (ci-après désignées par “les Fonctionnalités”), leur
          permettant de :
        </Typography>
        <Typography>
          - créer et gérer des entités virtuelles, soit en tant que Cyclistes
          (ci-après appelés Cyclistes) soit en tant que Réparateurs (ci-après
          appelés Réparateurs)
        </Typography>
        <Box>
          <Typography>- Les Cyclistes peuvent :</Typography>
          {cyclistsCan.map(({id, content}) => {
            return (
              <ListItem key={id} sx={{display: 'list-item', py: 0}}>
                {content}
              </ListItem>
            );
          })}
        </Box>
        <Box>
          <Typography>- Les Réparateurs peuvent :</Typography>
          {repairersCan.map(({id, content}) => {
            return (
              <ListItem key={id} sx={{display: 'list-item', py: 0}}>
                {content}
              </ListItem>
            );
          })}
        </Box>
        <Box>
          <Typography>
            - Pour les Réparateurs présents sur la plateforme il existe deux
            niveaux d’administration :
          </Typography>
          {administrationLevels.map(({id, content}) => {
            return (
              <ListItem key={id} sx={{display: 'list-item', py: 0}}>
                {content}
              </ListItem>
            );
          })}
        </Box>
        <Box>
          <Typography>
            - Le Gérant administre le compte de l’Entité de Réparation sur la
            plateforme. Il peut :
          </Typography>
          {managerCan.map(({id, content}) => {
            return (
              <ListItem key={id} sx={{display: 'list-item', py: 0}}>
                {content}
              </ListItem>
            );
          })}
        </Box>
        <Box>
          <Typography>
            Un Membre bénéficie des Fonctionnalités attribuées aux Réparateurs.
          </Typography>
          <Typography>
            Les internautes doivent s’inscrire sur la Plateforme pour pouvoir y
            apparaître en tant que Réparateur ou Cycliste.
          </Typography>
          <Typography>
            Les internautes doivent s’inscrire en tant que Cycliste pour prendre
            un rendez-vous avec un Réparateur et créer un carnet d’entretien.
          </Typography>
          <Typography>
            La recherche de Réparateurs et la consultation des Boutiques est
            accessible sans inscription.
          </Typography>
        </Box>
      </Box>
      <Box display="flex" flexDirection="column" gap={2}>
        <Typography variant="h5" color="secondary">
          3.2 - La Plateforme réalise un classement des Réparateurs selon des
          critères neutres et objectifs :
        </Typography>
        <Box display="flex" flexDirection="column" gap={1}>
          {repairerCriteria.map(({id, content}) => {
            return <Typography key={id}>{content}</Typography>;
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default GeneralOperation;
