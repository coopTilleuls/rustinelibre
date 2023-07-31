import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import {repairerTypeResource} from '@resources/repairerTypeResource';
import ConfirmationModal from '@components/common/ConfirmationModal';
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
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {RepairerType} from '@interfaces/RepairerType';

export const ParametersRepairerTypes = (): JSX.Element => {
  const [loadingRepairerTypes, setLoadingRepairerTypes] =
    useState<boolean>(false);
  const [repairerTypes, setRepairerTypes] = useState<RepairerType[]>([]);
  const [selectedRepairerTypeToDelete, setSelectedRepairerTypeToDelete] =
    useState<RepairerType | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [removePending, setRemovePending] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchRepairerTypes();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDeleteClick = (repairerType: RepairerType) => {
    setDeleteDialogOpen(true);
    setSelectedRepairerTypeToDelete(repairerType);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedRepairerTypeToDelete) {
      return;
    }
    setRemovePending(true);
    try {
      await repairerTypeResource.delete(selectedRepairerTypeToDelete['@id']);
      setRemovePending(false);
      setSelectedRepairerTypeToDelete(null);
      await fetchRepairerTypes();
    } catch (e: any) {
      setErrorMessage(
        'Suppression impossible, ce type de réparateur est utilisé.'
      );
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
    setRemovePending(false);
  };

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
                    <IconButton
                      color="secondary"
                      onClick={() => handleDeleteClick(repairerType)}>
                      <DeleteForeverIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {selectedRepairerTypeToDelete && (
        <ConfirmationModal
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleDeleteConfirm}
          loading={removePending}
          errorMessage={
            errorMessage
          }>{`Êtes-vous sûr de vouloir supprimer le type "${selectedRepairerTypeToDelete.name}" ?`}</ConfirmationModal>
      )}
    </Box>
  );
};

export default ParametersRepairerTypes;
