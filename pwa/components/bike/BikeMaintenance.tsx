import React, {useState} from "react";
import {Bike} from "@interfaces/Bike";
import Box from "@mui/material/Box";
import Button from '@mui/material/Button';
import AddIcon from "@mui/icons-material/Add";
import {CircularProgress} from "@mui/material";
import {Maintenance} from "@interfaces/Maintenance";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import ModalAddMaintenance from "@components/bike/ModalAddMaintenance";
import {formatDate} from "@helpers/dateHelper";

type BikeMaintenanceProps = {
    bike: Bike;
    maintenances: Maintenance[];
    loading: boolean;
    fetchMaintenance: () => Promise<void>;
};

const BikeMaintenance = ({bike, maintenances, loading, fetchMaintenance}: BikeMaintenanceProps): JSX.Element => {

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
