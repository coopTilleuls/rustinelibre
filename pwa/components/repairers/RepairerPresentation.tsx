import React from 'react';
import Link from 'next/link';
import useMediaQuery from '@hooks/useMediaQuery';
import {Container, Box, Typography, Paper, Stack, Button} from '@mui/material';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import LocationCity from '@mui/icons-material/LocationCity';
import {apiImageUrl} from '@helpers/apiImagesHelper';
import {formatDate} from 'helpers/dateHelper';
import {Repairer} from '@interfaces/Repairer';

interface RepairerPresentationProps {
  repairer: Repairer;
}

const RepairerPresentation = ({repairer}: RepairerPresentationProps) => {
  const isMobile = useMediaQuery('(max-width: 1024px)');

  return (
    <Container maxWidth="md" sx={{padding: {xs: 0}}}>
      <Paper elevation={isMobile ? 0 : 4} sx={{p: 3}}>
        <Link href={`/reparateur/chercher-un-reparateur`}>
          <Button variant="outlined">Retour</Button>
        </Link>
        <Stack
          spacing={5}
          marginBottom={4}
          sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <Box>
            <Typography
              component="h1"
              align="center"
              fontSize={{xs: 34, md: 50}}
              fontWeight={600}
              sx={{mt: 2}}>
              {repairer.name}
            </Typography>
            <Typography
              component="h2"
              align="center"
              fontSize={{xs: 16, md: 20}}
              color="primary">
              {repairer.repairerType?.name}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'start',
            }}>
            <Typography
              paragraph
              fontSize={{xs: 14, md: 18}}
              color="text.secondary"
              sx={{display: 'flex', alignItems: 'center'}}>
              <FmdGoodIcon color="primary" sx={{mr: 1}} /> {repairer.street}
            </Typography>
            <Typography
              paragraph
              fontSize={{xs: 14, md: 18}}
              color="text.secondary"
              sx={{display: 'flex', alignItems: 'center'}}>
              <LocationCity color="primary" sx={{mr: 1}} />
              {repairer.postcode} {repairer.city}
            </Typography>
            <Typography
              paragraph
              fontSize={{xs: 14, md: 18}}
              color="text.secondary"
              sx={{display: 'flex', alignItems: 'center'}}>
              <PhoneAndroidIcon color="primary" sx={{mr: 1}} />{' '}
              {repairer.mobilePhone}
            </Typography>
          </Box>
          {repairer.thumbnail && (
            <>
              <Link
                href={`/reparateur/${repairer.id}/creneaux`}
                style={{textDecoration: 'none'}}>
                <Button variant="contained">Je réserve</Button>
              </Link>
              {repairer.descriptionPicture && <img
                  width="100%"
                  height="auto"
                  src={apiImageUrl(repairer.descriptionPicture.contentUrl)}
                  alt={'Photo de description du réparateur'}
              />}
            </>
          )}
          <Box width={{md: '70%'}}>
            {repairer.description && (
              <>
                <Typography fontSize={{xs: 16, md: 18}} fontWeight={600}>
                  Description :
                </Typography>
                <Typography
                  paragraph
                  fontSize={{xs: 16, md: 18}}
                  color="text.secondary"
                  dangerouslySetInnerHTML={{__html: repairer.description}}
                />
              </>
            )}
            {repairer.firstSlotAvailable && (
              <>
                <Typography fontSize={{xs: 16, md: 18}} fontWeight={600}>
                  Prochain rendez-vous disponible :
                </Typography>
                <Typography
                  paragraph
                  fontSize={{xs: 16, md: 18}}
                  color="text.secondary">
                  {formatDate(repairer.firstSlotAvailable)}
                </Typography>
              </>
            )}
            {repairer.openingHours && (
              <>
                <Typography fontSize={{xs: 16, md: 18}} fontWeight={600}>
                  Horaires :
                </Typography>
                <Typography
                  paragraph
                  fontSize={{xs: 16, md: 18}}
                  color="text.secondary"
                  dangerouslySetInnerHTML={{__html: repairer.openingHours}}
                />
              </>
            )}
          </Box>
          <Link
            href={`/reparateur/${repairer.id}/creneaux`}
            style={{textDecoration: 'none'}}>
            <Button variant="contained">Je réserve</Button>
          </Link>
        </Stack>
      </Paper>
    </Container>
  );
};

export default RepairerPresentation;
