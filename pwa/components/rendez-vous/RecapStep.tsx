import React from 'react';
import {Box, Typography, Button, Stack, Card, Avatar} from '@mui/material';
import {Repairer} from '@interfaces/Repairer';
import {isRepairerItinerant} from '@helpers/rolesHelpers';
import {getTimeFromDateAsString} from 'helpers/dateHelper';
import {CalendarMonth, Schedule} from '@mui/icons-material';

interface RecapStepProps {
  repairer: Repairer;
  slotSelected: string;
  handleConfirmAppointment: () => void;
}

const RecapStep = ({
  repairer,
  slotSelected,
  handleConfirmAppointment,
}: RecapStepProps) => {
  const date: string = new Date(slotSelected).toLocaleString('fr-FR', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Box display="flex" flexDirection="column" width="100%" alignItems="center">
      <Typography variant="h5" sx={{my: 2}}>
        Récapitulatif
      </Typography>
      <Typography align="justify">
        {isRepairerItinerant(repairer)
          ? `Votre RDV avec "${repairer.name}"`
          : `Votre RDV chez ${repairer.name}`}
      </Typography>
      <Card
        elevation={0}
        sx={{
          borderRadius: 6,
          transition: 'all ease 0.5s',
          width: '100%',
          maxWidth: '400px',
          mx: 'auto',
          mt: 2,
          textAlign: 'left',
          border: '1px solid',
          borderColor: 'grey.300',
          p: 0,
        }}>
        <Box display="flex" alignItems="center" p={2} gap={2}>
          <Avatar
            sx={{width: 42, height: 42, display: {xs: 'none', sm: 'block'}}}
            src={
              repairer?.thumbnail?.contentUrl ||
              'https://cdn.cleanrider.com/uploads/2021/04/prime-reparation-velo_140920-3.jpg'
            }></Avatar>
          <Box display="flex" flexDirection="column" flex={1}>
            <Typography variant="h5" color="text.secondary" mb={1}>
              {repairer.name}
            </Typography>
            <Box
              display="flex"
              flexDirection="row"
              gap={2}
              color="text.secondary"
              textAlign="center">
              <Box display="flex" gap={1} alignItems="center">
                <CalendarMonth sx={{fontSize: '16px'}} color="primary" />
                <Typography
                  variant="body1"
                  component="div"
                  textTransform="capitalize">
                  {date}
                </Typography>
              </Box>
              <Box display="flex" gap={1} alignItems="center">
                <Schedule sx={{fontSize: '16px'}} color="primary" />
                <Typography variant="body1" component="div">
                  {getTimeFromDateAsString(slotSelected)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Card>

      <Box mt={4}>
        <Button
          onClick={handleConfirmAppointment}
          variant="contained"
          size="large">
          Confirmer le rendez-vous
        </Button>
      </Box>
    </Box>
  );
};

export default RecapStep;
