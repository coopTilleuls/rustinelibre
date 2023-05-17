import Link from 'next/link';
import {Button, Typography, Box} from '@mui/material';
import {Page} from '@interfaces/Page';
import {User} from '@interfaces/User';

interface NavbarDesktopProps {
  pages: Page[];
  boss: boolean;
  user?: User;
  logOut?: () => void;
}

const NavbarDesktop = ({
  pages,
  boss,
  user,
  logOut,
}: NavbarDesktopProps): JSX.Element => {
  return (
    <Box
      width="100%"
      height="80px"
      display={{xs: 'none', md: 'flex'}}
      justifyContent="space-between"
      alignItems="center">
      <Link href="/" style={{textDecoration: 'none'}}>
        <Box display="flex" alignItems="center" height="100%">
          <Typography
            color="primary"
            sx={{
              mr: 2,
              fontSize: 16,
              fontWeight: 900,
            }}>
            La Rustine Libre
          </Typography>
        </Box>
      </Link>
      <Box display="flex" justifyContent="flex">
        {pages.map(({name, link, disabled}) => {
          return (
            <Link
              key={name}
              href={disabled ? '' : link}
              style={{
                textDecoration: 'none',
                cursor: disabled ? 'default' : 'pointer',
              }}>
              <Button
                disabled={disabled}
                sx={{
                  display: 'flex',
                  paddingX: 2,
                  marginX: 0.5,
                  textTransform: 'capitalize',
                  fontSize: 16,
                  fontWeight: 600,
                  borderRadius: 20,
                  '&:hover': {
                    backgroundColor: 'white',
                  },
                }}>
                {name}
              </Button>
            </Link>
          );
        })}
        {boss && user && (
          <Link href="/dashboard" style={{textDecoration: 'none'}}>
            <Button
              key="dashboard"
              sx={{
                display: 'flex',
                paddingX: 2,
                marginX: 1,
                textTransform: 'capitalize',
                fontSize: 16,
                fontWeight: 600,
                borderRadius: 20,
                '&:hover': {
                  color: 'primary.main',
                  backgroundColor: 'white',
                },
              }}>
              Accès réparateur
            </Button>
          </Link>
        )}
        {user ? (
          <Button
            variant="contained"
            key="logout"
            onClick={logOut}
            sx={{
              display: 'flex',
              color: 'white',
              paddingX: 2,
              marginX: 1,
              textTransform: 'capitalize',
              fontSize: 16,
              fontWeight: 600,
              borderRadius: 20,
              '&:hover': {
                color: 'primary.main',
                backgroundColor: 'white',
              },
            }}>
            Déconnexion
          </Button>
        ) : (
          <Link
            href="/inscription"
            style={{
              textDecoration: 'none',
              cursor: 'pointer',
            }}>
            <Button
              variant="contained"
              sx={{
                display: 'flex',
                paddingX: 2,
                marginX: 0.5,
                textTransform: 'capitalize',
                fontSize: 16,
                fontWeight: 600,
                borderRadius: 20,
                color: 'white',
                '&:hover': {
                  color: 'primary.main',
                  backgroundColor: 'white',
                },
              }}>
              Inscription
            </Button>
          </Link>
        )}
      </Box>
    </Box>
  );
};

export default NavbarDesktop;
