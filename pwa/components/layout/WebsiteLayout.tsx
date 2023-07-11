import React, {PropsWithChildren, useEffect} from 'react';
import dynamic from 'next/dynamic';
const Navbar = dynamic(() => import('@components/layout/Navbar'));
const Footer = dynamic(() => import('@components/layout/Footer'));
import {useAccount} from '@contexts/AuthContext';
import LegalNoticesFooter from './LegaNoticesFooter';
import Box from '@mui/material/Box';
import {useRouter} from 'next/router';

const WebsiteLayout = ({children}: PropsWithChildren): JSX.Element => {
  const {user} = useAccount({});
  const router = useRouter();
  const next = Array.isArray(router.query.next)
    ? router.query.next.join('')
    : router.query.next || '/';
  const isAdmin = next.includes('admin');


  return (
    <Box height="100vh" overflow="auto" id="websitelayout">
      {!isAdmin && <Navbar user={user ?? undefined} />}
      <Box
        minHeight="100vh"
        display="flex"
        flexDirection="column"
        pt={{xs: '56px', sm: '64px', md: '80px'}}
        pb={{xs: '56px', md: '72px'}}>
        <Box flex={1}>{children}</Box>
        {!isAdmin && <LegalNoticesFooter />}
      </Box>
      {!isAdmin && <Footer user={user ?? undefined} />}
    </Box>
  );
};

export default WebsiteLayout;
