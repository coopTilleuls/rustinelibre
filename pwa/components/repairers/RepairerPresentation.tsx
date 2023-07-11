import React from 'react';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {Container, Box, Typography, Stack, Button} from '@mui/material';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import LocationCity from '@mui/icons-material/LocationCity';
import {formatDate} from 'helpers/dateHelper';
import {Repairer} from '@interfaces/Repairer';

interface RepairerPresentationProps {
  repairer: Repairer;
}

const RepairerPresentation = ({repairer}: RepairerPresentationProps) => {
  const {query} = useRouter();

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

  const repairerPicture = repairer.thumbnail
    ? repairer.thumbnail.contentUrl
    : 'https://cdn.cleanrider.com/uploads/2021/04/prime-reparation-velo_140920-3.jpg';

  return (
    <>
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
            flexDirection: 'row-reverse',
            alignItems: 'flex-start',
            gap: 8,
            maxWidth: '1000px!important',
          }}>
          <Box
            sx={{
              background: 'white',
              width: '300px',
              borderRadius: 6,
              boxShadow: 5,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              position: 'sticky',
              top: '112px',
              zIndex: 2,
              mb: 2,
            }}>
            <Box
              sx={{
                aspectRatio: '4/3',
                width: '100%',
                overflow: 'hidden',
              }}>
              <img
                src={repairerPicture}
                alt=""
                style={{width: '100%', height: '100%', objectFit: 'cover'}}
              />
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'start',
                px: 3,
                py: 2,
              }}>
              <Typography
                variant="body2"
                mb={1}
                color="text.secondary"
                sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                <FmdGoodIcon color="primary" /> {repairer.streetNumber}{' '}
                {repairer.street}
              </Typography>
              <Typography
                variant="body2"
                mb={1}
                color="text.secondary"
                sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                <LocationCity color="primary" />
                {repairer.postcode} {repairer.city}
              </Typography>
              {repairer.mobilePhone ? (
                <Typography
                  variant="body2"
                  mb={1}
                  color="text.secondary"
                  sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                  <PhoneAndroidIcon color="primary" /> {repairer.mobilePhone}
                </Typography>
              ) : null}
              <Box
                mt={1}
                pt={2}
                borderTop="1px solid"
                borderColor="grey.300"
                textAlign="center"
                width="100%">
                {repairer.firstSlotAvailable && (
                  <Box zIndex={1} mb={2}>
                    <Typography
                      variant="body2"
                      color="secondary.main"
                      fontWeight={600}>
                      Prochain rendez-vous disponible :
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(repairer.firstSlotAvailable)}
                    </Typography>
                  </Box>
                )}
                <Link
                  href={`/reparateur/${repairer.id}/creneaux`}
                  legacyBehavior
                  passHref>
                  <Button variant="contained">Je réserve</Button>
                </Link>
              </Box>
            </Box>
          </Box>
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
                sx={{my: 1}}>
                {repairer.name}
              </Typography>
              <Typography variant="h4">
                {repairer.repairerType?.name}
              </Typography>
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
            {repairer.descriptionPicture ? (
              <img
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  maxHeight: '350px',
                  alignSelf: 'flex-start',
                }}
                src={repairer.descriptionPicture.contentUrl}
                alt="Photo de description du réparateur"
              />
            ) : null}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default RepairerPresentation;
