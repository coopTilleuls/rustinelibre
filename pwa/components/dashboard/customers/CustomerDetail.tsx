import React, {useEffect, useState} from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import {Customer} from '@interfaces/Customer';
import {Tab, Tabs} from '@mui/material';
import CustomerAppointmentsList from '@components/dashboard/customers/CustomerAppointmentsList';
import CustomerBikesList from '@components/dashboard/customers/CustomerBikesList';

interface CustomersDetailProps {
  customer: Customer;
}

export const CustomersDetail = ({
  customer,
}: CustomersDetailProps): JSX.Element => {
  const [tabValue, setTabValue] = React.useState<number>(0);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box component="main" maxWidth={900}>
      <Tabs value={tabValue} onChange={handleChangeTab}>
        <Tab label="Coordonnées" />
        <Tab label="Rendez-vous" />
        <Tab label="Vélos" />
      </Tabs>

      <Box sx={{marginTop: 3}}>
        {tabValue === 0 && (
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
              <ListItemText primary={customer.email} />
            </ListItem>
          </List>
        )}
        {tabValue === 1 && <CustomerAppointmentsList customer={customer} />}
        {tabValue === 2 && <CustomerBikesList customer={customer} />}
      </Box>
    </Box>
  );
};

export default CustomersDetail;
