import React, {useEffect, useState} from 'react';
import Head from 'next/head';
import {repairerResource} from '@resources/repairerResource';
import {useAccount} from '@contexts/AuthContext';
import {
    Box,
    CircularProgress,
} from '@mui/material';
import DashboardLayout from '@components/dashboard/DashboardLayout';
import {Repairer} from '@interfaces/Repairer';
import {NextPageWithLayout} from "../../_app";
import AgendaCalendar from "@components/dashboard/agenda/AgendaCalendar";

const Agenda: NextPageWithLayout = () => {
    const [repairer, setRepairer] = useState<Repairer | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const {user} = useAccount({});

    useEffect(() => {
        async function fetchRepairer() {
            if (user && user.repairer) {
                setLoading(true);
                const repairerFetch: Repairer = await repairerResource.get(
                    user.repairer
                );
                setRepairer(repairerFetch);
                setLoading(false);
            }
        }
        if (user) {
            fetchRepairer();
        }
    }, [user]); // eslint-disable-line react-hooks/exhaustive-deps


    return (
        <>
            <Head>
                <title>Agenda</title>
            </Head>
            <DashboardLayout>
                <Box component="main" maxWidth="1200">
                    {loading && <CircularProgress />}
                    {repairer && !loading && <AgendaCalendar repairer={repairer} />}
                </Box>
            </DashboardLayout>
        </>
    );
};

export default Agenda;
