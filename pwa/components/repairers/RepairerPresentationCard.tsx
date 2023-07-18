import React from 'react';
import Link from 'next/link';
import {Box, Typography, Button, SxProps, Theme} from '@mui/material';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import LocationCity from '@mui/icons-material/LocationCity';
import {formatDate} from 'helpers/dateHelper';
import {Repairer} from '@interfaces/Repairer';

const RepairerPresentationCard = ({
  repairer,
  sx,
}: {
  repairer: Repairer;
  sx: SxProps<Theme>;
}) => {
  const repairerPicture = repairer.thumbnail
    ? repairer.thumbnail.contentUrl
    : 'https://cdn.cleanrider.com/uploads/2021/04/prime-reparation-velo_140920-3.jpg';

  return (
    <Box
      sx={{
        background: 'white',
        borderRadius: 6,
        boxShadow: 5,
        display: 'flex',
        flexDirection: {xs: 'column', sm: 'row', md: 'column'},
        maxWidth: {xs: '300px', sm: 'none'},
        mx: 'auto',
        overflow: 'hidden',
        zIndex: 2,
        mb: 2,
        ...sx,
      }}>
      <Box
        sx={{
          aspectRatio: '4/3',
          width: '100%',
          overflow: 'hidden',
          maxHeight: {xs: '130px', sm: 'none'},
          maxWidth: {xs: 'none', sm: '30%', md: 'none'},
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
          flex: 1,
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
  );
};

export default RepairerPresentationCard;
