import React, {useEffect, useMemo, useState} from 'react';
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
import {isAdmin, isBoss, isEmployee} from '@helpers/rolesHelpers';
import {Paper, Typography} from '@mui/material';
import {Discussion} from '@interfaces/Discussion';
import {ENTRYPOINT} from '@config/entrypoint';
import {discussionResource} from '@resources/discussionResource';
import Badge from '@mui/material/Badge';
import {useTheme} from '@mui/material/styles';

interface FooterProps {
  user?: User;
}
const Footer = ({user}: FooterProps): JSX.Element => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [unreadMessages, setUnreadMessages] = useState<number>(0);

  const subscribeMercureDiscussions = async (): Promise<void> => {
    const hubUrl = `${ENTRYPOINT}/.well-known/mercure`;
    const hub = new URL(hubUrl);
    discussions.map((discussion) => {
      hub.searchParams.append('topic', `${ENTRYPOINT}${discussion['@id']}`);
    });

    const eventSource = new EventSource(hub);
    eventSource.onmessage = (event) => {
      countUnread();
    };
  };

  const countUnread = async (): Promise<void> => {
    if (!user) {
      setUnreadMessages(0);
      return;
    }

    const countUnread = await discussionResource.countUnread({});
    setUnreadMessages(countUnread.count);
  };

  const fetchDiscussions = async () => {
    if (!user) {
      return;
    }

    const response = await discussionResource.getAll(true, {
      customer: user.id,
      itemsPerPage: 50,
      'order[lastMessage]': 'DESC',
    });
    setDiscussions(response['hydra:member']);
  };

  useEffect(() => {
    if (user) {
      countUnread();
      fetchDiscussions();
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (discussions.length > 0) {
      subscribeMercureDiscussions();
    }
  }, [discussions]); // eslint-disable-line react-hooks/exhaustive-deps

  const isNotACustomer =
    user && (isAdmin(user) || isBoss(user) || isEmployee(user));

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
          disabled: !user || isNotACustomer,
        },
        {
          label: 'Mes vélos',
          link: '/velos/mes-velos',
          Icon: DirectionsBikeIcon,
          visible: true,
          disabled: !user || isNotACustomer,
        },
        {
          label: 'Messages',
          link: '/messagerie',
          Icon: ChatBubbleIcon,
          visible: true,
          disabled: !user || isNotACustomer,
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
    [user, isNotACustomer]
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
        {links.map(({label, Icon: LinkIcon, link, disabled}) => (
          <BottomNavigationAction
            disabled={disabled}
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
            sx={{
              opacity: disabled ? 0.5 : 1,
              color: 'secondary.main',
              '&:hover': {
                color: 'primary.main',
              },
              fontWeight: 700,
              maxWidth: '130px',
            }}
            icon={
              <Badge
                badgeContent={
                  label === 'Messages' && !isNotACustomer ? unreadMessages : 0
                }
                color="primary">
                <LinkIcon fontSize="large" />
              </Badge>
            }
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
};

export default Footer;
