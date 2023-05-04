import * as React from 'react';
import Link from 'next/link';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import {Container} from '@mui/material';
import Box from '@mui/material/Box';
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
    <Container
      sx={{
        display: {xs: 'none', md: 'flex'},
        justifyContent: 'space-between',
        alignItems: 'center',
        my: 2,
      }}>
      <Link href="/" style={{textDecoration: 'none'}}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: 'white',
          }}>
          <DirectionsBikeIcon sx={{mr: 1}} fontSize="large" />
          <Typography
            sx={{
              mr: 2,
              fontSize: 20,
              fontWeight: 900,
            }}>
            Bikelib
          </Typography>
        </Box>
      </Link>
      <Box sx={{display: 'flex', justifyContent: 'center'}}>
        {pages.map((page) => {
          return (
            <Link
              key={page.name}
              href={page.link}
              style={{textDecoration: 'none'}}>
              <Button
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
                {page.name}
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
    </Container>
  );
};

export default NavbarDesktop;
