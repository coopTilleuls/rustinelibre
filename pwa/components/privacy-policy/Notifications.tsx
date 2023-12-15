import React from 'react';
import {Typography, Box} from '@mui/material';

const Notifications = (): JSX.Element => {
  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Typography variant="h3" color="primary">
        4 - Les notifications en cas de violation
      </Typography>
      <Box display="flex" flexDirection="column" gap={1}>
        <Typography>
          En cas de violation de données à caractère personnel, Rustine Libre
          notifiera cette violation à la CNIL dans les meilleurs délais et,
          autant que possible, 72 heures au plus tard après en avoir pris
          connaissance, conformément à l’article 33 du RGPD.
        </Typography>
        <Typography>
          Elle communiquera également aux personnes concernées l’existence de
          cette violation, conformément à l’article 34 du RGPD.
        </Typography>
      </Box>
    </Box>
  );
};

export default Notifications;
