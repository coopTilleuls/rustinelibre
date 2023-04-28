import React, {useContext} from 'react';
import Box from '@mui/material/Box';
import {Button, Typography} from '@mui/material';
import {AutodiagContext} from "@contexts/AutodiagContext";
import Link from "next/link";

export const AutoDiagTunnelChoice = (): JSX.Element => {

    const {appointment, setTunnelStep} = useContext(AutodiagContext);

    return (
        <Box>
            <Typography
                component="p"
                align="center"
                sx={{mt: 2}}>
                Souhaites tu transmettre un autodiagnostic au réparateur ?
            </Typography>
            {
                appointment && <Box>
                    <Button variant="outlined" sx={{marginTop:'30px'}} onClick={() => setTunnelStep('prestation')}>
                        Oui
                    </Button>
                    <Link href={`/rendez-vous/recapitulatif/${appointment.id}`}>
                        <Button variant="outlined" sx={{marginTop:'30px'}}>
                            Non
                        </Button>
                    </Link>
                </Box>
            }
        </Box>
    );
};

export default AutoDiagTunnelChoice;
