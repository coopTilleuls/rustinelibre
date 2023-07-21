import * as React from 'react';
import {useRouter} from 'next/router';
import {styled, useTheme, Theme, CSSObject} from '@mui/material/styles';
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
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {useAccount, useAuth} from '@contexts/AuthContext';
import useMediaQuery from '@mui/material/useMediaQuery';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import MessageIcon from '@mui/icons-material/Message';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardSidebarListItem from '@components/dashboard/DashboardSidebarListItem';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import Link from 'next/link';
import {useEffect, useState} from 'react';
import {isAdmin} from '@helpers/rolesHelpers';
import {contactResource} from '@resources/ContactResource';
import Badge from '@mui/material/Badge';
import Logo from '@components/common/Logo';

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
  updateContactUnread?: boolean;
}

const AdminLayout = ({children, updateContactUnread}: DashboardLayoutProps) => {
  const theme = useTheme();
  const router = useRouter();
  const {user} = useAccount({
    redirectIfNotFound: `/login?next=${encodeURIComponent(router.asPath)}`,
  });
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [contactUnread, setContactUnread] = useState<number>(0);
  const {logout} = useAuth();

  if (user && !isAdmin(user)) {
    router.push('/');
  }

  const countContactUnread = async () => {
    const response = await contactResource.getAll(true, {
      alreadyRead: false,
    });

    setContactUnread(response['hydra:totalItems']);
  };

  const clickLogOut = async () => {
    await logout();
    await router.push(`/login?next=${encodeURIComponent(router.asPath)}`);
  };

  useEffect(() => {
    if (user && isAdmin(user)) {
      countContactUnread();
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (updateContactUnread) {
      countContactUnread();
    }
  }, [updateContactUnread]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {user && isAdmin(user) && (
        <Box>
          <AppBar position="sticky" open={!isMobile}>
            <Toolbar>
              <List>
                <ListItem key="1" disablePadding>
                  <Typography fontWeight={600}>
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
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  width="100%">
                  <Link
                    href="/"
                    style={{
                      height: '35px',
                      display: 'block',
                      margin: '0 auto',
                    }}>
                    <Logo inline color="primary" />
                  </Link>
                  <Typography
                    textAlign="center"
                    variant="caption"
                    fontWeight={600}
                    color="primary">
                    ADMIN
                  </Typography>
                </Box>
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
                  icon={
                    <Badge badgeContent={contactUnread} color="error">
                      <MessageIcon />
                    </Badge>
                  }
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
        </Box>
      )}
    </>
  );
};

export default AdminLayout;
