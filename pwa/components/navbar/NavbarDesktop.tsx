import Link from 'next/link';
import {Button, Typography, Box} from '@mui/material';
import {Page} from '@interfaces/Page';
import {User} from '@interfaces/User';
import {useRouter} from "next/router";

interface NavbarDesktopProps {
  pages: Page[];
  boss: boolean;
  user?: User;
  employee: boolean;
  admin: boolean;
  logOut?: () => void;
}

const NavbarDesktop = ({pages, boss, user, employee, admin, logOut}: NavbarDesktopProps): JSX.Element => {

    const router = useRouter();
    const { asPath } = router;

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
            Rustine Libre
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
                  textDecoration: link === asPath ? 'underline' : 'none',
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
        {(boss || employee) && user && (
          <Link href="/sradmin" style={{textDecoration: 'none'}}>
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
        {(admin) && user && (
          <Link href="/admin/reparateurs" style={{textDecoration: 'none'}}>
            <Button
              key="admin"
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
              ADMIN
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
