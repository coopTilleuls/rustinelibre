import React, {useEffect, useState} from 'react';
import {
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
    CircularProgress, Box, Typography, Button,
} from '@mui/material';
import AddIcon from "@mui/icons-material/Add";
import {RepairerType} from "@interfaces/RepairerType";
import Link from "next/link";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {repairerTypeResource} from "@resources/repairerTypeResource";

export const ParametersRepairerTypes = (): JSX.Element => {

    const [loadingRepairerTypes, setLoadingRepairerTypes] = useState<boolean>(false);
    const [repairerTypes, setRepairerTypes] = useState<RepairerType[]>([]);

    const fetchRepairerTypes = async () => {
        setLoadingRepairerTypes(true);
        const repairerTypeFetch = await repairerTypeResource.getAll(true);
        setRepairerTypes(repairerTypeFetch['hydra:member']);
        setLoadingRepairerTypes(false);
    };

    useEffect(() => {
        fetchRepairerTypes();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Box>
            <Typography variant="h5">
                Types de réparateurs
                <Link href="/admin/parametres/type-de-reparateur/ajouter">
                    <Button variant="contained" sx={{float: 'right'}} size="small">
                        <AddIcon />
                        Ajouter un type de réparateur
                    </Button>
                </Link>
            </Typography>
            {loadingRepairerTypes && <CircularProgress sx={{ml: 10, mt: 10}} />}
            {!loadingRepairerTypes && <TableContainer elevation={4} component={Paper} sx={{mt: 3}}>
                <Table aria-label="rdv">
                    <TableHead
                        sx={{
                            '& th': {
                                fontWeight: 'bold',
                                color: 'primary.main',
                            },
                        }}>
                        <TableRow>
                            <TableCell align="left">ID</TableCell>
                            <TableCell align="right">Nom</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {repairerTypes.map((repairerType) => (
                            <TableRow
                                key={repairerType.id}
                                sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                                <TableCell component="th" scope="row">
                                    {repairerType.id}
                                </TableCell>
                                <TableCell align="right">
                                    {repairerType.name}
                                </TableCell>
                                <TableCell align="right">
                                    <Link href={`/admin/parametres/type-de-reparateur/edit/${repairerType.id}`}>
                                        <EditIcon sx={{color: '#8c83ba', fontSize: '2em', cursor: 'pointer'}} />
                                    </Link>
                                    <DeleteIcon sx={{color: '#8c83ba', fontSize: '2em', cursor: 'pointer'}} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>}
        </Box>
    );
};

export default ParametersRepairerTypes;
