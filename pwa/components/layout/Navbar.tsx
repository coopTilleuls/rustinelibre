import * as React from 'react';
import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {useAuth} from '@contexts/AuthContext';
import {pagesLogged} from '@components/layout/NavbarMenuLogged';
import {pagesNotLogged} from '@components/layout/NavbarMenuLogged';
import NavbarDesktop from '@components/navbar/NavbarDesktop';
import MobileNavbar from '@components/navbar/NavbarMobile';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import {getRoles} from '@helpers/localHelper';
import {User} from '@interfaces/User';

interface NavbarProps {
  user?: User;
}

const Navbar = ({user}: NavbarProps): JSX.Element => {
  const router = useRouter();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const pages = user ? pagesLogged : pagesNotLogged;
  const [boss, setBoss] = useState<boolean>(false);
  const [employee, setEmployee] = useState<boolean>(false);
  const [admin, setAdmin] = useState<boolean>(false);
  const {logout} = useAuth();

  useEffect(() => {
    if (user) {
      const roles = getRoles();
      roles?.includes('ROLE_ADMIN') ? setAdmin(true) : setAdmin(false);
      roles?.includes('ROLE_EMPLOYEE') ? setEmployee(true) : setEmployee(false);
      roles?.includes('ROLE_BOSS') ? setBoss(true) : setBoss(false);
    }
  }, [user]);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const clickLogOut = () => {
    logout();
    router.push('/');
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <NavbarDesktop
            pages={pages}
            boss={boss}
            user={user}
            handleClose={handleCloseNavMenu}
            logOut={clickLogOut}
          />
          <MobileNavbar
            pages={pages}
            boss={boss}
            user={user}
            handleClose={handleCloseNavMenu}
            handleOpen={handleOpenNavMenu}
            logOut={clickLogOut}
            anchorElNav={anchorElNav}
          />
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
