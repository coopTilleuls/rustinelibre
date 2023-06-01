import React, {useState} from 'react';
import {Box} from '@mui/material';
import Grid from '@mui/material/Grid';
import DashboardNextAppointments from "@components/dashboard/home/DashboardNextAppointments";
import DashboardWaitingAppointments from "@components/dashboard/home/DashboardWaitingAppointments";
import {appointmentResource} from "@resources/appointmentResource";
import {Appointment} from "@interfaces/Appointment";
import {RequestParams} from "@interfaces/Resource";
import {dateObjectAsString} from "@helpers/dateHelper";
import DashboardHomeEmployees from "@components/dashboard/home/DashboardHomeEmployees";
import {User} from "@interfaces/User";

interface DashboardHomeContentProps {
    repairer: string;
    currentBoss: User;
}

export const DashboardHomeContent = ({repairer, currentBoss}: DashboardHomeContentProps): JSX.Element => {

    const [loadingListNext, setLoadingListNext] = useState<boolean>(false);
    const [loadingListWait, setLoadingListWait] = useState<boolean>(false);
    const [appointmentsNext, setAppointmentsNext] = useState<Appointment[]>([]);
    const [appointmentsWaiting, setAppointmentsWaiting] = useState<Appointment[]>([]);

    const fetchNextAppointments = async () => {
        setLoadingListNext(true);
        const nextAppointments = await fetchAppointments({
            itemsPerPage: '6',
            repairer: repairer,
            'order[slotTime]': 'DESC',
            'slotTime[after]': dateObjectAsString(new Date()),
            status: 'validated'
        })

        setAppointmentsNext(nextAppointments);
        setLoadingListNext(false);
    };

    const fetchWaitingAppointments = async () => {
        setLoadingListWait(true);
        const waitAppointments = await fetchAppointments({
            itemsPerPage: '6',
            repairer: repairer,
            'order[slotTime]': 'ASC',
            status: 'pending_repairer',
            'slotTime[after]': dateObjectAsString(new Date()),
        })

        setAppointmentsWaiting(waitAppointments);
        setLoadingListWait(false)
    };

    const fetchAppointments = async (params: RequestParams): Promise<Appointment[]> => {
        const response = await appointmentResource.getAll(true, params);
        return response['hydra:member']
    };

    return (
        <Box>
            {repairer &&
                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        <DashboardNextAppointments repairer={repairer} appointmentsNext={appointmentsNext} fetchNextAppointments={fetchNextAppointments} loadingListNext={loadingListNext} />
                    </Grid>
                    <Grid item xs={6}>
                        <DashboardWaitingAppointments repairer={repairer} appointmentsWaiting={appointmentsWaiting} fetchNextAppointments={fetchNextAppointments} fetchWaitingAppointments={fetchWaitingAppointments} loadingListWait={loadingListWait} />
                    </Grid>
                    <Grid item xs={12}>
                        <DashboardHomeEmployees currentBoss={currentBoss} />
                    </Grid>
                </Grid>}
        </Box>
    );
};

export default DashboardHomeContent;
