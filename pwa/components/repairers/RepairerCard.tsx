import React, {PropsWithRef, useContext} from 'react';
import Link from 'next/link';
import {
  Box,
  Button,
  Stack,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import {SearchRepairerContext} from '@contexts/SearchRepairerContext';
import {apiImageUrl} from '@helpers/apiImagesHelper';
import {formatDate} from 'helpers/dateHelper';
import {Repairer} from '@interfaces/Repairer';
import useMediaQuery from "@hooks/useMediaQuery";

interface RepairerProps extends PropsWithRef<any> {
  repairer: Repairer;
}

export const RepairerCard = ({repairer}: RepairerProps): JSX.Element => {
  const {sortChosen, selectedRepairer} = useContext(SearchRepairerContext);
  const isMobile = useMediaQuery('(max-width: 640px)');

  return (
    <Link href={`/reparateur/${repairer.id}`} style={{textDecoration: 'none'}}>
      <Card
        sx={{
          boxShadow: 0,
          border: (theme) => !isMobile ? `4px solid ${theme.palette.grey[300]}` : '',
          display: 'flex',
          backgroundColor:
            repairer.id === (selectedRepairer) ? 'lightblue' : 'white',
        }}>
        <CardMedia
          component="img"
          sx={{
            width: {xs: 100, md: 150},
            height: {xs: 100, md: 150},
            p: 2,
            borderRadius: '50%',
          }}
          image={
            repairer.thumbnail
              ? apiImageUrl(repairer.thumbnail.contentUrl)
              : 'https://cdn.cleanrider.com/uploads/2021/04/prime-reparation-velo_140920-3.jpg'
          }
          alt="Photo du réparateur"
        />
        <CardContent
          sx={{
            pl: 0,
            pr: 2,
            py: 2,
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
          }}>
          <Stack spacing={{xs: 1, md: 2}}>
            <div>
              <Typography
                fontSize={{xs: 16, md: 24}}
                fontWeight={600}
                sx={{wordBreak: 'break-word'}}>
                {repairer.name}
              </Typography>
              {repairer.latitude && repairer.longitude && repairer.distance && (
                <Typography
                  fontSize={{xs: 12, md: 14}}
                  color="primary"
                  display="flex"
                  alignItems="center">
                  <FmdGoodIcon /> {repairer.distance} m
                </Typography>
              )}
            </div>
            <div>
              <Typography
                color="text.secondary"
                fontSize={{xs: 14, md: 16}}
                fontWeight={600}>
                Adresse :
              </Typography>
              <Typography color="text.secondary" fontSize={{xs: 14, md: 16}}>
                {repairer.street}
              </Typography>
              <Typography
                color="text.secondary"
                textTransform="capitalize"
                fontSize={{xs: 14, md: 16}}>
                {repairer.postcode} - {repairer.city}
              </Typography>
            </div>
            <Box
              display="flex"
              flexDirection={{xs: 'column', md: 'row'}}
              justifyContent="space-between"
              alignItems={{xs: 'start', md: 'center'}}>
              <div>
                <Typography
                  color="text.secondary"
                  fontSize={{xs: 14, md: 16}}
                  fontWeight={600}>
                  Prochaine disponibilité :
                </Typography>
                <Typography
                  paragraph
                  fontSize={{xs: 14, md: 16}}
                  color="text.secondary">
                  {repairer.firstSlotAvailable
                    ? formatDate(repairer.firstSlotAvailable)
                    : 'Pas de créneau indiqué'}
                </Typography>
              </div>
              <div>
                <Button variant="contained" sx={{textTransform: 'capitalize'}}>
                  Je réserve
                </Button>
              </div>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Link>
  );
};
