import React from 'react';
import {Box, Typography,
} from '@mui/material';
import EmployeesList from "@components/dashboard/employees/EmployeesList";
import {User} from "@interfaces/User";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Link from "next/link";

interface DashboardHomeEmployeesProps {
    currentBoss: User;
}

export const DashboardHomeEmployees = ({currentBoss}: DashboardHomeEmployeesProps): JSX.Element => {

    return (
        <Box>
            <Typography variant="h5" sx={{mb: 3}}>
                Utilisateurs
                <Link href={'/sradmin/employes/ajouter'}>
                    <Button variant="contained" sx={{float: 'right'}} size="small">
                        <AddIcon />
                        Ajouter un réparateur
                    </Button>
                </Link>
            </Typography>
            <EmployeesList currentBoss={currentBoss} />
        </Box>
    );
};

export default DashboardHomeEmployees;
