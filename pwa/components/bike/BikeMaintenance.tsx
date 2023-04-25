import React, {ChangeEvent, useEffect, useState} from "react";
import {Bike} from "@interfaces/Bike";
import Box from "@mui/material/Box";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import {BikeType} from "@interfaces/BikeType";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import {Collection, RequestBody} from "@interfaces/Resource";
import {bikeResource} from "@resources/bikeResource";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import SaveIcon from '@mui/icons-material/Save';
import {Alert, CircularProgress} from "@mui/material";
import BikeIdentityPhoto from "@components/bike/BikeIdentityPhoto";
import {maintenanceResource} from "@resources/MaintenanceResource";
import {Maintenance} from "@interfaces/Maintenance";
import {useAccount} from "@contexts/AuthContext";
import Head from "next/head";
import WebsiteLayout from "@components/layout/WebsiteLayout";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {apiImageUrl} from "@helpers/apiImagesHelper";
import BikeTabs from "@components/bike/BikeTabs";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import ModalAddBike from "@components/bike/ModalAddBike";
import ModalAddMaintenance from "@components/bike/ModalAddMaintenance";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import ListItemText from "@mui/material/ListItemText";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import BuildIcon from "@mui/icons-material/Build";
import List from "@mui/material/List";
import Divider from '@mui/material/Divider';


type BikeMaintenanceProps = {
    bike: Bike;
};

const BikeMaintenance = ({bike}: BikeMaintenanceProps): JSX.Element => {

    const user = useAccount({});
    const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    async function fetchMaintenance() {
        if (user) {
            setLoading(true);
            const maintenanceCollection: Collection<Maintenance> = await maintenanceResource.getAll(true, {owner: user.id, 'order[repairDate]': 'DESC'});
            setLoading(false);
            setMaintenances(maintenanceCollection['hydra:member']);
        }
    }

    useEffect(() => {
        fetchMaintenance();
    }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleOpenModal = (): void => setOpenModal(true);
    const handleCloseModal = (): void => {
        setOpenModal(false)
        fetchMaintenance();
    };

    return (
        <Box
            sx={{
                marginTop: 4,
            }}
        >
            {loading && <CircularProgress />}


            <List
                sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                component="nav"
                aria-labelledby="nested-list-subheader"
            >
                {maintenances.map((maintenance) => (
                    <div key={maintenance.id}>
                        <ListItemButton key={maintenance.id}>
                            <ListItemText primary={maintenance.repairDate ? maintenance.repairDate.date : ''} />
                            <ListItemText primary={maintenance.name} />
                            <ListItemText primary={<Button variant="outlined">Détails</Button>} />
                        </ListItemButton>
                        <Divider />
                    </div>
                ))}
            </List>

            {/*<TableContainer component={Paper}>*/}
            {/*    <Table sx={{ minWidth: 650 }} aria-label="simple table">*/}
            {/*        <TableBody>*/}
            {/*            {maintenances.map((maintenance) => (*/}
            {/*                <TableRow*/}
            {/*                    key={maintenance.id}*/}
            {/*                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}*/}
            {/*                >*/}
            {/*                    <TableCell component="th" scope="row">*/}
            {/*                        {maintenance.repairDate ? maintenance.repairDate.date : ''}*/}
            {/*                    </TableCell>*/}
            {/*                    <TableCell align="right">{maintenance.name}</TableCell>*/}
            {/*                    <TableCell align="right">Détail</TableCell>*/}
            {/*                </TableRow>*/}
            {/*            ))}*/}
            {/*        </TableBody>*/}
            {/*    </Table>*/}
            {/*</TableContainer>*/}

            <Button c sx={{mb: 3, mt: 2}} onClick={handleOpenModal}>
                <AddIcon />
                Ajouter une réparation
            </Button>

            <ModalAddMaintenance bike={bike} openModal={openModal} handleCloseModal={handleCloseModal} />
        </Box>
    )
}

export default BikeMaintenance;
