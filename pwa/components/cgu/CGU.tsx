import React from 'react';
import {Box} from '@mui/material';
import GeneralOperation from './GeneralOperation';
import Purpose from './Purpose';
import PlatformOperator from './PlatformOperator';
import AcceptanceAndAccessibility from './AcceptanceAndAccessibility';
import Registration from './Registration';
import AvailableFeatures from './AvailableFeatures';
import ServiceAvailability from './ServiceAvailability';
import UsersCommitments from './UsersCommitments';
import PlatformResponsibilities from './PlatformResponsibilities';
import Glossary from './Glossary';
import IndependenceOfClauses from './IndependenceOfClauses';
import IntellectualProperty from './IntellectualProperty';

const CGU = (): JSX.Element => {
  return (
    <Box display="flex" flexDirection="column" gap={6}>
      <Purpose />
      <PlatformOperator />
      <GeneralOperation />
      <AcceptanceAndAccessibility />
      <Registration />
      <AvailableFeatures />
      <ServiceAvailability />
      <UsersCommitments />
      <PlatformResponsibilities />
      <IndependenceOfClauses />
      <IntellectualProperty />
      <Glossary />
    </Box>
  );
};

export default CGU;
