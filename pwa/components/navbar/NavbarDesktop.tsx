import NextLink from 'next/link';
import {Button, Box, Link} from '@mui/material';
import {Page} from '@interfaces/Page';
import {User} from '@interfaces/User';
import {useRouter} from 'next/router';
import Logo from '@components/common/Logo';

interface NavbarDesktopProps {
  pages: Page[];
  boss: boolean;
  user?: User;
  employee: boolean;
  admin: boolean;
  logOut?: () => void;
}

const NavbarDesktop = ({
  pages,
  boss,
  user,
  employee,
  admin,
  logOut,
}: NavbarDesktopProps): JSX.Element => {
  const router = useRouter();
  const {asPath} = router;

  const getButton = () => {
    let link = '';
    let text;
    let onClick;

    if (user && (boss || employee)) {
      link = '/sradmin';
      text = 'Accès réparateur';
    } else if (user && admin) {
      link = '/admin/reparateurs';
      text = 'ADMIN';
    } else if (user) {
      onClick = logOut;
      text = 'Déconnexion';
    } else {
      link = '/inscription';
      text = 'Inscription';
    }
    const Element = (
      <Button
        variant="contained"
        onClick={onClick}
        size="medium"
        sx={{
          display: 'flex',
          paddingX: 2,
        }}>
        {text}
      </Button>
    );
    return onClick ? (
      Element
    ) : (
      <NextLink legacyBehavior href={link}>
        {Element}
      </NextLink>
    );
  };

  return (
    <Box
      width="100%"
      height="80px"
      display={{xs: 'none', md: 'flex'}}
      justifyContent="space-between"
      alignItems="center">
      <NextLink href="/" style={{height: '35px', display: 'block'}}>
        <Logo inline color="primary" />
      </NextLink>
      <Box display="flex" gap={4} justifyContent="flex" alignItems="center">
        {pages.map(({name, link, disabled}) => {
          return (
            <NextLink
              key={name}
              href={disabled ? '' : link}
              legacyBehavior
              passHref>
              <Link
                variant="body2"
                color={link === asPath ? 'primary' : 'text.primary'}
                fontWeight={700}
                sx={{
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
                underline={link === asPath ? 'always' : 'none'}>
                {name}
              </Link>
            </NextLink>
          );
        })}
        {getButton()}
      </Box>
    </Box>
  );
};

export default NavbarDesktop;
