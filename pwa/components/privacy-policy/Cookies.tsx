import React from 'react';
import {Typography, Box, Link} from '@mui/material';
import NextLink from 'next/link';

const Cookies = (): JSX.Element => {
  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Typography variant="h3" color="primary">
        A propos des cookies
      </Typography>
      <Box display="flex" flexDirection="column" gap={1}>
        <Typography>
          Un « cookie » est un fichier de taille limitée, généralement constitué
          de lettres et de chiffres, déposé ou lu sur votre terminal
          (ordinateur, tablette, smartphone) lors de votre navigation sur les
          pages de notre site.
        </Typography>
        <Typography>
          En savoir plus sur les cookies, leur fonctionnement et les moyens de
          s’y opposer <br />
          <NextLink
            href="https://www.cnil.fr/fr/cookies-et-autres-traceurs/comment-se-proteger/maitriser-votre-navigateur"
            legacyBehavior
            passHref>
            <Link sx={{fontWeight: 800}} underline="none">
              https://www.cnil.fr/fr/cookies-et-autres-traceurs/comment-se-proteger/maitriser-votre-navigateur
            </Link>
          </NextLink>
        </Typography>
      </Box>
    </Box>
  );
};

export default Cookies;
