import React, {useEffect} from 'react';
import Head from 'next/head';
import Box from '@mui/material/Box';
import {useAccount} from '@contexts/AuthContext';
import AdminLayout from '@components/admin/AdminLayout';
import {useRouter} from "next/router";

const Dashboard = () => {
    const router = useRouter();
    useEffect(() => {
        router.push('/admin/reparateurs')
    }, [router]);

    return (
    <>
      <Head>
        <title>Admin</title>
      </Head>
      <AdminLayout>
        <Box component="main"></Box>
      </AdminLayout>
    </>
  );
};

export default Dashboard;
