import React, {useState} from 'react';
import Link from 'next/link';
import {repairerEmployeesResource} from '@resources/repairerEmployeesResource';
import ConfirmationModal from '@components/common/ConfirmationModal';
import {CircularProgress, IconButton} from '@mui/material';
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

  const handleDeleteConfirm = async () => {
    setRemovePending(true);
    try {
      await repairerEmployeesResource.delete(employee['@id']);
      setDeleteDialogOpen(false);
      await fetchEmployees();
    } catch (e) {}
    setRemovePending(false);
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
          <IconButton
            onClick={() => setDeleteDialogOpen(true)}
            color="secondary">
            <DeleteForeverIcon />
          </IconButton>
        </>
      )}
      <ConfirmationModal
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}>
        {`Êtes-vous sûr de vouloir supprimer l'employé(e) "${employee.employee.firstName} ${employee.employee.lastName}" ?`}
      </ConfirmationModal>
    </>
  );
};

export default EmployeesListActions;
