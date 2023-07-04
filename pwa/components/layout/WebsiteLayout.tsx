import React, {PropsWithChildren, useEffect} from 'react';
import dynamic from 'next/dynamic';
const Navbar = dynamic(() => import('@components/layout/Navbar'));
const Footer = dynamic(() => import('@components/layout/Footer'));
import {useAccount} from '@contexts/AuthContext';
import LegalNoticesFooter from './LegaNoticesFooter';
import Box from '@mui/material/Box';
import {useRouter} from "next/router";

const WebsiteLayout = ({children}: PropsWithChildren): JSX.Element => {

  const {user} = useAccount({});
  const router = useRouter();
  const next = Array.isArray(router.query.next) ? router.query.next.join('') : router.query.next || '/';
  const isAdmin = next.includes('admin');


  return (
    <Box
      pt={{xs: '60px', md: '80px'}}
      pb={{xs: '60px', md: '80px'}}
      height="100vh"
      overflow="auto">
      {!isAdmin && <Navbar user={user ?? undefined} />}
      <Box
        sx={{
          minHeight: {xs: 'calc(100vh - 280px)', md: 'calc(100vh - 300px)'},
        }}>
        {children}
      </Box>
      {!isAdmin && <LegalNoticesFooter />}
      {!isAdmin && <Footer user={user ?? undefined} />}
    </Box>
  );
};

export default WebsiteLayout;
