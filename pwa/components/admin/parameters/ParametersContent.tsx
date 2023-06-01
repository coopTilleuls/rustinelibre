import React, {useState} from 'react';
import {Box} from '@mui/material';
import Grid from '@mui/material/Grid';
import ParametersBikeTypes from "@components/admin/parameters/ParametersBikeTypes";
import ParametersRepairerTypes from "@components/admin/parameters/ParametersRepairerTypes";

export const ParametersContent = (): JSX.Element => {

    return (
        <Box>
            <Grid container spacing={3}>
                <Grid item xs={6}>
                    <ParametersBikeTypes />
                </Grid>
                <Grid item xs={6}>
                    <ParametersRepairerTypes />
                </Grid>
                <Grid item xs={12}>
                    {/*@todo add  interventions list*/}
                </Grid>
            </Grid>
        </Box>
    );
};

export default ParametersContent;
