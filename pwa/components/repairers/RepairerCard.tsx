import React, {PropsWithRef, useContext} from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
  ButtonBase,
} from '@mui/material';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import {SearchRepairerContext} from '@contexts/SearchRepairerContext';
import {formatDate} from 'helpers/dateHelper';
import {Repairer} from '@interfaces/Repairer';

interface RepairerProps extends PropsWithRef<any> {
  repairer: Repairer;
  onClick?: () => void;
}

export const RepairerCard = ({
  repairer,
  onClick,
}: RepairerProps): JSX.Element => {
  const {selectedRepairer} = useContext(SearchRepairerContext);

  return (
    <ButtonBase
      component="div"
      sx={{borderRadius: 6, width: '100%', height: '100%'}}
      onClick={onClick}>
      <Card
        elevation={1}
        sx={{
          display: 'flex',
          height: '100%',
          flexDirection: 'row',
          borderRadius: 6,
          outlineOffset: '-1px',
          transition: 'all ease 0.5s',
          justifyContent: {xs: 'center', sm: 'flex-start'},
          width: '100%',
          p: 0,
          backgroundColor:
            repairer.id === selectedRepairer ? 'lightsecondary.main' : 'white',
          ':hover': {
            boxShadow: 5,
            '& .MuiButtonBase-root': {
              bgcolor: 'primary.main',
            },
            '& .MuiTypography-h5': {
              color: 'primary.main',
            },
          },
        }}>
        <CardMedia
          component="img"
          sx={{
            p: {xs: 2, sm: 0},
            width: {xs: 100, lg: 170},
            minWidth: {xs: 'none', sm: '30%'},
            height: {xs: 100, sm: '100%'},
            borderRadius: {xs: '50%', sm: '0'},
          }}
          image={
            repairer.thumbnail
              ? repairer.thumbnail.contentUrl
              : 'https://cdn.cleanrider.com/uploads/2021/04/prime-reparation-velo_140920-3.jpg'
          }
          alt="Photo du réparateur"
        />
        <CardContent sx={{flex: 1}}>
          <Box mb={3}>
            <Typography
              variant="h5"
              color="secondary.main"
              component="div"
              sx={{wordBreak: 'break-word', transition: 'color ease 0.3s'}}>
              {repairer.name}
            </Typography>
            {repairer.latitude && repairer.longitude && repairer.distance && (
              <Typography
                variant="caption"
                mb={2}
                fontWeight={600}
                color="primary"
                display="flex"
                alignItems="center">
                <FmdGoodIcon fontSize="small" /> {repairer.distance} m
              </Typography>
            )}
            <div>
              <Typography color="text.secondary" variant="body2">
                {repairer.streetNumber} {repairer.street}
              </Typography>
              <Typography
                color="text.secondary"
                textTransform="capitalize"
                variant="body2">
                {repairer.postcode} - {repairer.city}
              </Typography>
            </div>
          </Box>
          <Box
            display="flex"
            width="100%"
            flexDirection={{xs: 'column', md: 'row'}}
            gap={3}
            justifyContent="space-between"
            flexWrap="wrap"
            alignItems="start">
            <div>
              <Typography
                color="text.secondary"
                variant="body2"
                fontWeight={700}
                component="div">
                Prochaine disponibilité&nbsp;:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {repairer.firstSlotAvailable
                  ? formatDate(repairer.firstSlotAvailable)
                  : 'Pas de créneau indiqué'}
              </Typography>
            </div>
            <Button
              onClick={onClick}
              size="medium"
              color="secondary"
              variant="contained">
              Je&nbsp;réserve
            </Button>
          </Box>
        </CardContent>
      </Card>
    </ButtonBase>
  );
};
