import React from 'react';
import {Box, Typography, Button, Stack} from '@mui/material';
import {Repairer} from '@interfaces/Repairer';
import {isRepairerItinerant} from "@helpers/rolesHelpers";

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
    <Stack
      spacing={4}
      display="flex"
      flexDirection="column"
      alignItems="center">
      <Typography component="h2" fontSize={18} fontWeight={600} my={{xs: 2}}>
        Récapitulatif
      </Typography>
      <Typography align="justify" sx={{mt: 2, textTransform: 'capitalize'}}>
          {isRepairerItinerant(repairer) ? `Votre RDV: ${date} avec "${repairer.name}"` : `Votre RDV: ${date} chez ${repairer.name}`}
      </Typography>

      <Box>
        <Button onClick={handleConfirmAppointment} variant="contained">
          Confirmer le rendez-vous
        </Button>
      </Box>
    </Stack>
  );
};

export default RecapStep;
