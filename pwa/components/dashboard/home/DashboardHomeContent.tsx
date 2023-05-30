import React, {useEffect, useState} from 'react';
import {repairerEmployeesResource} from '@resources/repairerEmployeesResource';
import {
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
    CircularProgress, Box,
} from '@mui/material';
import EmployeesListActions from '@components/dashboard/employees/EmployeesListActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import {RepairerEmployee} from '@interfaces/RepairerEmployee';
import {User} from '@interfaces/User';
import Grid from '@mui/material/Grid';
import DashboardNextAppointments from "@components/dashboard/home/DashboardNextAppointments";
import {Repairer} from "@interfaces/Repairer";

interface DashboardHomeContentProps {
    repairer: string;
}

export const DashboardHomeContent = ({repairer}: DashboardHomeContentProps): JSX.Element => {

    const [loadingList, setLoadingList] = useState<boolean>(false);

    return (
        <Box>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <DashboardNextAppointments repairer={repairer} />
                </Grid>
                <Grid item xs={6}>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DashboardHomeContent;
