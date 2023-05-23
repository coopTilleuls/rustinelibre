import React, {ChangeEvent, useEffect, useState} from 'react';
import {
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
    CircularProgress, Button,
} from '@mui/material';
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import {Customer} from "@interfaces/Customer";
import {formatDate} from 'helpers/dateHelper';
import {Bike} from "@interfaces/Bike";
import {bikeResource} from "@resources/bikeResource";
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import Link from "next/link";
import ModalShowBike from "@components/dashboard/customers/ModalShowBike";

interface CustomerBikesListProps {
    customer: Customer
}

export const CustomerBikesList =  ({customer}: CustomerBikesListProps): JSX.Element => {
    const [loadingList, setLoadingList] = useState<boolean>(false);
    const [bikes, setBikes] = useState<Bike[]>([]);
    const [bikeSelected, setBikeSelected] = useState<Bike|null>(null);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [openModal, setOpenModal] = React.useState(false);
    const handleCloseModal = (): void => {setOpenModal(false);};

    const fetchBikes = async () => {
        setLoadingList(true);
        let params = {
            page: `${currentPage ?? 1}`,
            'order[id]': 'DESC',
            owner: customer.id
        };
        const response = await bikeResource.getAll(true, params);
        setBikes(response['hydra:member']);
        setTotalPages(Math.ceil(response['hydra:totalItems'] / 20))
        setLoadingList(false);
    };

    useEffect(() => {
        fetchBikes();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect((): void => {
        fetchBikes();
    }, [currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

    const handlePageChange = (event: ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    const handleClickBikeDetail = (bike: Bike) => {
        setBikeSelected(bike);
        setOpenModal(true);
    };

    return (
        <Box>
            <TableContainer elevation={4} component={Paper} sx={{width: '100%'}}>
                <Table aria-label="employees">
                    <TableHead
                        sx={{
                            '& th': {
                                fontWeight: 'bold',
                                color: 'primary.main',
                            },
                        }}>
                        <TableRow>
                            <TableCell align="left">Vélo</TableCell>
                            <TableCell align="left">Date d&apos;ajout</TableCell>
                            <TableCell align="left"></TableCell>
                            <TableCell align="left"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loadingList && <CircularProgress />}
                        {bikes.map((bike) => (
                            <TableRow
                                key={bike.id}
                                sx={{
                                    '&:last-child td, &:last-child th': {border: 0},
                                }}>
                                <TableCell align="left" component="th" scope="row">
                                    {bike.name}
                                </TableCell>
                                <TableCell align="left">
                                    {bike.createdAt !== undefined ? formatDate(bike.createdAt, false) : 'Non renseignée'}
                                </TableCell>
                                <TableCell align="left">
                                    <Button variant="outlined" startIcon={<RemoveRedEyeIcon />} onClick={() => handleClickBikeDetail(bike)}>
                                        Voir
                                    </Button>
                                </TableCell>
                                <TableCell
                                    align="left"
                                    sx={{cursor: 'pointer'}}
                                >
                                    <Link href={`/dashboard/clients/velos/${bike.id}`}>
                                        <Button variant="outlined" startIcon={<FormatListBulletedIcon />}>
                                            Carnet d&apos;entretien
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {
                totalPages > 1 && <Stack spacing={2} sx={{marginTop: '20px'}}>
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                        showFirstButton
                        showLastButton
                        size="large"
                    />
                </Stack>
            }

            <ModalShowBike
                bike={bikeSelected}
                openModal={openModal}
                handleCloseModal={handleCloseModal}
            />
        </Box>
    );
};

export default CustomerBikesList;
