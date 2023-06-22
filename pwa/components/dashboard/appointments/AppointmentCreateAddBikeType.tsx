import React, {useEffect, useState} from 'react';
import {
    Stack,
    FormControl,
    InputLabel, MenuItem,
} from '@mui/material';
import Select, {SelectChangeEvent} from "@mui/material/Select";
import {bikeTypeResource} from "@resources/bikeTypeResource";
import {BikeType} from "@interfaces/BikeType";

interface AppointmentCreateAddBikeTypeProps {
    selectedBikeType: BikeType | null
    setSelectedBikeType: React.Dispatch<React.SetStateAction<BikeType | null>>;
}
const AppointmentCreateAddBikeType = ({selectedBikeType, setSelectedBikeType}: AppointmentCreateAddBikeTypeProps): JSX.Element => {

    const [bikeTypes, setBikeTypes] = useState<BikeType[]>([]);

    const fetchBikeTypes = async() => {
        const responseBikeTypes = await bikeTypeResource.getAll(false);
        setBikeTypes(responseBikeTypes['hydra:member']);
    }

    useEffect(() => {
        fetchBikeTypes();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleBikeChange = (event: SelectChangeEvent): void => {
        const selectedBikeType = bikeTypes?.find(
            (bt) => bt.name === event.target.value
        );
        setSelectedBikeType(selectedBikeType ? selectedBikeType : null);
    };

    return (
        <Stack
            width={{xs: '100%', sm: '65%', md: '50%'}}
            py={2}
            mx="auto"
            spacing={4}
            display="flex"
            flexDirection="column"
            alignItems={'center'}>
                <FormControl fullWidth required sx={{mt: 2, mb: 1}}>
                    <InputLabel id="bike-type-label">Type de vélo</InputLabel>
                    <Select
                        label="Type de vélo"
                        required
                        id="bike-type"
                        labelId="bike-type-label"
                        onChange={handleBikeChange}
                        value={selectedBikeType?.name}
                        sx={{width: '100%'}}>
                        <MenuItem disabled value="">
                            Choisissez un type de vélo
                        </MenuItem>
                        {bikeTypes.map((bike) => (
                            <MenuItem key={bike.id} value={bike.name}>
                                {bike.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Stack>

)};
export default AppointmentCreateAddBikeType;
