import React from 'react';
import Link from 'next/link';
import {
  Typography,
  Card,
  CardMedia,
  ButtonBase,
  Button,
  Box,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import {Bike} from '@interfaces/Bike';
import Image from 'next/image';

type BikeCardProps = {
  bike: Bike;
};

const BikeCard = ({bike}: BikeCardProps): JSX.Element => {
  return (
    <Link href={`/velos/${bike.id}`} legacyBehavior passHref>
      <ButtonBase
        component="div"
        sx={{
          borderRadius: 6,
          width: '100%',
          height: '100%',
        }}>
        <Card
          elevation={1}
          sx={{
            display: 'flex',
            height: '100%',
            flexDirection: 'column',
            borderRadius: 6,
            transition: 'all ease 0.5s',
            justifyContent: 'flex-start',
            width: '100%',
            p: 0,
            ':hover': {
              boxShadow: 5,
              '& .MuiButtonBase-root': {
                bgcolor: 'primary.main',
                color: 'white',
                borderColor: 'primary.main',
              },
              '& .MuiTypography-h5': {
                color: 'primary.main',
              },
            },
          }}>
          <CardMedia
            component="div"
            sx={{
              width: '100%',
              height: 160,
              overflow: 'hidden',
              position: 'relative',
            }}>
            <Image
              src={bike.picture?.contentUrl || '/img/placeholder-bike.jpg'}
              style={{objectFit: 'cover'}}
              fill
              sizes="300px"
              alt=""
            />
          </CardMedia>

          <Box
            sx={{
              flex: 1,
              display: 'flex',
              px: 2,
              py: 2,
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}>
            <Box flex={1}>
              <Typography
                variant="caption"
                color="text.secondary"
                textTransform="uppercase">
                {bike.bikeType?.name}
              </Typography>
              <Typography variant="h5" component="p">
                {bike.name}
              </Typography>
            </Box>
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              sx={{marginLeft: 'auto', marginTop: 5}}
              startIcon={<EditIcon />}>
              Modifier
            </Button>
          </Box>
        </Card>
      </ButtonBase>
    </Link>
  );
};

export default BikeCard;
