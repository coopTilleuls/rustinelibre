import { PropsWithChildren } from 'react';
import Link from 'next/link';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

interface HomeCardProps extends PropsWithChildren {
  title: string;
  subTitle: string;
  button: string;
  pageLink: string;
  backgroundColor?: string;
}

export const HomeCard = ({
  title,
  subTitle,
  button,
  pageLink,
  backgroundColor,
}: HomeCardProps): JSX.Element => (
  <div className={backgroundColor} style={{ paddingBottom: '30px' }}>
    <Typography
      component='h1'
      variant='h2'
      align='center'
      color='textPrimary'
      gutterBottom
    >
      {title}
    </Typography>
    <Typography variant='h6' align='center' color='textSecondary' paragraph>
      {subTitle}
    </Typography>
    <Link href={pageLink}>
      <Button variant='outlined' color='primary' style={{ marginLeft: '45%' }}>
        {button}
      </Button>
    </Link>
  </div>
);
