import {NextPageWithLayout} from '../_app';
import Head from 'next/head';
import React, {useState} from 'react';
import DashboardLayout from '@components/dashboard/DashboardLayout';
import AppointmentCreate from "@components/dashboard/appointments/AppointmentCreate";


const DashboardCreateAppointment: NextPageWithLayout = () => {
    return (
        <>
            <Head>
                <title>Créer un rendez-vous</title>
            </Head>
            <DashboardLayout>
                <AppointmentCreate />
            </DashboardLayout>
        </>
    );
};

export default DashboardCreateAppointment;
