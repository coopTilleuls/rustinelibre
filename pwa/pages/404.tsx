import {NextPageWithLayout} from 'pages/_app';
import React from 'react';
import Head from 'next/head';
import {
  Button,
  Link,
  Typography,
  Stack,
  Box,
  useMediaQuery,
} from '@mui/material';
import WebsiteLayout from '@components/layout/WebsiteLayout';
import theme from 'styles/theme';

const Error404: NextPageWithLayout = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <>
      <Head>
        <title>404</title>
      </Head>
      <WebsiteLayout>
        <Stack
          sx={{
            width: '100%',
            minHeight: isMobile ? 400 : 500,
            bgcolor: 'lightprimary.main',
          }}
          spacing={isMobile ? 6 : 8}
          pt={{xs: 4, md: 8}}
          display="flex"
          flexDirection="column"
          alignItems="center"
          textAlign="center">
          <Box display="flex" alignItems="center" gap={4} flexDirection="row">
            <Typography color="primary" variant="h1" component="h1">
              Désolé
            </Typography>
            <img alt="" src="/img/eclair.svg" width="40px" />
          </Box>
          <Typography>
            Nous ne trouvons pas la page que vous demandez.
          </Typography>
          <Link href="/">
            <Button variant="contained">Retourner sur l&apos;accueil</Button>
          </Link>
        </Stack>
      </WebsiteLayout>
    </>
  );
};

export default Error404;
