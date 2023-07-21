import React, {PropsWithRef} from 'react';
import {Box, Button, Typography} from '@mui/material';
import {Repairer} from '@interfaces/Repairer';


interface RepairerProps extends PropsWithRef<any> {
  repairer: Repairer;
  onClick?: () => void;
}

export const PopUpRepairerCard = ({
  repairer,
  onClick,
}: RepairerProps): JSX.Element => {

  return (
    <Box
      sx={{
        boxShadow: 0,
        backgroundColor: 'white',
      }}>
      <Typography
        my={0}
        fontSize={14}
        fontWeight={600}
        sx={{wordBreak: 'break-word'}}>
        {repairer.name}
      </Typography>
      <Typography
        color="text.secondary"
        textTransform="capitalize"
        fontSize={12}>
        {repairer.streetNumber} {repairer.street}
      </Typography>
      <Typography
        color="text.secondary"
        textTransform="capitalize"
        fontSize={12}>
        {repairer.postcode} - {repairer.city}
      </Typography>
      <Box textAlign="center" mt={2}>
        <Button
          variant="contained"
          sx={{textTransform: 'capitalize'}}
          onClick={onClick}>
          Je réserve
        </Button>
      </Box>
    </Box>
  );
};
