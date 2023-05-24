import Head from 'next/head';
import React from 'react';
import Box from '@mui/material/Box';
import DashboardLayout from '@components/dashboard/DashboardLayout';
import {useAccount} from '@contexts/AuthContext';
import EmployeesList from '@components/dashboard/employees/EmployeesList';
import Link from 'next/link';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';

const Employees = () => {
  const {user} = useAccount({});

  return (
    <>
      <Head>
        <title>Employés</title>
      </Head>
      <DashboardLayout>
        <Box component="main">
          <Link href={'/sradmin/employes/ajouter'}>
            <Button variant="contained" sx={{marginBottom: 2}}>
              <AddIcon />
              Ajouter un réparateur
            </Button>
          </Link>
          <EmployeesList currentBoss={user} />
        </Box>
      </DashboardLayout>
    </>
  );
};

export default Employees;
