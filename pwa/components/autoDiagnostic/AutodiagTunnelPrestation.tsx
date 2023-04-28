import React, {useContext} from 'react';
import Box from '@mui/material/Box';
import {Button, Typography} from '@mui/material';
import {AutodiagContext} from "@contexts/AutodiagContext";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {autoDiagnosticResource} from "@resources/autoDiagResource";

export const AutoDiagTunnelPrestation = (): JSX.Element => {

    const {prestation,
        appointment,
        autoDiagnostic,
        setTunnelStep,
        setPrestation,
        setAutoDiagnostic} = useContext(AutodiagContext);

    const handleChangePrestation = (event: SelectChangeEvent): void => {
        setPrestation(event.target.value as string);
    };

    const handleClickBack = (): void => {
        setTunnelStep('choice');
    }

    const handleClickNext = async() => {
        if (!appointment) {
            return;
        }

        if (!autoDiagnostic) {
            const newAutodiag = await autoDiagnosticResource.post({
                'prestation': prestation,
                'appointment': appointment['@id']
            })

            if (newAutodiag) setAutoDiagnostic(newAutodiag);
        } else {
            await autoDiagnosticResource.put(autoDiagnostic['@id'], {
                'prestation' : prestation
            })
        }

        setTunnelStep('photo');
    }

    return (
        <Box>
            <Typography
                component="p"
                align="center"
                sx={{mt: 2}}>
                De quelle prestation as tu besoin ?
            </Typography>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={prestation}
                label="Prestation"
                onChange={handleChangePrestation}
            >
                <MenuItem value="Entretien classique">Entretien classique</MenuItem>
                <MenuItem value="Électrifier mon vélo">Électrifier mon vélo</MenuItem>
                <MenuItem value="Problème de frein">Problème de frein</MenuItem>
                <MenuItem value="Problème de pneu">Problème de pneu</MenuItem>
                <MenuItem value="Problème de roue">Problème de roue</MenuItem>
                <MenuItem value="Problème de vitesse">Problème de vitesse</MenuItem>
                <MenuItem value="Autre prestation">Autre prestation</MenuItem>
            </Select> <br />

            <Button variant="outlined" sx={{marginTop:'30px'}} onClick={handleClickBack}>
                Retour
            </Button>
            <Button variant="outlined" sx={{marginTop:'30px', marginLeft: '20px'}} onClick={handleClickNext}>
                Suivant
            </Button>
        </Box>
    );
};

export default AutoDiagTunnelPrestation;
