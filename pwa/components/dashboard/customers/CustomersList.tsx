import React, {ChangeEvent, useEffect, useState} from 'react';
import {
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
    CircularProgress,
} from '@mui/material';
import {User} from '@interfaces/User';
import {customerResource} from "@resources/customerResource";
import Link from "next/link";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

export const CustomersList = (): JSX.Element => {
    const [loadingList, setLoadingList] = useState<boolean>(false);
    const [customers, setCustomers] = useState<User[]>([]);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const fetchCustomers = async () => {
        setLoadingList(true);
        let params = {
            page: `${currentPage ?? 1}`,
            itemsPerPage: 30,
        };
        const response = await customerResource.getAll(true, params);
        setCustomers(response['hydra:member']);
        setTotalPages(Math.ceil(response['hydra:totalItems'] / 30))
        setLoadingList(false);
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    useEffect((): void => {
        fetchCustomers();
    }, [currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

    const handlePageChange = (event: ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    return (
        <Box>
            <TableContainer elevation={4} component={Paper}>
                <Table aria-label="employees">
                    <TableHead
                        sx={{
                            '& th': {
                                fontWeight: 'bold',
                                color: 'primary.main',
                            },
                        }}>
                        <TableRow>
                            <TableCell align="left">Nom</TableCell>
                            <TableCell align="left">Prénom</TableCell>
                            <TableCell align="left">Email</TableCell>
                            <TableCell align="left"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loadingList && <CircularProgress />}
                        {customers.map((customer) => (
                            <TableRow
                                key={customer.id}
                                sx={{
                                    '&:last-child td, &:last-child th': {border: 0},
                                }}>
                                <TableCell align="left" component="th" scope="row">
                                    {customer.lastName}
                                </TableCell>
                                <TableCell align="left">{customer.firstName}</TableCell>
                                <TableCell align="left">{customer.email}</TableCell>
                                <TableCell
                                    align="left"
                                    sx={{cursor: 'pointer'}}
                                >
                                    <Link href={`/dashboard/clients/${customer.id}`}>
                                        <RemoveRedEyeIcon color="info" />
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {
                totalPages > 1 && <Stack spacing={2}>
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
        </Box>
    );
};

export default CustomersList;
