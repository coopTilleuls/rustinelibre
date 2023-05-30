import React from 'react';
import Head from 'next/head';
import Box from '@mui/material/Box';
import DashboardLayout from '@components/dashboard/DashboardLayout';
import {useAccount} from "@contexts/AuthContext";
import DashboardHomeContent from "@components/dashboard/home/DashboardHomeContent";

const Dashboard = () => {

    const {user} = useAccount({redirectIfNotFound: '/'});

    return (
        <>
            <Head>
                <title>Dashboard</title>
            </Head>
            <DashboardLayout>
                <Box component="main">
                    {user && user.repairer && <DashboardHomeContent repairer={user.repairer} />}
                </Box>
            </DashboardLayout>
        </>
    );
};

export default Dashboard;