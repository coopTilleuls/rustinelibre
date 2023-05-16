import Link from 'next/link';
import {
  Box,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Container,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
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
    <Container
      sx={{
        px: 0,
        display: {xs: 'flex', md: 'none'},
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <Box
        sx={{
          display: {xs: 'flex', md: 'none'},
          alignItems: 'center',
        }}>
        <Link href="/" style={{textDecoration: 'none'}}>
          <Typography
            color="primary"
            sx={{
              fontSize: 18,
              fontWeight: 600,
            }}>
            La Rustine Libre
          </Typography>
        </Link>
      </Box>
      <Box>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleOpen}
          color="primary"
          sx={{pr: 0}}>
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
          {pages.map(({name, link, disabled}) => (
            <Link
              key={name}
              href={disabled ? '' : link}
              style={{textDecoration: 'none', color: 'black'}}>
              <MenuItem
                disabled={disabled}
                sx={{textAlign: 'center'}}
                onClick={handleClose}>
                <Typography textAlign="center">{name}</Typography>
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
                <Typography textAlign="center">Tableau de bord</Typography>
              </MenuItem>
            </Link>
          )}
          {user && (
            <MenuItem sx={{textAlign: 'center'}} key="logout" onClick={logOut}>
              <Typography textAlign="center">Déconnexion</Typography>
            </MenuItem>
          )}
        </Menu>
      </Box>
    </Container>
  );
};

export default MobileNavbar;
