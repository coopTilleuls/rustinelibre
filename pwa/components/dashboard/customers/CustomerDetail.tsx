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
    CircularProgress,
} from '@mui/material';
import EmployeesListActions from '@components/dashboard/employees/EmployeesListActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import {RepairerEmployee} from '@interfaces/RepairerEmployee';
import {User} from '@interfaces/User';
import {customerResource} from "@resources/customerResource";
import Link from "next/link";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Box from "@mui/material/Box";
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';

interface CustomersDetailProps {
    customer: User
}

export const CustomersDetail = ({customer}: CustomersDetailProps): JSX.Element => {

    return (
        <Box>
            <List>
                    <ListItem>
                        <ListItemIcon>
                            <PermIdentityIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary={`${customer.firstName} ${customer.lastName}`}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <AlternateEmailIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary={customer.email}
                        />
                    </ListItem>
            </List>
        </Box>
    );
};

export default CustomersDetail;
