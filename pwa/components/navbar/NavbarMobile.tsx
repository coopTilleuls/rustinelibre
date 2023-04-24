import * as React from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import {Page} from '@interfaces/Page';
import {User} from '@interfaces/User';

interface MobileNavbarProps {
  pages: Page[];
  boss: boolean;
  user?: User;
  handleClose?: () => void;
  handleOpen?: (value: any) => void;
  logOut?: () => void;
  anchorElNav: HTMLElement | null;
}

const MobileNavbar = ({
  pages,
  boss,
  user,
  handleClose,
  handleOpen,
  anchorElNav,
  logOut,
}: MobileNavbarProps): JSX.Element => {
  return (
    <Box
      sx={{
        display: {xs: 'flex', md: 'none'},
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleOpen}
        color="inherit">
        <MenuIcon />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorElNav}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        open={Boolean(anchorElNav)}
        onClose={handleClose}
        sx={{
          display: {xs: 'block', md: 'none'},
        }}>
        {pages.map((page) => (
          <Link
            key={page.name}
            href={page.link}
            style={{textDecoration: 'none', color: 'black'}}>
            <MenuItem sx={{textAlign: 'center'}} onClick={handleClose}>
              <Typography textAlign="center">{page.name}</Typography>
            </MenuItem>
          </Link>
        ))}
        {boss && user && (
          <Link
            href="/dashboard"
            style={{textDecoration: 'none', color: 'currentcolor'}}>
            <MenuItem
              sx={{textAlign: 'center'}}
              key="dashboard_boss"
              onClick={handleClose}>
              <Typography textAlign="center">Dashboard</Typography>
            </MenuItem>
          </Link>
        )}
        {user && (
          <MenuItem sx={{textAlign: 'center'}} key="logout" onClick={logOut}>
            <Typography textAlign="center">Déconnexion</Typography>
          </MenuItem>
        )}
      </Menu>
      <DirectionsBikeIcon sx={{mr: 1}} />
      <Link href="/" style={{textDecoration: 'none'}}>
        <Typography
          color="white"
          sx={{
            mr: 2,
            fontSize: 18,
            fontWeight: 600,
          }}>
          Bikelib
        </Typography>
      </Link>
    </Box>
  );
};

export default MobileNavbar;
