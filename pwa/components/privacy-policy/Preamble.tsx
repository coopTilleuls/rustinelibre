import React from 'react';
import {Typography, Box, Link} from '@mui/material';
import NextLink from 'next/link';

const Preamble = (): JSX.Element => {
  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Typography variant="h3" color="primary">
        Préambule
      </Typography>
      <Box display="flex" flexDirection="column" gap={2}>
        <Typography>
          La présente « Politique de confidentialité » a pour but de fournir
          toute information sur les traitements réalisés sur les données à
          caractère personnel collectées auprès des utilisateurs de la
          plateforme Rustine Libre.
        </Typography>
        <Typography>
          Le responsable de ces traitements est Rustine Libre dont les
          coordonnées sont les suivantes : <br />
          Rustine Libre, hébergée légalement par l’association ANIS-Catalyst,
          située à <br />
          <Box paddingLeft={'20px'}>
            A La Coroutine <br />
            16, allée de la Filature <br />
            59 000 Lille
          </Box>
        </Typography>
        <Typography>
          Pour contacter le responsable de vos données personnelles :{' '}
          <NextLink
            href="mailto:contact@rustinelibre.fr"
            legacyBehavior
            passHref>
            <Link sx={{fontWeight: 800}} underline="none">
              contact@rustinelibre.fr
            </Link>
          </NextLink>
        </Typography>
        <Typography>
          Il est toutefois précisé qu’au-delà des traitements mis en œuvre dans
          le cadre du fonctionnement de la plateforme et de la réalisation des
          prestations liées, les Réparateurs utilisant la plateforme sont
          également susceptibles de mettre en œuvre leurs propres traitements
          pour l’exécution de leurs prestations. Ils sont alors responsables de
          ces traitements.
        </Typography>
      </Box>
    </Box>
  );
};

export default Preamble;
