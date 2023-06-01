import Head from 'next/head';
import React from 'react';
import Box from '@mui/material/Box';
import AdminLayout from "@components/admin/AdminLayout";
import RepairersList from "@components/admin/repairers/RepairersList";

const Repairers = () => {
    return (
        <>
            <Head>
                <title>Messagerie</title>
            </Head>
            <AdminLayout>
                <Box component="main">
                    Test
                </Box>
            </AdminLayout>
        </>
    );
};

export default Repairers;
