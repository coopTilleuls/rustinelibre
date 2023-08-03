import React, {PropsWithRef} from 'react';
import router from 'next/router';
import {Card, Typography, Box, Button, Avatar} from '@mui/material';
import {formatDate, getTimeFromDateAsString} from 'helpers/dateHelper';
import {Appointment} from '@interfaces/Appointment';
import {CalendarMonth, Schedule} from '@mui/icons-material';

interface AppointmentCardProps extends PropsWithRef<any> {
  appointment: Appointment;
}

export const OldAppointmentCard = ({
  appointment,
}: AppointmentCardProps): JSX.Element => {
  return (
    <Card
      elevation={1}
      sx={{
        borderRadius: 6,
        transition: 'all ease 0.5s',
        width: '100%',
        maxWidth: '600px',
        mx: 'auto',
        textAlign: 'left',
        p: 0,
      }}>
      <Box display="flex" alignItems="center" p={2} gap={2}>
        <Avatar
          sx={{width: 42, height: 42, display: {xs: 'none', sm: 'block'}}}
          src={
            appointment.repairer?.thumbnail?.contentUrl ||
            'https://cdn.cleanrider.com/uploads/2021/04/prime-reparation-velo_140920-3.jpg'
          }></Avatar>
        <Box display="flex" flexDirection="column" flex={1}>
          <Typography variant="h5" color="text.secondary">
            {appointment.repairer.name}
          </Typography>
          <Box
            display="flex"
            flexDirection="row"
            gap={2}
            color="grey.500"
            textAlign="center">
            <Box display="flex" gap={1} alignItems="center">
              <CalendarMonth sx={{fontSize: '12px'}} color="inherit" />
              <Typography variant="body2">
                {formatDate(appointment.slotTime, false)}
              </Typography>
            </Box>
            <Box display="flex" gap={1} alignItems="center">
              <Schedule sx={{fontSize: '12px'}} color="inherit" />
              <Typography variant="body2">
                {getTimeFromDateAsString(appointment.slotTime)}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Button
          onClick={() =>
            router.push({
              pathname: `/reparateur/${appointment.repairer.id}`,
              query: {appointment: 1},
            })
          }
          variant="outlined"
          color="secondary"
          size="small"
          sx={{marginLeft: '5px'}}>
          Reprendre RDV
        </Button>
      </Box>
    </Card>
  );
};
