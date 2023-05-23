import React, {useEffect, useState} from "react";
import Box from '@mui/material/Box';
import {Maintenance} from "@interfaces/Maintenance";
import {maintenanceResource} from "@resources/MaintenanceResource";
import {Bike} from "@interfaces/Bike";

type MaintenanceListProps = {
    bike: Bike;
};

const MaintenanceList = ({bike}: MaintenanceListProps): JSX.Element => {

    const [loading, setLoading] = useState<boolean>(false);
    const [maintenances, setMaintenances] = useState<Maintenance[]>([]);

    const fetchMaintenances = async () => {
        setLoading(true);
        const maintenancesFetch = await maintenanceResource.getAll(true, {
            bike: bike.id,
            'order[repairDate]': 'DESC',
        });
        setMaintenances(maintenancesFetch['hydra:member']);
        setLoading(false);
    }

    useEffect(() => {
        fetchMaintenances();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Box>
            {/*  @todo  */}
        </Box>
    )
}

export default MaintenanceList;
