import Head from 'next/head';
import React from 'react';
import Box from '@mui/material/Box';
import DashboardLayout from '@components/dashboard/DashboardLayout';
import {useAccount} from '@contexts/AuthContext';
import EmployeesList from '@components/dashboard/employees/EmployeesList';
import Link from 'next/link';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import {isBoss} from '@helpers/rolesHelpers';
import {Typography} from '@mui/material';

const Employees = () => {
  const {user} = useAccount({redirectIfNotFound: '/'});

  return (
    <>
      <Head>
        <title>Employés</title>
      </Head>
      <DashboardLayout>
        <Box component="main">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alighItems: 'center',
              my: 2,
            }}>
            <Typography variant="h5">Liste des employés</Typography>
            <Link href={'/sradmin/employes/ajouter'}>
              <Button variant="contained" size="small" startIcon={<AddIcon />}>
                Ajouter un employé
              </Button>
            </Link>
          </Box>
          {user && isBoss(user) && user.repairer && (
            <EmployeesList currentBoss={user} />
          )}
        </Box>
      </DashboardLayout>
    </>
  );
};

export default Employees;
