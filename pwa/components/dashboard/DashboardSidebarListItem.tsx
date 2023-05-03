import React from 'react';
import {useRouter} from 'next/router';
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListItem,
  Typography,
  Link,
} from '@mui/material';

interface DashboardSidebarListItemProps {
  text: string;
  open: boolean;
  icon: any;
  path: string;
}

const DashboardSidebarListItem = ({
  text,
  open,
  icon,
  path,
}: DashboardSidebarListItemProps): JSX.Element => {
  const router = useRouter();

  const handleMenuClick = () => {
    router.push(path);
  };

  return (
    <Link href={path} style={{textDecoration: 'none'}}>
      <ListItem key={text} disablePadding sx={{display: 'block'}}>
        <ListItemButton
          sx={{
            minHeight: 48,
            justifyContent: open ? 'initial' : 'center',
            px: 2.5,
          }}>
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 2 : 'auto',
              justifyContent: 'center',
              color: 'primary.main',
            }}>
            {icon}
          </ListItemIcon>
          <ListItemText
            disableTypography
            primary={
              <Typography
                sx={{
                  color: path === router.pathname ? 'primary.main' : 'grey.600',
                }}>
                {text}
              </Typography>
            }
          />
        </ListItemButton>
      </ListItem>
    </Link>
  );
};

export default DashboardSidebarListItem;
