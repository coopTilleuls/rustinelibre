import {NextPageWithLayout} from 'pages/_app';
import React from 'react';
import Head from 'next/head';
import {
  Container,
  Typography,
  Paper,
  Box,
  List,
  ListItem,
  Link,
} from '@mui/material';
import WebsiteLayout from '@components/layout/WebsiteLayout';
import Preamble from '@components/privacy-policy/Preamble';
import PrinciplesGoverningTheTreatmentsPerformed from '@components/privacy-policy/PrinciplesGoverningTheTreatmentsPerformed';
import ProcessingOfYourData from '@components/privacy-policy/ProcessingOfYourData';
import YourRights from '@components/privacy-policy/YourRights';
import Notifications from '@components/privacy-policy/Notifications';
import Cookies from '@components/privacy-policy/Cookies';
import NextLink from 'next/link';

const LegalNotice: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Mentions légales | Rustine Libre</title>
      </Head>
      <WebsiteLayout>
        <Box
          bgcolor="lightprimary.light"
          height="100%"
          width="100%"
          position="absolute"
          top="0"
          left="0"
          zIndex="-1"
        />
        <Container>
          <Box display="flex" flexDirection="column" gap={6} py={4}>
            <Typography variant="h1" color="primary" textAlign="center">
              Mentions légales
            </Typography>
            <Box display="flex" flexDirection="column" gap={3}>
              <Typography>
                <Typography
                  sx={{
                    display: 'inline',
                    fontWeight: 600,
                  }}>
                  {' '}
                  Editeur du site :{' '}
                </Typography>
                Association ANIS-Catalyst
              </Typography>
              <Typography>
                <Typography
                  sx={{
                    display: 'inline',
                    fontWeight: 600,
                  }}>
                  {' '}
                  Siège Social :{' '}
                </Typography>
                La Coroutine, 16, allée de la Filature - 59 000 Lille
              </Typography>
              <Typography>
                <Typography
                  sx={{
                    display: 'inline',
                    fontWeight: 600,
                  }}>
                  E-mail de contact :{' '}
                </Typography>
                <NextLink
                  href="mailto:contact@rustinelibre.fr"
                  legacyBehavior
                  passHref>
                  <Link sx={{fontWeight: 800}} underline="none">
                    {' '}
                    contact@rustinelibre.fr
                  </Link>
                </NextLink>
              </Typography>
              <Typography>
                <Typography
                  sx={{
                    display: 'inline',
                    fontWeight: 600,
                  }}>
                  {' '}
                  Directrice de la Publication :{' '}
                </Typography>
                Marie-Charlotte WOETS
              </Typography>
              <Typography>
                <Typography
                  sx={{
                    display: 'inline',
                    fontWeight: 600,
                  }}>
                  {' '}
                  Hébergeur du site :{' '}
                </Typography>
                Le site est hébergé par la société Google Cloud Platform,
                immatriculée au RCS de Paris sous le numéro Paris B 881 721 583,
                et dont l’adresse postale est le 8 rue de Londres 75009 Paris,
                France.
              </Typography>
              <Typography>
                La plateforme Rustine Libre, responsable de traitement, met en
                œuvre un traitement de données à caractère personnel ayant pour
                finalité l’approvisionnement en circuit court auprès de
                producteurs ou autres organisateurs de circuits courts. Vous
                pouvez exprimer votre accord ou refus lors de votre inscription
                ou à tout autre moment.
              </Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                <Typography>
                  Les données personnelles collectées sont destinées
                  exclusivement Rustine Libre, qui n’en fait pas d’autre usage
                  que les stocker et les conserver pour le compte des
                  organisateurs de circuits courts réalisant des ventes via la
                  plateforme.
                </Typography>
                <Typography>
                  Conformément à la loi Informatique et Libertés du 6 janvier
                  vous disposez d’un droit d’accès, de rectification,
                  d’opposition, de suppression, de limitation, de portabilité de
                  vos données et à ne pas faire l’objet d’une décision
                  individuelle basée sur un traitement automatisé des données, y
                  compris le profilage. Vous seul pouvez exercer ces droits sur
                  vos propres données en vous adressant à Rustine Libre à
                  <NextLink
                    href="mailto:contact@rustinelibre.fr"
                    legacyBehavior
                    passHref>
                    <Link sx={{fontWeight: 800}} underline="none">
                      {' '}
                      contact@rustinelibre.fr{' '}
                    </Link>
                  </NextLink>
                  en précisant dans l’objet du courrier « Droit des personnes »
                  et en joignant la copie de votre justificatif d’identité.
                </Typography>
                <Typography>
                  Vous pouvez également nous transmettre vos directives
                  relatives à la conservation, à l’effacement et à la
                  communication de vos données personnelles après votre décès.
                </Typography>
                <Typography>
                  En cas de réponse non satisfaisante, vous avez la possibilité
                  de saisir la CNIL.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      </WebsiteLayout>
    </>
  );
};

export default LegalNotice;
