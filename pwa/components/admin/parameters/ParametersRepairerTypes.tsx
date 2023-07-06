import React, {useEffect, useState} from 'react';
import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  CircularProgress,
  Box,
  Typography,
  Button,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import {RepairerType} from '@interfaces/RepairerType';
import Link from 'next/link';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {repairerTypeResource} from '@resources/repairerTypeResource';

export const ParametersRepairerTypes = (): JSX.Element => {
  const [loadingRepairerTypes, setLoadingRepairerTypes] =
    useState<boolean>(false);
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
          <Button
            variant="contained"
            color="secondary"
            sx={{float: 'right'}}
            size="small"
            startIcon={<AddIcon />}>
            Ajouter un type de réparateur
          </Button>
        </Link>
      </Typography>
      {loadingRepairerTypes && <CircularProgress sx={{ml: 10, mt: 10}} />}
      {!loadingRepairerTypes && (
        <TableContainer elevation={4} component={Paper} sx={{mt: 3}}>
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
                <TableCell align="left">Nom</TableCell>
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
                  <TableCell align="left">{repairerType.name}</TableCell>
                  <TableCell align="right">
                    <Link
                      href={`/admin/parametres/type-de-reparateur/edit/${repairerType.id}`}
                      legacyBehavior
                      passHref>
                      <IconButton color="secondary">
                        <EditIcon color="secondary" />
                      </IconButton>
                    </Link>
                    <IconButton color="secondary">
                      <DeleteForeverIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default ParametersRepairerTypes;
