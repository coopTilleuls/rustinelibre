import React from 'react';
import {Typography, Box} from '@mui/material';
import {
  appointmentCircle,
  priceAndPayment,
  withdraw,
} from '@data/cgu/available-features';

const AvailableFeatures = (): JSX.Element => {
  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Typography variant="h3" color="primary">
        6 - Fonctionnalités accessibles aux Utilisateurs
      </Typography>
      <Box display={'flex'} flexDirection={'column'} gap={1}>
        <Typography>
          Les Fonctionnalités fournies par la Plateforme aux Utilisateurs sont
          gratuites.
        </Typography>
        <Typography>
          L’Administration ne vend aucun service aux Cyclistes.
        </Typography>
        <Typography>
          Par contre, les Réparateurs peuvent vendre un service suite à la prise
          de Rendez-vous sur la Plateforme. A noter qu’aucun paiement n’aura
          lieu sur la Plateforme. Il se fait lors du Rendez- vous avec le
          Réparateur, en accord avec ses propres conditions générales de ventes.
          Toutefois, le Réparateur s’engage à resoecter les tarifs indiqués sur
          sa Boutique.
        </Typography>
      </Box>
      <Box display="flex" flexDirection="column" gap={1}>
        <Typography variant="h5" color="secondary">
          6.1 - Accès à la prise de rendez-vous
        </Typography>
        <Typography>
          Les Cyclistes et les Réparateurs ont accès aux Fonctionnalités de
          prise de Rendez-vous une fois inscrit sur la Plateforme.
        </Typography>
      </Box>
      <Box display="flex" flexDirection="column" gap={1}>
        <Typography variant="h5" color="secondary">
          6.2 - Description de l’organisation d’un cycle de rendez-vous
        </Typography>
        {appointmentCircle.map(({id, content}) => {
          return <Typography key={id}>{content}</Typography>;
        })}
      </Box>
      <Box display="flex" flexDirection="column" gap={1}>
        <Typography variant="h5" color="secondary">
          6.3 - Prix et paiement
        </Typography>
        {priceAndPayment.map(({id, content}) => {
          return <Typography key={id}>{content}</Typography>;
        })}
      </Box>
      <Box display="flex" flexDirection="column" gap={1}>
        <Typography variant="h5" color="secondary">
          6.4 - Droit de rétractation
        </Typography>
        {withdraw.map(({id, content}) => {
          return <Typography key={id}>{content}</Typography>;
        })}
      </Box>
      <Box display="flex" flexDirection="column" gap={1}>
        <Typography variant="h5" color="secondary">
          6.5 - Réclamations
        </Typography>
        <Typography>
          Les réclamations relatives à des comportements abusifs ou inappropriés
          suite à la prise de rendez-vous via la Plateforme pourront être
          adressées à l’Administration de celle-ci si elle entre dans le cadre
          des Fonctionnalités qu’elle met à disposition des Utilisateurs. Des
          sanctions pourront être prises à l’encontre des Utilisateurs
          concernés.
        </Typography>
      </Box>
    </Box>
  );
};

export default AvailableFeatures;
