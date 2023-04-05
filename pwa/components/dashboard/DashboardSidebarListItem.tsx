import React, {ChangeEvent} from "react";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import {useState} from 'react';
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import { useRouter } from 'next/router';

interface DashboardSidebarListItemProps {
    text: string;
    open: boolean;
    icon: any;
    path: string;
}

const DashboardSidebarListItem = ({text, open, icon, path}: DashboardSidebarListItemProps): JSX.Element => {

    const router = useRouter();

    const handleMenuClick = () => {
        router.push(path);
    };

    return (
        <ListItem key={text} disablePadding sx={{ display: 'block' }} onClick={() => handleMenuClick()}>
            <ListItemButton
                sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                }}
            >
                <ListItemIcon
                    sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                    }}
                >
                    {icon}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
        </ListItem>
    );
};

export default DashboardSidebarListItem;
