import React, {useState} from 'react';
import Link from 'next/link';
import {repairerEmployeesResource} from '@resources/repairerEmployeesResource';
import {
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForeverSharp';
import {RepairerEmployee} from '@interfaces/RepairerEmployee';

interface EmployeesListActionsProps {
  employee: RepairerEmployee;
  fetchEmployees: () => Promise<void>;
}

export const EmployeesListActions = ({
  employee,
  fetchEmployees,
}: EmployeesListActionsProps): JSX.Element => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [removePending, setRemovePending] = useState<boolean>(false);

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setRemovePending(true);
    setDeleteDialogOpen(false);
    try {
      await repairerEmployeesResource.delete(employee['@id']);
    } finally {
      setRemovePending(false);
    }

    await fetchEmployees();
  };

  return (
    <>
      {removePending ? (
        <CircularProgress />
      ) : (
        <>
          <Link
            href={`/sradmin/employes/edit/${employee.id}`}
            legacyBehavior
            passHref>
            <IconButton color="secondary">
              <EditIcon color="secondary" />
            </IconButton>
          </Link>
          <IconButton onClick={() => handleDeleteClick()} color="secondary">
            <DeleteForeverIcon />
          </IconButton>
        </>
      )}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer{' '}
            {employee.employee.firstName + ' ' + employee.employee.lastName} ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleDeleteConfirm} color="secondary">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EmployeesListActions;
