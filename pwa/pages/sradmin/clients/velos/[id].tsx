import {NextPageWithLayout} from 'pages/_app';
import React, {useState, useEffect} from 'react';
import Head from 'next/head';
import DashboardLayout from '@components/dashboard/DashboardLayout';
import Box from '@mui/material/Box';
import {useRouter} from 'next/router';
import {CircularProgress} from '@mui/material';
import {bikeResource} from "@resources/bikeResource";
import {Bike} from "@interfaces/Bike";
import {Maintenance} from "@interfaces/Maintenance";
import {maintenanceResource} from "@resources/MaintenanceResource";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import {formatDate} from "@helpers/dateHelper";
import Button from "@mui/material/Button";
import TableContainer from "@mui/material/TableContainer";
import ModalDetailMaintenance from "@components/bike/ModalDetailMaintenance";
import ModalAddMaintenance from "@components/bike/ModalAddMaintenance";
import Link from "next/link";

const CustomerBikes: NextPageWithLayout = () => {
    const router = useRouter();
    const {id} = router.query;
    const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
    const [bike, setBike] = useState<Bike | null>(null);
    const [maintenanceSelected, setMaintenanceSelected] = useState<Maintenance | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openModalAddMaintenance, setOpenModalAddMaintenance] = useState<boolean>(false);

    const handleOpenModal = (maintenance: Maintenance): void => {
        setMaintenanceSelected(maintenance);
        setOpenModal(true)
    };
    const handleCloseModal = async (refresh: boolean = false): Promise<void> => {
        setOpenModal(false)
        if (refresh && bike) {
            await fetchMaintenances(bike.id);
        }
    };

    const handleCloseModalAddMaintenance = async (): Promise<void> => {
        setOpenModalAddMaintenance(false);
        if (bike) {
            await fetchMaintenances(bike.id);
        }
    };

    const fetchMaintenances = async(bikeId: string) => {
        setLoading(true);
        const maintenancesFetch = await maintenanceResource.getAll(true,{
            'bike': bikeId,
            'order[repairDate]': 'DESC'
        });
        setMaintenances(maintenancesFetch['hydra:member']);
        setLoading(false);
    }

    useEffect(() => {
         const fetchBike = async (): Promise<void> => {
            if (typeof id === 'string' && id.length > 0) {
                setLoading(true);
                const bikeFetch: Bike = await bikeResource.getById(id);
                setBike(bikeFetch);
                setLoading(false);
                await fetchMaintenances(bikeFetch.id);
            }
        }

        if (id) {
            fetchBike();
        }
    }, [id]);

    return (
        <>
            <Head>
                <title>Carnet d&#39;entretien</title>
            </Head>
            <DashboardLayout />
            <Box
                component="main"
                sx={{marginLeft: '20%', marginRight: '5%', marginTop: '10px'}}>

                {loading && <CircularProgress />}
                {!loading && bike &&
                    <h3>
                        Carnet d&#39;entretien : <u>{bike.name}</u> <Link href={`/sradmin/clients/${bike.owner.id}`}>({bike.owner.firstName} {bike.owner.lastName})</Link>

                        <Button variant="outlined" onClick={() => setOpenModalAddMaintenance(true)} sx={{float: 'right'}}>
                            Ajouter une entrée au carnet d&#39;entretien
                        </Button>
                    </h3>}
                {!loading && bike && maintenances.length > 0 &&
                    <TableContainer component={Paper}>
                        <Table sx={{minWidth: 300}} aria-label="simple table">
                            <TableBody>
                                {maintenances.map((maintenance) => (
                                    <TableRow key={maintenance.id}>
                                        <TableCell component="th" scope="row">
                                            {maintenance.repairDate
                                                ? formatDate(maintenance.repairDate, false)
                                                : ''}
                                        </TableCell>
                                        <TableCell align="right">{maintenance.name}</TableCell>
                                        <TableCell align="right">
                                            <Button variant="outlined" onClick={() => handleOpenModal(maintenance)}>Détails</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                }
                {!loading && maintenances.length === 0 &&
                    <Box sx={{mt: 10}}>
                        Le carnet d&#39;entretien est vide
                    </Box>
                }
            </Box>

            <ModalDetailMaintenance
                maintenance={maintenanceSelected}
                openModal={openModal}
                handleCloseModal={handleCloseModal}
            />

            {bike &&
                <ModalAddMaintenance
                    bike={bike}
                    openModal={openModalAddMaintenance}
                    handleCloseModal={handleCloseModalAddMaintenance}
                    maintenance={null}
                />
            }
        </>
    );
};

export default CustomerBikes;
