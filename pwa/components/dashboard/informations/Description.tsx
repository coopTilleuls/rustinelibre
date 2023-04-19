import React, {useContext, useEffect} from "react";
import {Repairer} from "@interfaces/Repairer";
import InputLabel from "@mui/material/InputLabel";
import {RepairerFormContext} from "@contexts/RepairerFormContext";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import dynamic from 'next/dynamic';
const Editor = dynamic(() => import("@components/form/Editor"), {
    ssr: false
});

interface ContactDetailsProps {
    repairer: Repairer|null;
}

export const ContactDetails = ({repairer}: ContactDetailsProps): JSX.Element => {
    const {description, setDescription, bikeTypes, repairerTypes, setRepairerTypeSelected, selectedBikeTypes, setSelectedBikeTypes, repairerTypeSelected} = useContext(RepairerFormContext);

    useEffect(() => {
        if (repairer) {
            setDescription(repairer.description ? repairer.description : '');
        }
    }, [repairer, setDescription]);

    const handleChangeRepairerType = (event: SelectChangeEvent): void => {
        const selectedRepairerType = repairerTypes.find((rt) => rt.name === event.target.value);
        setRepairerTypeSelected(selectedRepairerType ? selectedRepairerType : null);
    };
    const handleChangeBikeRepaired = (event: SelectChangeEvent<typeof selectedBikeTypes>) => {
        const {target: { value },} = event;
        setSelectedBikeTypes(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    return (
        <>
            <InputLabel htmlFor="bikeType">Type de réparateur</InputLabel>
            <Select
                required
                label="Choisissez votre type d'enseigne"
                onChange={handleChangeRepairerType}
                value={repairerTypeSelected?.name}
                style={{width: '100%'}}
            >
                {repairerTypes.map((repairer) => (
                    <MenuItem key={repairer.id} value={repairer.name}>{repairer.name}</MenuItem>
                ))}
            </Select>

            <InputLabel id="demo-multiple-checkbox-label">Vélos réparés</InputLabel>
            <Select
                labelId="multiple_bikes_repaired"
                id="multiple_bikes_repaired"
                multiple
                fullWidth
                value={selectedBikeTypes}
                onChange={handleChangeBikeRepaired}
                input={<OutlinedInput label="Type de vélos" />}
                renderValue={(selected) => selected.join(', ')}
            >
                {bikeTypes.map((bikeType) => (
                    <MenuItem key={bikeType.name} value={bikeType.name}>
                        <Checkbox checked={selectedBikeTypes.indexOf(bikeType.name) > -1} />
                        <ListItemText primary={bikeType.name} />
                    </MenuItem>
                ))}
            </Select>

            <br />
            <InputLabel>Description</InputLabel>
            <Editor content={description} setContent={setDescription}/>
        </>
    );
};

export default ContactDetails;
