import Link from 'next/link';
import {Button, Typography, Box} from '@mui/material';
import {Page} from '@interfaces/Page';
import {User} from '@interfaces/User';

interface NavbarDesktopProps {
  pages: Page[];
  boss: boolean;
  user?: User;
  handleClose?: () => void;
  logOut?: () => void;
}

const NavbarDesktop = ({
  pages,
  boss,
  user,
  handleClose,
  logOut,
}: NavbarDesktopProps): JSX.Element => {
  return (
    <Box
      width="100%"
      display={{xs: 'none', md: 'flex'}}
      justifyContent="space-between"
      alignItems="center"
      my={2}>
      <Link href="/" style={{textDecoration: 'none'}}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: 'white',
          }}>
          <Typography
            sx={{
              mr: 2,
              fontSize: 16,
              fontWeight: 900,
            }}>
            La Rustine Libre
          </Typography>
        </Box>
      </Link>
      <Box sx={{display: 'flex', justifyContent: 'center'}}>
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
                onClick={handleClose}
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
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
              onClick={handleClose}
              sx={{
                display: 'flex',
                paddingX: 2,
                marginX: 1,
                textTransform: 'capitalize',
                fontSize: 16,
                fontWeight: 600,
                borderRadius: 20,
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}>
              Accès réparateur
            </Button>
          </Link>
        )}
        {user && (
          <Button
            variant="outlined"
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
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.4)',
              },
            }}>
            Déconnexion
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default NavbarDesktop;
