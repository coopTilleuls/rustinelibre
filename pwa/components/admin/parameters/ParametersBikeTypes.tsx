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
import {bikeTypeResource} from "@resources/bikeTypeResource";
import {BikeType} from "@interfaces/BikeType";
import Link from "next/link";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export const ParametersBikeTypes = (): JSX.Element => {

    const [loadingBikeTypes, setLoadingBikeTypes] = useState<boolean>(false);
    const [bikeTypes, setBikeTypes] = useState<BikeType[]>([]);

    const fetchBikeTypes = async () => {
        setLoadingBikeTypes(true);
        const bikeTypesFetch = await bikeTypeResource.getAll(true);
        setBikeTypes(bikeTypesFetch['hydra:member']);
        setLoadingBikeTypes(false);
    };

    useEffect(() => {
        fetchBikeTypes();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Box>
            <Typography variant="h5">
                Types de vélo
                <Link href="/admin/parametres/type-de-velo/ajouter">
                    <Button variant="contained" sx={{float: 'right'}} size="small">
                        <AddIcon />
                        Ajouter un vélo
                    </Button>
                </Link>
            </Typography>
            {loadingBikeTypes && <CircularProgress sx={{ml: 10, mt: 10}} />}
            {!loadingBikeTypes && <TableContainer elevation={4} component={Paper} sx={{mt: 3}}>
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
                        {bikeTypes.map((bikeType) => (
                            <TableRow
                                key={bikeType.id}
                                sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                                <TableCell component="th" scope="row">
                                    {bikeType.id}
                                </TableCell>
                                <TableCell align="right">
                                    {bikeType.name}
                                </TableCell>
                                <TableCell align="right">
                                    <Link href={`/admin/parametres/type-de-velo/edit/${bikeType.id}`}>
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

export default ParametersBikeTypes;
