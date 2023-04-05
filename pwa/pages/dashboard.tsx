import Head from "next/head";
import React from "react";
import "@fontsource/poppins";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import dynamic from "next/dynamic";
import Box from '@mui/material/Box';
import DashboardLayout from "@components/dashboard/DashboardLayout";

const Dashboard = () => {

    return (
        <div className="w-full overflow-x-hidden">
            <Head>
                <title>Dashboard</title>
            </Head>
            <DashboardLayout />
            <Box component="main" sx={{ marginLeft: '20%', marginTop: '100px' }}>
                Hello tout le monde !
            </Box>
        </div>
    )
};

export default Dashboard;
