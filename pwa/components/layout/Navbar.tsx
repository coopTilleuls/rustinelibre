import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {menuLogged, menuNotLogged} from '@data/menu';
import {useAuth} from '@contexts/AuthContext';
import NavbarDesktop from '@components/navbar/NavbarDesktop';
import MobileNavbar from '@components/navbar/NavbarMobile';
import {AppBar, Toolbar} from '@mui/material';
import {getRoles} from '@helpers/localHelper';
import {User} from '@interfaces/User';

interface NavbarProps {
  user?: User;
}

const Navbar = ({user}: NavbarProps): JSX.Element => {
  const router = useRouter();
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const pages = user ? menuLogged : menuNotLogged;
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
    <AppBar position="fixed">
      <Toolbar>
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
    </AppBar>
  );
};

export default Navbar;
