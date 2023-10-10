import React from 'react';
import {Typography, Box} from '@mui/material';
import {
  accuracyOfInformations,
  mandatoryInformations,
  platformAccess,
  responsibility,
  unsubscribe,
} from '@data/cgu/registration';

const Registration = (): JSX.Element => {
  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Typography variant="h3" color="primary">
        5 - Inscription
      </Typography>
      <Box display="flex" flexDirection="column" gap={1}>
        <Typography variant="h5" color="secondary">
          5.1 - L’inscription d’un Cycliste se fait de façon spontanée sur
          l’initiative de l’internaute
        </Typography>
        <Typography>
          L’inscription d’un Cycliste est gratuite. Une inscription incomplète
          ne pourra pas être prise en compte, en particulier, si le Cycliste ne
          valide pas le lien de confirmation envoyé à son adresse e-mail.
        </Typography>
      </Box>
      <Box display="flex" flexDirection="column" gap={1}>
        <Typography variant="h5" color="secondary">
          5.2 - Information obligatoire
        </Typography>
        {mandatoryInformations.map(({id, content}) => {
          return <Typography key={id}>{content}</Typography>;
        })}
      </Box>
      <Box display="flex" flexDirection="column" gap={1}>
        <Typography variant="h5" color="secondary">
          5.3 - Inscription comme réparateur
        </Typography>
        <Typography>
          L’inscription comme Réparateur sur la Plateforme se fait par requête
          via la page « devenir réparateur » . Un formulaire d’inscription
          permet de contacter le Collectif administrant la Plateforme. Des
          échanges entre le candidat Réparateur et le Collectif auront lieu pour
          valider l’inscription en tant que Réparateur sur la Plateforme. Le
          candidat Réparateur devra accepter les présentes CGU ainsi que la
          Charte pour accéder au service.
        </Typography>
      </Box>
      <Box display="flex" flexDirection="column" gap={1}>
        <Typography variant="h5" color="secondary">
          5.4 - Notifications
        </Typography>
        <Typography>
          La Plateforme informera le Gérant par mail des notifications relatives
          à l’état du service ou pouvant impacter la relation contractuelle. Il
          n’est pas possible de désactiver les notifications, ni de refuser de
          recevoir les e-mails relatifs à l’information juridique pouvant
          impacter la relation contractuelle.
        </Typography>
      </Box>
      <Box display="flex" flexDirection="column" gap={1}>
        <Typography variant="h5" color="secondary">
          5.5 - Accès à la Plateforme
        </Typography>
        {platformAccess.map(({id, content}) => {
          return <Typography key={id}>{content}</Typography>;
        })}
      </Box>
      <Box display="flex" flexDirection="column" gap={1}>
        <Typography variant="h5" color="secondary">
          5.6 - Sincèrité des informations de l&apos;utilisateur
        </Typography>
        {accuracyOfInformations.map(({id, content}) => {
          return <Typography key={id}>{content}</Typography>;
        })}
      </Box>
      <Box display="flex" flexDirection="column" gap={1}>
        <Typography variant="h5" color="secondary">
          5.7 - Responsabilité
        </Typography>
        {responsibility.map(({id, content}) => {
          return <Typography key={id}>{content}</Typography>;
        })}
      </Box>
      <Box display="flex" flexDirection="column" gap={1}>
        <Typography variant="h5" color="secondary">
          5.8 - Désinscription
        </Typography>
        {unsubscribe.map(({id, content}) => {
          return <Typography key={id}>{content}</Typography>;
        })}
      </Box>
    </Box>
  );
};

export default Registration;
