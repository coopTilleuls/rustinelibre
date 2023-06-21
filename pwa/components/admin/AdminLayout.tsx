import * as React from 'react';
import {useRouter} from 'next/router';
import {styled, useTheme, Theme, CSSObject} from '@mui/material/styles';
import {Box, Toolbar, List, Divider, ListItem, Typography} from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, {AppBarProps as MuiAppBarProps} from '@mui/material/AppBar';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {useAccount} from '@contexts/AuthContext';
import useMediaQuery from '@hooks/useMediaQuery';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import MessageIcon from '@mui/icons-material/Message';
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DashboardSidebarListItem from "@components/dashboard/DashboardSidebarListItem";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import Link from "next/link";
import {useEffect, useState} from "react";
import {MediaObject} from "@interfaces/MediaObject";
import {isAdmin, isBoss} from "@helpers/rolesHelpers";
import {contactResource} from "@resources/ContactResource";
import Badge from '@mui/material/Badge';

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

const AdminLayout = ({children}: DashboardLayoutProps) => {
  const theme = useTheme();
  const {user} = useAccount({redirectIfNotFound: '/login'});
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width: 640px)');
  const [contactUnread, setContactUnread] = useState<number>(0);

  if (user && !isAdmin(user)) {
    router.push('/');
  }

  const countContactUnread = async() => {
      const response = await contactResource.getAll(true, {
        alreadyRead: false
      })

      setContactUnread(response['hydra:totalItems']);
  }

  useEffect(() => {
      countContactUnread();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <AppBar position="sticky" open={!isMobile}>
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
        <Drawer variant={'permanent'} open={!isMobile} anchor="left">
          <DrawerHeader>
            <Link href="/" style={{textDecoration: 'none'}}>
              <Typography
                  color="primary"
                  sx={{
                    fontSize: 17,
                    fontWeight: 600,
                  }}>
                La Rustine Libre - ADMIN
              </Typography>
            </Link>
          </DrawerHeader>
          <Divider />
          <List>
            <DashboardSidebarListItem
                text="Réparateurs"
                open={true}
                icon={<DirectionsBikeIcon />}
                path="/admin/reparateurs"
            />
            <DashboardSidebarListItem
              text="Utilisateurs"
              open={true}
              icon={<AccountCircleIcon />}
              path="/admin/utilisateurs"
            />
            <DashboardSidebarListItem
              text="Contact"
              open={true}
              icon={<Badge badgeContent={contactUnread} color="error">
                <MessageIcon />
              </Badge>}
              path="/admin/contact"
            />
            <DashboardSidebarListItem
              text="Paramètres"
              open={true}
              icon={<FolderSharedIcon />}
              path="/admin/parametres"
            />
            <DashboardSidebarListItem
              text="Profil"
              open={true}
              icon={<CompareArrowsIcon />}
              path="/admin/profil"
            />
          </List>
          <Divider />
          <List>
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

export default AdminLayout;
