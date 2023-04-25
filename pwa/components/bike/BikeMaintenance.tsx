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
import {formatDate} from "@helpers/dateHelper";


type BikeMaintenanceProps = {
    bike: Bike;
    maintenances: Maintenance[];
    loading: boolean;
    fetchMaintenance: () => Promise<void>;
};

const BikeMaintenance = ({bike, maintenances, loading, fetchMaintenance}: BikeMaintenanceProps): JSX.Element => {

    const user = useAccount({});
    const [openModal, setOpenModal] = useState<boolean>(false);

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

            {!loading && maintenances.length > 0 &&
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 300 }} aria-label="simple table">
                        <TableBody>
                            {maintenances.map((maintenance) => (
                                <TableRow
                                    key={maintenance.id}
                                >
                                    <TableCell component="th" scope="row">
                                        {maintenance.repairDate ? formatDate(maintenance.repairDate, false) : ''}
                                    </TableCell>
                                    <TableCell align="right">{maintenance.name}</TableCell>
                                    <TableCell align="right">
                                        <Button variant="outlined">Détails</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            }

            <Button sx={{mb: 3, mt: 2}} onClick={handleOpenModal}>
                <AddIcon />
                Ajouter une réparation
            </Button>

            <ModalAddMaintenance bike={bike} openModal={openModal} handleCloseModal={handleCloseModal} />
        </Box>
    )
}

export default BikeMaintenance;
