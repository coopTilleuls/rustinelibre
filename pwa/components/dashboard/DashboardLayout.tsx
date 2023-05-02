import * as React from 'react';
import {styled, useTheme, Theme, CSSObject} from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, {AppBarProps as MuiAppBarProps} from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import DashboardSidebarListItem from '@components/dashboard/DashboardSidebarListItem';
import HomeIcon from '@mui/icons-material/Home';
import ForumIcon from '@mui/icons-material/Forum';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import InfoIcon from '@mui/icons-material/Info';
import {Link, ListItem, Typography} from '@mui/material';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EngineeringIcon from '@mui/icons-material/Engineering';
import {useAccount} from '@contexts/AuthContext';
import {useRouter} from 'next/router';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
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
  const open = true;
  const {user, isLoadingFetchUser} = useAccount({redirectIfNotFound: '/login'});
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width: 640px)');

  if (!isLoadingFetchUser && (user && !user.roles.includes('ROLE_BOSS'))) {
    router.push('/');
  }

  return (
    <>
      <AppBar position="sticky">
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
          open={isMobile ? !open : open}
          anchor="left">
          <DrawerHeader></DrawerHeader>
          <Divider />
          <List>
            <DashboardSidebarListItem
              text="Tableau de bord"
              open={open}
              icon={<HomeIcon />}
              path="/dashboard"
            />
            <DashboardSidebarListItem
              text="Agenda"
              open={open}
              icon={<CalendarMonthIcon />}
              path="/dashboard/agenda"
            />
            <DashboardSidebarListItem
              text="Messages"
              open={open}
              icon={<ForumIcon />}
              path="/dashboard/messagerie"
            />
            <DashboardSidebarListItem
              text="Clients"
              open={open}
              icon={<FolderSharedIcon />}
              path="/dashboard/clients"
            />
            <DashboardSidebarListItem
              text="Employés"
              open={open}
              icon={<EngineeringIcon />}
              path="/dashboard/employes"
            />
          </List>
          <Divider />
          <List>
            <DashboardSidebarListItem
              text="Informations"
              open={open}
              icon={<InfoIcon />}
              path="/dashboard/informations"
            />
            <DashboardSidebarListItem
              text="Retourner sur le site"
              open={open}
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
