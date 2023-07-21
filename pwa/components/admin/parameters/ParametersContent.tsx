import React, {useState} from 'react';
import {Box} from '@mui/material';
import Grid from '@mui/material/Grid';
import ParametersBikeTypes from '@components/admin/parameters/ParametersBikeTypes';
import ParametersRepairerTypes from '@components/admin/parameters/ParametersRepairerTypes';
import InterventionsList from '@components/admin/parameters/interventions/InterventionsList';

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
          <InterventionsList />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ParametersContent;
