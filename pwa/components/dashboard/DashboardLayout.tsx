import * as React from 'react';
import {useRouter} from 'next/router';
import {styled, Theme, CSSObject, useTheme} from '@mui/material/styles';
import {
  Box,
  Toolbar,
  List,
  Divider,
  ListItem,
  Typography,
  Button,
} from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, {AppBarProps as MuiAppBarProps} from '@mui/material/AppBar';
import DashboardSidebarListItem from '@components/dashboard/DashboardSidebarListItem';
import HomeIcon from '@mui/icons-material/Home';
import ForumIcon from '@mui/icons-material/Forum';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import InfoIcon from '@mui/icons-material/Info';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EngineeringIcon from '@mui/icons-material/Engineering';
import {useAccount, useAuth} from '@contexts/AuthContext';
import useMediaQuery from '@mui/material/useMediaQuery';
import HandymanIcon from '@mui/icons-material/Handyman';
import Link from 'next/link';
import {isBoss, isEmployee, isItinerant} from '@helpers/rolesHelpers';
import RouteIcon from '@mui/icons-material/Route';
import Logo from '@components/common/Logo';
import {useEffect, useState} from 'react';
import {Discussion} from '@interfaces/Discussion';
import {ENTRYPOINT} from '@config/entrypoint';
import {discussionResource} from '@resources/discussionResource';
import Badge from '@mui/material/Badge';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({theme, open}) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({theme, open}) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const DashboardLayout = ({children}: DashboardLayoutProps) => {
  const router = useRouter();
  const {user} = useAccount({
    redirectIfNotFound: `/login?next=${encodeURIComponent(router.asPath)}`,
  });
  const isBossOrEmployee = user && (isBoss(user) || isEmployee(user));
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const {logout} = useAuth();
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
      return;
    }

    const countUnread = await discussionResource.countUnread({});
    setUnreadMessages(countUnread.count);
  };

  const fetchDiscussions = async () => {
    if (!user || !user.repairer) {
      return;
    }

    const response = await discussionResource.getAll(true, {
      repairer: user.repairer.id,
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

  if (user && !isBoss(user) && !isEmployee(user)) {
    router.push('/');
  }

  const clickLogOut = async () => {
    await logout();
    await router.push(`/login?next=${encodeURIComponent(router.asPath)}`);
  };

  return (
    <>
      {isBossOrEmployee && (
        <Box>
          <AppBar position="sticky" open={!isMobile}>
            <Toolbar>
              <List>
                <ListItem key="1" disablePadding>
                  <Typography variant="h4">
                    Bonjour {user?.firstName} !
                  </Typography>
                </ListItem>
              </List>

              <Button
                onClick={clickLogOut}
                sx={{
                  ml: 'auto',
                  backgroundColor: 'white',
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.8)',
                    color: 'primary.dark',
                  },
                }}
                variant="contained">
                Déconnexion
              </Button>
            </Toolbar>
          </AppBar>
          <Box sx={{display: 'flex'}}>
            <Drawer variant={'permanent'} open={!isMobile} anchor="left">
              <DrawerHeader>
                <Link
                  href="/"
                  style={{height: '35px', display: 'block', margin: '0 auto'}}>
                  <Logo inline color="primary" />
                </Link>
              </DrawerHeader>
              <Divider />
              <List>
                <DashboardSidebarListItem
                  text="Tableau de bord"
                  open={true}
                  icon={<HomeIcon />}
                  path="/sradmin"
                />
                <DashboardSidebarListItem
                  text="Agenda"
                  open={true}
                  icon={<CalendarMonthIcon />}
                  path="/sradmin/agenda"
                />
                {user && isItinerant(user) && (
                  <DashboardSidebarListItem
                    text="Tournée"
                    open={true}
                    icon={<RouteIcon />}
                    path="/sradmin/tour"
                  />
                )}
                <Badge badgeContent={unreadMessages} color="primary">
                  <DashboardSidebarListItem
                    text="Messages"
                    open={true}
                    icon={<ForumIcon />}
                    path="/sradmin/messagerie"
                  />
                </Badge>
                <DashboardSidebarListItem
                  text="Clients"
                  open={true}
                  icon={<FolderSharedIcon />}
                  path="/sradmin/clients"
                />
                {user && isBoss(user) && (
                  <DashboardSidebarListItem
                    text="Paramètres Agenda"
                    open={true}
                    icon={<HandymanIcon />}
                    path="/sradmin/agenda/parametres"
                  />
                )}
                {user && isBoss(user) && (
                  <DashboardSidebarListItem
                    text="Employés"
                    open={true}
                    icon={<EngineeringIcon />}
                    path="/sradmin/employes"
                  />
                )}
              </List>
              <Divider />
              <List>
                {user && isBoss(user) && (
                  <DashboardSidebarListItem
                    text="Informations"
                    open={true}
                    icon={<InfoIcon />}
                    path="/sradmin/informations"
                  />
                )}
                <DashboardSidebarListItem
                  text="Mon compte"
                  open={true}
                  icon={<AccountCircleIcon />}
                  path="/sradmin/mon-compte"
                />
                <DashboardSidebarListItem
                  text="Retourner sur le site"
                  open={true}
                  icon={<ArrowBackIcon />}
                  path="/"
                />
              </List>
            </Drawer>
            <Box sx={{flexGrow: 1}} p={3}>
              {children}
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default DashboardLayout;
