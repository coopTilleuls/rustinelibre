import * as React from 'react';
import {useRouter} from 'next/router';
import {styled, useTheme, Theme, CSSObject} from '@mui/material/styles';
import {Box, Toolbar, List, Divider, ListItem, Typography} from '@mui/material';
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
import {useAccount} from '@contexts/AuthContext';
import useMediaQuery from '@hooks/useMediaQuery';

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
  justifyContent: 'flex-end',
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
  const theme = useTheme();
  const {user} = useAccount({redirectIfNotFound: '/login'});
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width: 640px)');

  if (user && !user.roles.includes('ROLE_BOSS')) {
    router.push('/');
  }

  return (
    <>
      <AppBar position="sticky" open={isMobile ? false : true}>
        <Toolbar>
          <List>
            <ListItem key="1" disablePadding>
              <Typography fontWeight={600}>
                Bonjour {user?.firstName} !
              </Typography>
            </ListItem>
          </List>
        </Toolbar>
      </AppBar>
      <Box sx={{display: 'flex'}}>
        <Drawer
          variant={'permanent'}
          open={isMobile ? false : true}
          anchor="left">
          <DrawerHeader></DrawerHeader>
          <Divider />
          <List>
            <DashboardSidebarListItem
              text="Tableau de bord"
              open={true}
              icon={<HomeIcon />}
              path="/dashboard"
            />
            <DashboardSidebarListItem
              text="Agenda"
              open={true}
              icon={<CalendarMonthIcon />}
              path="/dashboard/agenda"
            />
            <DashboardSidebarListItem
              text="Messages"
              open={true}
              icon={<ForumIcon />}
              path="/dashboard/messagerie"
            />
            <DashboardSidebarListItem
              text="Clients"
              open={true}
              icon={<FolderSharedIcon />}
              path="/dashboard/clients"
            />
            <DashboardSidebarListItem
              text="Employés"
              open={true}
              icon={<EngineeringIcon />}
              path="/dashboard/employes"
            />
          </List>
          <Divider />
          <List>
            <DashboardSidebarListItem
              text="Informations"
              open={true}
              icon={<InfoIcon />}
              path="/dashboard/informations"
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
    </>
  );
};

export default DashboardLayout;
