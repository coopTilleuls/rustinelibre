import React, {useState} from "react";
import {RepairerEmployee} from "@interfaces/RepairerEmployee";
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Link from "next/link";
import {CircularProgress, Dialog} from "@mui/material";
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from "@mui/material/Button";
import {repairerEmployeesResource} from "@resources/repairerEmployeesResource";

interface EmployeesListActionsProps {
    employee: RepairerEmployee;
    fetchEmployees: () => Promise<void>;
}

export const EmployeesListActions = ({employee, fetchEmployees}: EmployeesListActionsProps): JSX.Element => {

    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
    const [removePending, setRemovePending] = useState<boolean>(false);

    const handleDeleteClick = () => {
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        setRemovePending(true)
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
            {
                removePending ? <CircularProgress /> : <>
                    <Link href={'/dashboard/employes/edit/'+employee.id} style={{color: 'black'}}>
                        <EditIcon />
                    </Link>
                <DeleteForeverIcon onClick={() => handleDeleteClick()} style={{cursor: 'pointer'}} /></>
            }

            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Confirmation</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Êtes-vous sûr de vouloir supprimer {employee.employee.firstName+' '+employee.employee.lastName} ?
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
