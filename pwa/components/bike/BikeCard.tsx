import React from 'react';
import Link from 'next/link';
import {Typography, Paper, Card, CardContent, CardMedia} from '@mui/material';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import EditIcon from '@mui/icons-material/Edit';
import {apiImageUrl} from '@helpers/apiImagesHelper';
import {Bike} from '@interfaces/Bike';

type BikeCardProps = {
  bike: Bike;
};

const BikeCard = ({bike}: BikeCardProps): JSX.Element => {
  return (
    <Link href={`/velos/${bike.id}`} style={{textDecoration: 'none'}}>
      <Paper elevation={4}>
        <Card
          sx={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            minHeight: 200,
          }}>
          <EditIcon
            color="primary"
            sx={{position: 'absolute', top: 0, right: 0, m: 2}}
          />
          {bike.picture ? (
            <CardMedia
              component="img"
              alt="Photo du vélo"
              height="140"
              image={apiImageUrl(bike.picture?.contentUrl)}
            />
          ) : (
            <DirectionsBikeIcon fontSize="large" />
          )}
          <CardContent>
            <Typography fontSize={18} color="primary">
              {bike.name}
            </Typography>
          </CardContent>
        </Card>
      </Paper>
    </Link>
  );
};

export default BikeCard;
