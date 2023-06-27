import React, {PropsWithRef, useContext} from 'react';
import {Box, Button, Typography} from '@mui/material';
import {SearchRepairerContext} from '@contexts/SearchRepairerContext';

import {Repairer} from '@interfaces/Repairer';
import useMediaQuery from '@hooks/useMediaQuery';
import {Appointment} from "@interfaces/Appointment";

interface TourMapPopUpProps extends PropsWithRef<any> {
    appointment: Appointment;
}

export const TourMapPopUp = ({appointment}: TourMapPopUpProps): JSX.Element => {

    return (
        <Box
            sx={{
                boxShadow: 0,
                backgroundColor: 'white',
            }}>
            <Typography
                my={0}
                fontSize={14}
                fontWeight={600}
                sx={{wordBreak: 'break-word'}}>
                {repairer.name}
            </Typography>
            <Typography
                color="text.secondary"
                textTransform="capitalize"
                fontSize={12}>
                {repairer.streetNumber} {repairer.street}
            </Typography>
            <Typography
                color="text.secondary"
                textTransform="capitalize"
                fontSize={12}>
                {repairer.postcode} - {repairer.city}
            </Typography>
            <Box textAlign="center" mt={2}>
                <Button
                    variant="contained"
                    sx={{textTransform: 'capitalize'}}
                    Je réserve
                </Button>
            </Box>
        </Box>
    );
};
