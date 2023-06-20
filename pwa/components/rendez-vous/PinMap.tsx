import React, {ChangeEvent} from 'react';
import {Box, Typography, Button, TextField} from '@mui/material';
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
  address: string;
  setAddress: (address: string) => void;
}

const PinMap = ({
  repairer,
  latitude,
  longitude,
  cancelPinMap,
  confirmPinMap,
  setLatitude,
  setLongitude,
  address,
  setAddress
}: PinMapProps): JSX.Element => {

  const handleChangeAddress = (event: ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
  };

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
      {latitude && longitude && <TextField
          margin="normal"
          required
          fullWidth
          id="address"
          label="Indiquez votre adresse et les informations nécessaires pour le réparateur"
          name="address"
          autoComplete="address"
          value={address}
          inputProps={{ maxLength: 250 }}
          onChange={handleChangeAddress}
      />}
      <Box display="flex" justifyContent="space-between" px={2} pt={2}>
        <Button variant="outlined" onClick={cancelPinMap}>
          Retour
        </Button>
        <Button
          disabled={!longitude || !latitude || !address}
          variant="contained"
          onClick={confirmPinMap}>
          Suivant
        </Button>
      </Box>
    </Box>
  );
};

export default PinMap;
