import Head from "next/head";
import React from "react";
import Box from '@mui/material/Box';
import DashboardLayout from "@components/dashboard/DashboardLayout";

const Employees = () => {
    return (
        <div className="w-full overflow-x-hidden">
            <Head>
                <title>Employés</title>
            </Head>
            <DashboardLayout />
            <Box component="main" sx={{ marginLeft: '20%', marginTop: '100px' }}>

            </Box>
        </div>
    )
};

export default Employees;
