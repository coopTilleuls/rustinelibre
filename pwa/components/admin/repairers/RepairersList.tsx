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
    TextField,
    Typography,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Dialog,
} from '@mui/material';
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment } from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import {Repairer} from "@interfaces/Repairer";
import {repairerResource} from "@resources/repairerResource";
import EditIcon from "@mui/icons-material/Edit";
import Link from "next/link";
import CircleIcon from '@mui/icons-material/Circle';
import {formatDate} from "@helpers/dateHelper";

export const RepairersList = (): JSX.Element => {
    const [loadingList, setLoadingList] = useState<boolean>(false);
    const [repairers, setRepairers] = useState<Repairer[]>([]);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
    const [removePending, setRemovePending] = useState<boolean>(false);
    const [selectedRepairerToDelete, setSelectedRepairerToDelete] = useState<Repairer|null>(null);

    const fetchRepairers = async () => {
        setLoadingList(true);
        let params = {
            page: `${currentPage ?? 1}`,
            itemsPerPage: 30,
            'order[id]': 'DESC'
        };

        if ('' !== searchTerm) {
            params = {...{name: searchTerm}, ...params};
            params.page = '1';
        }

        const response = await repairerResource.getAll(true, params);
        setRepairers(response['hydra:member']);
        setTotalPages(Math.ceil(response['hydra:totalItems'] / 30))
        setLoadingList(false);
    };

    useEffect(() => {
        fetchRepairers();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect((): void => {
        fetchRepairers();
    }, [currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleDeleteClick = (repairer: Repairer) => {
        setDeleteDialogOpen(true);
        setSelectedRepairerToDelete(repairer)
    };

    const handleDeleteConfirm = async () => {
        if (!selectedRepairerToDelete) {
            return;
        }

        setRemovePending(true);
        setDeleteDialogOpen(false);
        try {
            await repairerResource.delete(selectedRepairerToDelete['@id']);
        } finally {
            setRemovePending(false);
            setSelectedRepairerToDelete(null);
        }

        await fetchRepairers();
    };

    const handlePageChange = (event: ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    const handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter') {
            fetchRepairers();
        }
    };

    return (
        <Box>
            <TextField
                label="Chercher..."
                value={searchTerm}
                onChange={handleSearchTermChange}
                onKeyPress={handleKeyPress}
                inputProps={{ maxLength: 180 }}
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
                            <TableCell align="center">Statut</TableCell>
                            <TableCell align="center">Adresse</TableCell>
                            <TableCell align="center">Dernière connexion</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loadingList && <CircularProgress sx={{ml: 5, mt: 5}} />}
                        {repairers.map((repairer) => (
                            <TableRow
                                key={repairer.id}
                                sx={{
                                    '&:last-child td, &:last-child th': {border: 0},
                                }}>
                                <TableCell align="left" component="th" scope="row">
                                    {repairer.name}
                                    <br />
                                    {repairer.owner && <Typography sx={{color: 'grey'}}>
                                        {repairer.owner.email}
                                    </Typography>}
                                </TableCell>
                                <TableCell align="center">
                                    {repairer.enabled && <span style={{color: '#027f00', backgroundColor: '#cdffcd', padding: '10px', borderRadius: '10px'}}>
                                        <CircleIcon sx={{fontSize: '0.8em'}} /> Actif
                                    </span>}

                                    {!repairer.enabled && <span style={{color: '#a36f1a', backgroundColor: '#ffeccb', padding: '10px', borderRadius: '10px'}}>
                                        <CircleIcon sx={{fontSize: '0.8em'}} /> En attente
                                    </span>}
                                </TableCell>
                                <TableCell align="center">
                                    {`${repairer.street}, ${repairer.postcode} ${repairer.city}`}
                                </TableCell>
                                <TableCell align="center">
                                    {repairer.owner.lastConnect && formatDate(repairer.owner.lastConnect)}
                                </TableCell>
                                <TableCell align="right">
                                    <Link href={`/admin/reparateurs/edit/${repairer.id}`}>
                                        <EditIcon sx={{color: '#8c83ba', fontSize: '2em', cursor: 'pointer'}} />
                                    </Link>
                                    <DeleteIcon onClick={() => handleDeleteClick(repairer)} sx={{color: '#8c83ba', fontSize: '2em', cursor: 'pointer'}} />
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

            {
                selectedRepairerToDelete && <Dialog
                    open={deleteDialogOpen}
                    onClose={() => setDeleteDialogOpen(false)}>
                    <DialogTitle>Confirmation</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {`Êtes-vous sûr de vouloir supprimer ${selectedRepairerToDelete.name}`}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
                        <Button onClick={handleDeleteConfirm} color="secondary">
                            Supprimer
                        </Button>
                    </DialogActions>
                </Dialog>
            }
        </Box>
    );
};

export default RepairersList;
