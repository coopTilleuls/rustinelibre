import React from 'react';
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

interface RepairerProps {
  repairer: Repairer;
}

export const RepairerCard = ({repairer}: RepairerProps): JSX.Element => {
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
              <Typography
                fontSize={{xs: 14, md: 24}}
                fontWeight={600}
                sx={{textDecoration: 'none'}}>
                {repairer.name}
              </Typography>
              <Box>
                <Typography color="text.secondary">
                  {repairer.street}
                </Typography>
                <Typography color="text.secondary">
                  {repairer.postcode} {repairer.city}
                </Typography>
              </Box>
              <Box>
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
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Paper>
    </Link>
  );
};
