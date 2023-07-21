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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import {bikeTypeResource} from '@resources/bikeTypeResource';
import {BikeType} from '@interfaces/BikeType';
import Link from 'next/link';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {Repairer} from '@interfaces/Repairer';
import {repairerResource} from '@resources/repairerResource';

export const ParametersBikeTypes = (): JSX.Element => {
  const [loadingBikeTypes, setLoadingBikeTypes] = useState<boolean>(false);
  const [selectedBikeToDelete, setSelectedBikeToDelete] =
    useState<BikeType | null>(null);
  const [bikeTypes, setBikeTypes] = useState<BikeType[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [removePending, setRemovePending] = useState<boolean>(false);

  const fetchBikeTypes = async () => {
    setLoadingBikeTypes(true);
    const bikeTypesFetch = await bikeTypeResource.getAll(true);
    setBikeTypes(bikeTypesFetch['hydra:member']);
    setLoadingBikeTypes(false);
  };

  useEffect(() => {
    fetchBikeTypes();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDeleteClick = (bikeType: BikeType) => {
    setDeleteDialogOpen(true);
    setSelectedBikeToDelete(bikeType);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedBikeToDelete) {
      return;
    }

    setRemovePending(true);
    setDeleteDialogOpen(false);
    try {
      await bikeTypeResource.delete(selectedBikeToDelete['@id']);
    } finally {
      setRemovePending(false);
      setSelectedBikeToDelete(null);
    }

    await fetchBikeTypes();
  };

  return (
    <Box>
      <Typography variant="h5">
        Types de vélo
        <Link href="/admin/parametres/type-de-velo/ajouter">
          <Button
            color="secondary"
            variant="contained"
            sx={{float: 'right'}}
            size="small"
            startIcon={<AddIcon />}>
            Ajouter un vélo
          </Button>
        </Link>
      </Typography>
      {loadingBikeTypes && <CircularProgress sx={{ml: 10, mt: 10}} />}
      {!loadingBikeTypes && (
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
              {bikeTypes.map((bikeType) => (
                <TableRow
                  key={bikeType.id}
                  sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                  <TableCell component="th" scope="row">
                    {bikeType.id}
                  </TableCell>
                  <TableCell align="left">{bikeType.name}</TableCell>
                  <TableCell align="right">
                    <Link
                      href={`/admin/parametres/type-de-velo/edit/${bikeType.id}`}
                      legacyBehavior
                      passHref>
                      <IconButton color="secondary">
                        <EditIcon color="secondary" />
                      </IconButton>
                    </Link>
                    <IconButton
                      color="secondary"
                      onClick={() => handleDeleteClick(bikeType)}>
                      <DeleteForeverIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {selectedBikeToDelete && (
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Confirmation</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {`Êtes-vous sûr de vouloir supprimer ${selectedBikeToDelete.name}`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleDeleteConfirm} color="secondary">
              Supprimer
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default ParametersBikeTypes;
