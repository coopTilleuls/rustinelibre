import React from 'react';
import Link from 'next/link';
import {useRouter} from 'next/router';
import RepairerPresentationCard from './RepairerPresentationCard';
import {
  Container,
  Box,
  Typography,
  Stack,
  Button,
  useMediaQuery,
} from '@mui/material';
import {Repairer} from '@interfaces/Repairer';
import theme from 'styles/theme';
import RepairerPresentationImage from './RepairerPresentationImage';

interface RepairerPresentationProps {
  repairer: Repairer;
}

const RepairerPresentation = ({repairer}: RepairerPresentationProps) => {
  const {query} = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  let linkHref;

  if (query.favorite) {
    linkHref = '/';
  } else if (query.appointment) {
    linkHref = '/rendez-vous/mes-rendez-vous';
  } else if (query.repairerList) {
    linkHref = '/liste-des-reparateurs';
  } else if (query.searchRepairer) {
    linkHref = '/reparateur/chercher-un-reparateur';
  } else {
    linkHref = '/';
  }

  return (
    <Box pt={4} pb={8} sx={{overflowX: 'clip'}}>
      <Box
        bgcolor="lightprimary.light"
        height="100%"
        width="100%"
        position="absolute"
        top="0"
        left="0"
        zIndex="-1"
      />
      <Container
        sx={{
          display: 'flex',
          flexDirection: {xs: 'column', md: 'row-reverse'},
          alignItems: 'flex-start',
          gap: 8,
          maxWidth: '1000px!important',
        }}>
        <RepairerPresentationCard
          repairer={repairer}
          sx={{
            position: 'sticky',
            width: '300px',
            top: '112px',
            display: {xs: 'none', md: 'flex'},
          }}
        />
        <Stack spacing={4} flex={1} pt={2}>
          <Box>
            <Link href={linkHref}>
              <Button variant="outlined" color="secondary" size="small">
                Retour
              </Button>
            </Link>
            <Typography
              component="h1"
              variant="h1"
              color="primary.main"
              sx={{my: 1, textAlign: {xs: 'center', md: 'left'}}}>
              {repairer.name}
            </Typography>
            <Typography
              variant="h4"
              sx={{textAlign: {xs: 'center', md: 'left'}}}>
              {repairer.repairerType?.name}
            </Typography>
            {repairer.descriptionPicture && !isMobile ? (
              <RepairerPresentationImage repairer={repairer} />
            ) : null}
            <RepairerPresentationCard
              repairer={repairer}
              sx={{
                width: '100%',
                display: {xs: 'flex', md: 'none'},
                my: 3,
              }}
            />
            {repairer.description && (
              <Typography
                paragraph
                color="text.secondary"
                mt={3}
                dangerouslySetInnerHTML={{__html: repairer.description}}
              />
            )}
          </Box>
          {repairer.openingHours && (
            <Box>
              <Typography variant="h6" color="secondary.main">
                Horaires :
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                dangerouslySetInnerHTML={{__html: repairer.openingHours}}
              />
            </Box>
          )}
          {repairer.descriptionPicture && isMobile ? (
            <RepairerPresentationImage repairer={repairer} />
          ) : null}
        </Stack>
      </Container>
    </Box>
  );
};

export default RepairerPresentation;
