import React, {PropsWithChildren} from 'react';
import dynamic from 'next/dynamic';
const Navbar = dynamic(() => import('@components/layout/Navbar'));
const Footer = dynamic(() => import('@components/layout/Footer'));
import {useAccount} from '@contexts/AuthContext';
import LegalNoticesFooter from './LegaNoticesFooter';
import Box from '@mui/material/Box';
import {useRouter} from 'next/router';
import Logo from '@components/common/Logo';
import {Typography} from '@mui/material';

interface WebsiteLayoutProps extends PropsWithChildren {
  withLegalFooter?: boolean;
}

const WebsiteLayout = ({
  children,
  withLegalFooter = true,
}: WebsiteLayoutProps): JSX.Element => {
  const {user} = useAccount({});
  const router = useRouter();
  const next = Array.isArray(router.query.next)
    ? router.query.next.join('')
    : router.query.next || '/';
  const isAdmin = next.includes('admin');
  const adminOnLoginPage = router.pathname === '/login' && isAdmin;

  return (
    <Box height="100vh" overflow="auto" id="websitelayout">
      {!isAdmin && <Navbar user={user ?? undefined} />}
      <Box
        bgcolor={adminOnLoginPage ? 'primary.main' : ''}
        minHeight="100vh"
        display="flex"
        flexDirection="column"
        pt={{xs: '56px', sm: '64px', md: '80px'}}
        pb={{xs: '56px', md: '72px'}}>
        {adminOnLoginPage && (
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            mx="auto"
            maxWidth={400}>
            <Logo inline color="lightprimary" />
            <Typography
              textAlign="center"
              variant="caption"
              fontWeight={600}
              color="white">
              ADMIN
            </Typography>
          </Box>
        )}
        <Box flex={1}>{children}</Box>
        {!isAdmin && withLegalFooter && <LegalNoticesFooter />}
      </Box>
      {!isAdmin && <Footer user={user ?? undefined} />}
    </Box>
  );
};

export default WebsiteLayout;
