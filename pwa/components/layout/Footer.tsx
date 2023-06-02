import React from 'react';
import {NextLinkComposed} from '@components/common/link/Link';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {User} from '@interfaces/User';
import {useRouter} from 'next/router';

interface FooterProps {
  user?: User;
}
const Footer = ({user}: FooterProps): JSX.Element => {
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width: 640px)');

  return (
    <Box
      sx={{
        position: 'fixed',
        left: 0,
        bottom: 0,
        width: '100%',
        zIndex: 10,
      }}>
      <Box
        sx={{backgroundColor: 'grey.200'}}
        py={{md: 1}}
        width={'100%'}
        height={'100%'}>
        <BottomNavigation
          showLabels
          value={router.pathname}
          sx={{backgroundColor: 'grey.200'}}>
          <BottomNavigationAction
            component={NextLinkComposed}
            to={{pathname: '/'}}
            label={!isMobile && 'Accueil'}
            icon={<HomeIcon />}
            value="/"
          />
          <BottomNavigationAction
            component={NextLinkComposed}
            to={{pathname: '/rendez-vous/mes-rendez-vous'}}
            label={!isMobile && 'Rendez-vous'}
            icon={<CalendarMonthIcon />}
          />
          <BottomNavigationAction
            component={NextLinkComposed}
            to={{pathname: '/velos/mes-velos'}}
            label={!isMobile && 'Mes vélos'}
            icon={<DirectionsBikeIcon />}
          />
          <BottomNavigationAction
            component={NextLinkComposed}
            to={{pathname: '/'}}
            label={!isMobile && 'Messages'}
            icon={<ChatBubbleIcon />}
            disabled
            sx={{
              opacity: 0.5,
            }}
          />
          {user ? (
            <BottomNavigationAction
              component={NextLinkComposed}
              to={{pathname: '/profil/mon-profil'}}
              label={!isMobile && 'Profil'}
              icon={<AccountCircleIcon />}
              value="/profil/mon-profil"
            />
          ) : (
            <BottomNavigationAction
              component={NextLinkComposed}
              to={{pathname: '/login'}}
              label={!isMobile && 'Connexion'}
              icon={<AccountCircleIcon />}
              value="/login"
            />
          )}
        </BottomNavigation>
      </Box>
    </Box>
  );
};

export default Footer;
