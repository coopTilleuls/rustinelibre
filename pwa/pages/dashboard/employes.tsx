import Head from "next/head";
import React from "react";
import Box from '@mui/material/Box';
import DashboardLayout from "@components/dashboard/DashboardLayout";
import {useAccount} from "@contexts/AuthContext";
import EmployeesList from "@components/dashboard/employees/EmployeesList";
import Link from "next/link";
import Button from "@mui/material/Button";
import AddIcon from '@mui/icons-material/Add';

const Employees = () => {
    const {user} = useAccount({});

    return (
        <div>
            <Head>
                <title>Employés</title>
            </Head>
            <DashboardLayout />
            <Box component="main" sx={{ marginLeft: '20%', marginRight: '5%', marginTop: '100px', }}>
                <Link href={'/dashboard/employes/ajouter'}>
                    <Button variant="outlined" style={{marginBottom: '15px'}}>
                        <AddIcon />
                        Ajouter un réparateur
                    </Button>
                </Link>
                <EmployeesList currentBoss={user} />
            </Box>
        </div>
    )
};

export default Employees;
