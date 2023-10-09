import React from 'react';
import Head from 'next/head';
import Box from '@mui/material/Box';
import DashboardLayout from '@components/dashboard/DashboardLayout';
import {useAccount} from '@contexts/AuthContext';
import {Typography} from '@mui/material';
import MyAccountForm from '@components/profile/MyInformations';
import ChangePassword from '@components/profile/ChangePassword';
import RemoveAccount from '@components/profile/RemoveAccount';
import {isBoss, isEmployee} from '@helpers/rolesHelpers';

const MyAccount = () => {
  const {user} = useAccount({});
  const isBossOrEmployee = user && (isBoss(user) || isEmployee(user));

  return (
    <>
      <Head>
        <title>Mon compte</title>
      </Head>
      <DashboardLayout>
        <Box component="main">
          {user && (
            <Box
              width="100%"
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={4}>
              <Typography pt={4} fontSize={{xs: 28, md: 30}} fontWeight={600}>
                Mon Compte
              </Typography>
              <MyAccountForm
                userLogged={user}
                isBossOrEmployee={isBossOrEmployee}
              />
              <ChangePassword />
              <RemoveAccount />
            </Box>
          )}
        </Box>
      </DashboardLayout>
    </>
  );
};

export default MyAccount;
