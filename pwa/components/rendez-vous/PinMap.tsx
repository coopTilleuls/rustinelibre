import React from 'react';
import {Box, Typography, Button} from '@mui/material';
import {Repairer} from '@interfaces/Repairer';
import MapPositionUser from '@components/dashboard/appointments/MapPositionUser';

interface PinMapProps {
  repairer: Repairer;
  latitude: string;
  longitude: string;
  cancelPinMap: () => void;
  confirmPinMap: () => void;
  setLatitude: (latitude: string) => void;
  setLongitude: (longitude: string) => void;
}

const PinMap = ({
  repairer,
  latitude,
  longitude,
  cancelPinMap,
  confirmPinMap,
  setLatitude,
  setLongitude,
}: PinMapProps) => {
  return (
    <Box width="100%">
      <Typography pb={2} textAlign="center">
        Placez le repère sur le lieu où vous souhaitez l&apos;intervention du
        réparateur.
      </Typography>
      <MapPositionUser
        repairer={repairer}
        setLatitude={setLatitude}
        setLongitude={setLongitude}
      />
      <Box display="flex" justifyContent="space-between" px={2} pt={2}>
        <Button variant="outlined" onClick={cancelPinMap}>
          Retour
        </Button>
        <Button
          disabled={!longitude || !latitude}
          variant="contained"
          onClick={confirmPinMap}>
          Suivant
        </Button>
      </Box>
    </Box>
  );
};

export default PinMap;
