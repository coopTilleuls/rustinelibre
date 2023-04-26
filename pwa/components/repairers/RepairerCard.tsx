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

interface RepairerProps {
  repairer: Repairer;
  isSelect: boolean;
}

export const RepairerCard = ({
  repairer,
  isSelect,
}: RepairerProps): JSX.Element => {
  return (
    <Link href={`/reparateur/${repairer.id}`} passHref>
      <Card
        sx={{
          display: 'flex',
          marginBottom: '10px',
          backgroundColor: isSelect ? 'lightgreen' : 'white',
        }}>
        <CardMedia
          component="img"
          sx={{width: 151}}
          image={
            repairer.thumbnail
              ? apiImageUrl(repairer.thumbnail.contentUrl)
              : 'https://cdn.cleanrider.com/uploads/2021/04/prime-reparation-velo_140920-3.jpg'
          }
          alt="Photo du réparateur"
        />
        <Box sx={{display: 'flex', flexDirection: 'column'}}>
          <CardContent sx={{flex: '1 0 auto'}}>
            <Typography component="div" variant="h5">
              {repairer.name}
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              component="div">
              {repairer.street} <br />
              {repairer.postcode} {repairer.city}
            </Typography>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              component="div">
              {repairer.firstSlotAvailable !== undefined ? (
                <p>
                  <strong>Prochaine disponibilité : </strong>
                  {formatDate(repairer.firstSlotAvailable)}
                </p>
              ) : (
                'Pas de créneau indiqué'
              )}
            </Typography>
          </CardContent>
        </Box>
      </Card>
    </Link>
  );
};
