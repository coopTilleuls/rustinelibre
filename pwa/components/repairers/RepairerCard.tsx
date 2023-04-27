import React, {useContext} from 'react';
import {Repairer} from '@interfaces/Repairer';
import {formatDate} from 'helpers/dateHelper';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import {apiImageUrl} from '@helpers/apiImagesHelper';
import {Paper, Stack} from '@mui/material';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import {SearchRepairerContext} from '@contexts/SearchRepairerContext';

interface RepairerProps {
  repairer: Repairer;
}

export const RepairerCard = ({repairer}: RepairerProps): JSX.Element => {
  const {sortChosen} = useContext(SearchRepairerContext);

  return (
    <Link href={`/reparateur/${repairer.id}`} style={{textDecoration: 'none'}}>
      <Paper elevation={4}>
        <Card
          sx={{
            display: 'flex',
            flexDirection: 'column',
          }}>
          <CardMedia
            component="img"
            sx={{width: 'full', height: 100, opacity: '0.8'}}
            image={
              repairer.thumbnail
                ? apiImageUrl(repairer.thumbnail.contentUrl)
                : 'https://cdn.cleanrider.com/uploads/2021/04/prime-reparation-velo_140920-3.jpg'
            }
            alt="Photo du réparateur"
          />
          <CardContent sx={{display: 'flex', flexDirection: 'column', p: 2}}>
            <Stack spacing={2}>
              <div>
                <Typography fontSize={{xs: 18, md: 24}} fontWeight={600}>
                  {repairer.name}
                </Typography>
                {sortChosen === 'proximity' && (
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
            </Stack>
          </CardContent>
        </Card>
      </Paper>
    </Link>
  );
};
