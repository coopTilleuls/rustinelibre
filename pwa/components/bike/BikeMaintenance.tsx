import React, {ChangeEvent, useEffect, useState} from "react";
import {Bike} from "@interfaces/Bike";
import Box from "@mui/material/Box";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import {BikeType} from "@interfaces/BikeType";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import {RequestBody} from "@interfaces/Resource";
import {bikeResource} from "@resources/bikeResource";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import SaveIcon from '@mui/icons-material/Save';
import {Alert, CircularProgress} from "@mui/material";
import BikeIdentityPhoto from "@components/bike/BikeIdentityPhoto";

type BikeMaintenanceProps = {
    bike: Bike;
};

const BikeMaintenance = ({bike}: BikeMaintenanceProps): JSX.Element => {

    // const [maintenances, setMaintenances] = useState<>(false);
    const [openModal, setOpenModal] = useState<boolean>(false);

    // async function fetchMaintenance() {
    //     if (user) {
    //         setLoading(true);
    //         const bikesFetched = await bikeResource.getAll(true, {owner: user.id});
    //         setLoading(false);
    //         setBikes(bikesFetched['hydra:member']);
    //     }
    // }
    //
    // useEffect(() => {
    //     fetchBikes();
    // }, [user]); // eslint-disable-line react-hooks/exhaustive-deps


    return (
        <Box
            sx={{
                marginTop: 4,
            }}
        >

        </Box>
    )
}

export default BikeMaintenance;
