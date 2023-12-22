import React, {useEffect, useState} from 'react';
import Head from 'next/head';
import Box from '@mui/material/Box';
import DashboardLayout from '@components/dashboard/DashboardLayout';
import {useAccount} from '@contexts/AuthContext';
import {Repairer} from '@interfaces/Repairer';
import {CircularProgress, IconButton, Typography} from '@mui/material';
import {dateObjectAsString} from '@helpers/dateHelper';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import {appointmentResource} from '@resources/appointmentResource';
import {Appointment} from '@interfaces/Appointment';
import Grid from '@mui/material/Grid';
import TourAppointmentsList from '@components/dashboard/tour/TourAppointmentsList';
import dynamic from 'next/dynamic';
const TourMap = dynamic(() => import('@components/dashboard/tour/TourMap'), {
  ssr: false,
});

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

  const handlePreviousDate = (numberOfDays: number) => {
    let newDate = new Date(date.getTime() - 24 * 60 * 60 * 1000 * numberOfDays);
    setDate(newDate);
  };

  const handleNextDate = (numberOfDays: number) => {
    let newDate = new Date(date.getTime() + 24 * 60 * 60 * 1000 * numberOfDays);
    setDate(newDate);
  };

  const fetchAppointments = async (fromDate: Date, toDate: Date) => {
    setLoading(true);
    const response = await appointmentResource.getAll(true, {
      'slotTime[after]': dateObjectAsString(fromDate, false),
      'slotTime[strictly_before]': dateObjectAsString(toDate, false),
      'order[slotTime]': 'ASC',
      status: 'validated',
    });

    setAppointments(response['hydra:member']);
    setLoading(false);
  };

  useEffect(() => {
    const dateTomorrow = new Date(date.getTime() + 24 * 60 * 60 * 1000);
    fetchAppointments(date, dateTomorrow);
  }, [date]); // eslint-disable-line react-hooks/exhaustive-deps

  const currentDate = new Date(date).toLocaleString('fr-FR', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <>
      <Head>
        <title>Tableau de bord | Rustine Libre</title>
      </Head>
      <DashboardLayout>
        <Box component="main">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 4,
            }}>
            <IconButton onClick={() => handlePreviousDate(7)}>
              <KeyboardDoubleArrowLeftIcon fontSize={'large'} />
            </IconButton>
            <IconButton onClick={() => handlePreviousDate(1)}>
              <ArrowBackIosIcon />
            </IconButton>
            <Typography variant="h4" sx={{textAlign: 'center'}}>
              {currentDate}
            </Typography>
            <IconButton onClick={() => handleNextDate(1)}>
              <ArrowForwardIosIcon />
            </IconButton>
            <IconButton onClick={() => handleNextDate(7)}>
              <KeyboardDoubleArrowRightIcon fontSize={'large'} />
            </IconButton>
          </Box>

          {loading && <CircularProgress />}
          {!loading && appointments.length === 0 && (
            <Box sx={{marginTop: '20px'}}>
              {`Vous n'avez pas de RDV ce jour`}
            </Box>
          )}
          {!loading && appointments.length > 0 && (
            <Box sx={{marginTop: '30px'}}>
              <Grid container spacing={2}>
                <Grid item xs={5}>
                  <TourAppointmentsList appointments={appointments} />
                </Grid>
                <Grid item xs={7}>
                  {repairer && (
                    <TourMap repairer={repairer} appointments={appointments} />
                  )}
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
      </DashboardLayout>
    </>
  );
};

export default Tour;
