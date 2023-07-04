import React, {useMemo} from 'react';
import {NextLinkComposed} from '@components/common/link/Link';
import useMediaQuery from '@mui/material/useMediaQuery';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {User} from '@interfaces/User';
import {useRouter} from 'next/router';
import {isBoss, isEmployee} from '@helpers/rolesHelpers';
import {Paper, Typography} from '@mui/material';

interface FooterProps {
  user?: User;
}
const Footer = ({user}: FooterProps): JSX.Element => {
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width: 899px)');

  const links = useMemo(
    () =>
      [
        {
          label: 'Accueil',
          link: '/',
          Icon: HomeIcon,
          visible: true,
        },
        {
          label: 'Rendez-vous',
          link: '/rendez-vous/mes-rendez-vous',
          Icon: CalendarMonthIcon,
          visible: true,
        },
        {
          label: 'Mes vélos',
          link: '/velos/mes-velos',
          Icon: DirectionsBikeIcon,
          visible: true,
        },
        {
          label: 'Messages',
          link: '/messagerie',
          Icon: ChatBubbleIcon,
          visible: user && !isBoss(user) && !isEmployee(user),
        },
        {
          label: 'Compte',
          link: '/mon-compte',
          Icon: AccountCircleIcon,
          visible: !!user,
        },
        {
          label: 'Connexion',
          link: '/login',
          Icon: AccountCircleIcon,
          visible: !user,
        },
      ].filter((link) => !!link.visible),
    [user]
  );

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 5,
        boxShadow:
          '0 -5px 10px rgba(0, 0, 0, 0.04), 0 -10px 20px rgba(0, 0, 0, 0.02)',
      }}
      elevation={3}>
      <BottomNavigation
        showLabels
        value={router.pathname}
        sx={{height: {xs: '56px', md: '72px'}}}>
        {links.map(({label, Icon: LinkIcon, link}) => (
          <BottomNavigationAction
            key={label}
            component={NextLinkComposed}
            to={link}
            value={link}
            label={
              isMobile ? undefined : (
                <Typography variant="caption" fontWeight={700}>
                  {label}
                </Typography>
              )
            }
            sx={{color: 'secondary.main', fontWeight: 700, maxWidth: '130px'}}
            icon={<LinkIcon fontSize="large" />}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
};

export default Footer;
