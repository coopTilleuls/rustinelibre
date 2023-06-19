import React from 'react';
import {Typography, Button,} from '@mui/material';
import Box from "@mui/material/Box";
import {Appointment} from "@interfaces/Appointment";
import {getTimeFromDateAsString} from 'helpers/dateHelper';
import Grid from '@mui/material/Grid';

interface TourAppointmentsListProps {
    appointments: Appointment[]
}

export const TourAppointmentsList =  ({appointments}: TourAppointmentsListProps): JSX.Element => {

    return (
        <Box>
            {appointments.map((appointment, key) => {
                return <Box key={key} sx={{marginTop: '20px'}}>
                    <Grid container spacing={2}>
                        <Grid item xs={2}>
                            <Typography sx={{padding: '3px', backgroundColor: 'lightblue', borderRadius: '30px', textAlign: 'center', marginBottom: '20px'}}>
                                {key+1}
                            </Typography>
                        </Grid>
                        <Grid item xs={10}>
                            <strong>{getTimeFromDateAsString(appointment.slotTime)}</strong> <br />
                            {appointment.address}

                            <Box sx={{display: 'flex', marginTop: '10px'}}>
                                <Button variant="outlined" size="small" sx={{marginRight: '5px'}}>
                                    Aller au RDV
                                </Button>
                                <Button variant="outlined" size="small">
                                    Détail du RDV
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            })}
        </Box>
    );
};

export default TourAppointmentsList;
