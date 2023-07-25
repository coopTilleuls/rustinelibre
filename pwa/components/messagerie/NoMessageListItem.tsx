import {Box, Typography} from '@mui/material';
import React from 'react';
import {useAccount} from '@contexts/AuthContext';
import {isBoss, isEmployee} from '@helpers/rolesHelpers';

const NoMessageListItem = (): JSX.Element => {
  const {user} = useAccount({redirectIfNotFound: '/login'});

  return (
    <Box
      sx={{
        cursor: 'default',
        width: '100%',
        borderRadius: 5,
        mb: 2,
        transition: 'all ease 0.3s',
        bgcolor: 'grey.100',
      }}>
      <Box px={2} py={2}>
        <Typography
          variant="body2"
          fontWeight={800}
          gutterBottom
          color={'text.secondary'}>
          Vous n’avez pas de discussion en cours
        </Typography>

        {user && (
          <Typography
            color="grey.500"
            variant="caption"
            fontStyle="italic"
            component="div"
            lineHeight="1.2">
            {isBoss(user) || isEmployee(user) ? (
              <>
                Vos discussions apparaîtront ici quand un utilisateur aura pris
                rendez-vous avec vous
              </>
            ) : (
              <>
                Vos discussions apparaîtront ici quand vous prendrez rendez-vous
                avec un réparateur
              </>
            )}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default NoMessageListItem;
