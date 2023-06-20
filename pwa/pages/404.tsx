import {NextPageWithLayout} from 'pages/_app';
import React from 'react';
import Head from 'next/head';
import {Button, Container, Link, Typography, Stack} from '@mui/material';
import WebsiteLayout from '@components/layout/WebsiteLayout';

const Error404: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>404</title>
      </Head>
      <WebsiteLayout>
        <Container sx={{width: {xs: '100%', md: '70%'}}}>
          <Stack
            spacing={4}
            pt={{xs: 4, md: 8}}
            display="flex"
            flexDirection="column"
            alignItems="center"
            textAlign="center">
            <Typography fontSize={{xs: 28, md: 30}} fontWeight={600}>
              Désolé !
            </Typography>
            <Typography>
              Nous ne trouvons pas la page que vous demandez.
            </Typography>
            <Link href="/">
              <Button
                variant="contained"
                sx={{textTransform: 'capitalize'}}
                size="small">
                Retourner sur l&apos;accueil
              </Button>
            </Link>
          </Stack>
        </Container>
      </WebsiteLayout>
    </>
  );
};

export default Error404;
