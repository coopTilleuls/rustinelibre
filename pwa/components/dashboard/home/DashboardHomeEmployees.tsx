import React from 'react';
import {Box, Typography} from '@mui/material';
import EmployeesList from '@components/dashboard/employees/EmployeesList';
import {User} from '@interfaces/User';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Link from 'next/link';

interface DashboardHomeEmployeesProps {
  currentBoss: User;
}

export const DashboardHomeEmployees = ({
  currentBoss,
}: DashboardHomeEmployeesProps): JSX.Element => {
  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Typography variant="h5">
        Utilisateurs
        <Link legacyBehavior passHref href={'/sradmin/employes/ajouter'}>
          <Button
            variant="contained"
            color="secondary"
            sx={{float: 'right'}}
            size="small"
            startIcon={<AddIcon />}>
            Ajouter un employé
          </Button>
        </Link>
      </Typography>
      <EmployeesList currentBoss={currentBoss} />
    </Box>
  );
};

export default DashboardHomeEmployees;
