import React, {PropsWithChildren} from 'react';
import dynamic from 'next/dynamic';
const Navbar = dynamic(() => import('@components/layout/Navbar'));
const Footer = dynamic(() => import('@components/layout/Footer'));
import {useAccount} from '@contexts/AuthContext';
import LegalNoticesFooter from './LegaNoticesFooter';
import Box from '@mui/material/Box';

const WebsiteLayout = ({children}: PropsWithChildren): JSX.Element => {
  const {user} = useAccount({});
  return (
    <Box
      pt={{xs: '60px', md: '80px'}}
      pb={{xs: '60px', md: '80px'}}
      height="100vh"
      overflow="auto">
      <Navbar user={user ?? undefined} />
      <Box
        sx={{
          minHeight: {xs: 'calc(100vh - 280px)', md: 'calc(100vh - 250px)'},
        }}>
        {children}
      </Box>
      <LegalNoticesFooter />
      <Footer user={user ?? undefined} />
    </Box>
  );
};

export default WebsiteLayout;
