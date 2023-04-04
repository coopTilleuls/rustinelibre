import React from "react";
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import ListIcon from '@mui/icons-material/List';
import Paper from '@mui/material/Paper';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {useAccount} from "../../contexts";

const Footer = (): JSX.Element => {

    const [value, setValue] = React.useState(0);
    const user = useAccount({});

    return (
        <Box sx={{ width: 500 }}>
            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                <BottomNavigation
                    showLabels
                    value={value}
                    onChange={(event, newValue) => {
                        setValue(newValue);
                    }}
                >
                    <BottomNavigationAction href="/" label="Accueil" icon={<HomeIcon />} />
                    <BottomNavigationAction label="Rendez-vous" icon={<ListIcon />} />
                    <BottomNavigationAction label="Mes vélos" icon={<DirectionsBikeIcon />} />
                    <BottomNavigationAction label="Messages" icon={<ChatBubbleIcon />} />
                    <BottomNavigationAction href={user ? '/' : '/login'} label={user ? 'Profil' : 'Connexion'} icon={<AccountCircleIcon />} />
                </BottomNavigation>
            </Paper>
        </Box>
    );
};

export default Footer;