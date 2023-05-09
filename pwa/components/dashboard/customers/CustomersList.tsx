import React, {ChangeEvent, useEffect, useState} from 'react';
import {
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
    CircularProgress, TextField,
} from '@mui/material';
import {customerResource} from "@resources/customerResource";
import Link from "next/link";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import {Customer} from "@interfaces/Customer";
import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment } from '@mui/material';

export const CustomersList = (): JSX.Element => {
    const [loadingList, setLoadingList] = useState<boolean>(false);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>('');

    const fetchCustomers = async () => {
        setLoadingList(true);
        let params = {
            page: `${currentPage ?? 1}`,
            itemsPerPage: 20,
            'order[id]': 'DESC'
        };

        if ('' !== searchTerm) {
            params = {...{userSearch: searchTerm}, ...params};
        }

        const response = await customerResource.getAll(true, params);
        setCustomers(response['hydra:member']);
        setTotalPages(Math.ceil(response['hydra:totalItems'] / 20))
        setLoadingList(false);
    };

    useEffect(() => {
        fetchCustomers();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect((): void => {
        fetchCustomers();
    }, [currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

    const handlePageChange = (event: ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    const handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter') {
            fetchCustomers();
        }
    };

    return (
        <Box>
            <TextField
                label="Chercher..."
                value={searchTerm}
                onChange={handleSearchTermChange}
                onKeyPress={handleKeyPress}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
            />

            <TableContainer elevation={4} component={Paper} sx={{marginTop: '10px'}}>
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
        </Box>
    );
};

export default CustomersList;
