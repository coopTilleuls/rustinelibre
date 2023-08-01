import React, {ChangeEvent, useEffect, useState} from 'react';
import Link from 'next/link';
import {interventionResource} from '@resources/interventionResource';
import ConfirmationModal from '@components/common/ConfirmationModal';
import {
  Box,
  Pagination,
  Stack,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  CircularProgress,
  Typography,
  Button,
  IconButton,
} from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import {Intervention} from '@interfaces/Intervention';

export const InterventionsList = (): JSX.Element => {
  const [loadingList, setLoadingList] = useState<boolean>(false);
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [removePending, setRemovePending] = useState<boolean>(false);
  const [selectedInterventionToDelete, setSelectedInterventionToDelete] =
    useState<Intervention | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchInterventions = async () => {
    setLoadingList(true);
    let params = {
      page: `${currentPage ?? 1}`,
      itemsPerPage: 20,
      'order[id]': 'DESC',
      isAdmin: 'true',
    };

    const response = await interventionResource.getAll(true, params);
    setInterventions(response['hydra:member']);
    setTotalPages(Math.ceil(response['hydra:totalItems'] / 20));
    setLoadingList(false);
  };

  useEffect(() => {
    fetchInterventions();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect((): void => {
    fetchInterventions();
  }, [currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDeleteClick = (intervention: Intervention) => {
    setDeleteDialogOpen(true);
    setSelectedInterventionToDelete(intervention);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedInterventionToDelete) {
      return;
    }
    setRemovePending(true);
    setDeleteDialogOpen(false);
    try {
      await interventionResource.delete(selectedInterventionToDelete['@id']);
      setRemovePending(false);
      setSelectedInterventionToDelete(null);
      await fetchInterventions();
    } catch (e: any) {
      setErrorMessage(
        'Suppression impossible, ce type dintervention est utilisé.'
      );
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
    setRemovePending(false);
  };

  const handlePageChange = (event: ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  return (
    <Box>
      <Typography variant="h5" mb={4}>
        Prestations proposées
        <Link href="/admin/parametres/interventions/ajouter">
          <Button
            variant="contained"
            color="secondary"
            sx={{float: 'right'}}
            size="small"
            startIcon={<AddIcon />}>
            Ajouter une intervention
          </Button>
        </Link>
      </Typography>
      <TableContainer elevation={4} component={Paper} sx={{marginTop: '10px'}}>
        <Table aria-label="interventions">
          <TableHead
            sx={{
              '& th': {
                fontWeight: 'bold',
                color: 'primary.main',
              },
            }}>
            <TableRow>
              <TableCell align="left">ID</TableCell>
              <TableCell align="left">Description</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loadingList && <CircularProgress sx={{ml: 5, mt: 5}} />}
            {interventions.map((intervention) => (
              <TableRow
                key={intervention.id}
                sx={{
                  '&:last-child td, &:last-child th': {border: 0},
                }}>
                <TableCell align="left" component="th" scope="row">
                  {intervention.id}
                </TableCell>
                <TableCell align="left" component="th" scope="row">
                  {intervention.description}
                </TableCell>
                <TableCell align="right">
                  <Link
                    href={`/admin/parametres/interventions/edit/${intervention.id}`}
                    legacyBehavior
                    passHref>
                    <IconButton color="secondary">
                      <EditIcon color="secondary" />
                    </IconButton>
                  </Link>
                  <IconButton
                    color="secondary"
                    onClick={() => handleDeleteClick(intervention)}>
                    <DeleteForeverIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {totalPages > 1 && (
        <Stack spacing={2} sx={{marginTop: '20px'}}>
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
      )}
      {selectedInterventionToDelete && (
        <ConfirmationModal
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleDeleteConfirm}
          loading={removePending}
          errorMessage={
            errorMessage
          }>{`Êtes-vous sûr de vouloir supprimer la prestation "${selectedInterventionToDelete.description}" ?`}</ConfirmationModal>
      )}
    </Box>
  );
};

export default InterventionsList;
