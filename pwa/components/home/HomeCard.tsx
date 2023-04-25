import {PropsWithChildren} from 'react';
import Link from 'next/link';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';

interface HomeCardProps extends PropsWithChildren {
  title: string;
  subTitle: string;
  buttonName: string;
  pageLink: string;
  backgroundColor?: string;
}

export const HomeCard = ({
  title,
  subTitle,
  buttonName,
  pageLink,
  backgroundColor,
}: HomeCardProps): JSX.Element => {
  return (
    <Paper
      elevation={3}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        minHeight: {md: 400},
        padding: {xs: 4, md: 6},
        backgroundColor: `${backgroundColor}`,
      }}>
      <Stack spacing={{xs: 2, md: 4}} alignItems="center">
        <Typography
          component="h3"
          color="textPrimary"
          sx={{fontSize: {xs: 24, md: 40}, fontWeight: 600}}>
          {title}
        </Typography>
        <Typography
          component="h4"
          color="textSecondary"
          sx={{fontSize: {xs: 16, md: 20}}}>
          {subTitle}
        </Typography>
        <Link href={pageLink}>
          <Button variant="contained" sx={{mt: 1, fontSize: {xs: 12, md: 16}}}>
            {buttonName}
          </Button>
        </Link>
      </Stack>
    </Paper>
  );
};
