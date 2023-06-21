import React, {useEffect, useState} from 'react';
import Head from 'next/head';
import Box from '@mui/material/Box';
import DashboardLayout from '@components/dashboard/DashboardLayout';
import {useAccount} from "@contexts/AuthContext";
import {Repairer} from "@interfaces/Repairer";
import {CircularProgress, Typography} from "@mui/material";
import {dateObjectAsString, getDateFormattedWithCompleteName} from "@helpers/dateHelper";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import {appointmentResource} from "@resources/appointmentResource";
import {Appointment} from "@interfaces/Appointment";
import Grid from '@mui/material/Grid';
import TourAppointmentsList from "@components/dashboard/tour/TourAppointmentsList";
import dynamic from "next/dynamic";
const TourMap = dynamic(() => import('@components/dashboard/tour/TourMap'), {ssr: false});

const Tour = () => {

    const [loading, setLoading] = useState<boolean>(false);
    const {user} = useAccount({});
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [repairer, setRepairer] = useState<Repairer | null>(null);
    const [date, setDate] = useState<Date>(new Date());

    useEffect(() => {
        if (user && user.repairer) {
            setRepairer(user.repairer);
            return;
        }

        if (user && user.repairerEmployee) {
            setRepairer(user.repairerEmployee.repairer);
        }
    }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

    const handlePreviousDate = () => {
        let newDate = new Date(date.getTime() - 24 * 60 * 60 * 1000);
        setDate(newDate);
    }

    const handleNextDate = () => {
        let newDate = new Date(date.getTime() + 24 * 60 * 60 * 1000);
        setDate(newDate);
    }

    const fetchAppointments = async (fromDate: Date, toDate: Date) => {
        setLoading(true);
        const response = await appointmentResource.getAll(true, {
            'slotTime[after]': dateObjectAsString(fromDate, false),
            'slotTime[strictly_before]': dateObjectAsString(toDate, false),
            'order[slotTime]': 'ASC',
            status: 'validated'
        })

        setAppointments(response['hydra:member']);
        setLoading(false);
    }

    useEffect(() => {

        const dateTomorrow = new Date(date.getTime() + 24 * 60 * 60 * 1000);
        fetchAppointments(date, dateTomorrow);

    }, [date]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            <Head>
                <title>Dashboard</title>
            </Head>
            <DashboardLayout>
                <Box component="main">
                    <Box>
                        <Typography variant="h4" sx={{textAlign: 'center'}}>
                            <ArrowBackIosIcon sx={{marginRight: 5, cursor: 'pointer', fontSize: '1.5em'}} onClick={handlePreviousDate} />
                            {getDateFormattedWithCompleteName(date)}
                            <ArrowForwardIosIcon sx={{marginLeft: 5, cursor: 'pointer', fontSize: '1.5em'}} onClick={handleNextDate} />
                        </Typography>
                    </Box>

                    {loading && <CircularProgress />}
                    {!loading && appointments.length === 0 && <Box sx={{marginTop: '20px'}}>
                        {`Vous n'avez pas de RDV ce jour`}
                    </Box>}
                    {!loading && appointments.length > 0 && <Box sx={{marginTop: '30px'}}>
                        <Grid container spacing={2}>
                            <Grid item xs={5}>
                                <TourAppointmentsList appointments={appointments} />
                            </Grid>
                            <Grid item xs={7}>
                                {repairer && <TourMap repairer={repairer} appointments={appointments} />}
                            </Grid>
                        </Grid>
                    </Box>}
                </Box>
            </DashboardLayout>
        </>
    );
};

export default Tour;