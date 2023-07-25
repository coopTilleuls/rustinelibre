import React, {useState} from 'react';
import {Bike} from '@interfaces/Bike';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from '@mui/material';
import {Maintenance} from '@interfaces/Maintenance';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import ModalAddMaintenance from '@components/bike/ModalAddMaintenance';
import {formatDate} from '@helpers/dateHelper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import {CardActionArea} from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';
import ModalDetailMaintenance from '@components/bike/ModalDetailMaintenance';
import {BikeType} from '@interfaces/BikeType';
import {bikeTypeResource} from '@resources/bikeTypeResource';
import {maintenanceResource} from '@resources/MaintenanceResource';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {Search} from '@mui/icons-material';

type BikeMaintenanceProps = {
  bike: Bike;
  maintenances: Maintenance[];
  loading: boolean;
  fetchMaintenance: () => Promise<void>;
};

const BikeMaintenance = ({
  bike,
  maintenances,
  loading,
  fetchMaintenance,
}: BikeMaintenanceProps): JSX.Element => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openModalDetail, setOpenModalDetail] = useState<boolean>(false);
  const [maintenanceSelected, setMaintenanceSelected] =
    useState<Maintenance | null>(null);
  const [selectedMaintenanceToDelete, setSelectedMaintenanceToDelete] =
    useState<Maintenance | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [removePending, setRemovePending] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDeleteClick = (maintenance: Maintenance) => {
    setDeleteDialogOpen(true);
    setSelectedMaintenanceToDelete(maintenance);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedMaintenanceToDelete) {
      return;
    }

    setErrorMessage(null);
    setRemovePending(true);
    setDeleteDialogOpen(false);

    try {
      await maintenanceResource.delete(selectedMaintenanceToDelete['@id']);
    } catch (e) {
      setErrorMessage('Suppression impossible');
    }

    setRemovePending(false);
    setSelectedMaintenanceToDelete(null);
    await fetchMaintenance();
  };

  const handleOpenModal = (): void => setOpenModal(true);
  const handleCloseModal = async (): Promise<void> => {
    setOpenModal(false);
    await fetchMaintenance();
  };

  const handleCloseModalDetail = async (refresh: boolean): Promise<void> => {
    setOpenModalDetail(false);
    if (refresh) {
      await fetchMaintenance();
    }
  };

  const clickMaintenanceDetail = (maintenance: Maintenance) => {
    setOpenModalDetail(true);
    setMaintenanceSelected(maintenance);
  };

  return (
    <Box width="100%" display="flex" flexDirection="column" alignItems="center">
      {loading && <CircularProgress />}

      {!loading && maintenances.length == 0 && (
        <Box py={3}>
          <Typography gutterBottom variant="h5" textAlign="center">
            <BuildIcon color="primary" />
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Vous n&apos;avez pas de réparations enregistrées pour le moment.
          </Typography>
        </Box>
      )}

      {!loading && maintenances.length > 0 && (
        <TableContainer>
          <Table sx={{minWidth: 300}} aria-label="simple table">
            <TableBody>
              {maintenances.map((maintenance) => (
                <TableRow key={maintenance.id}>
                  <TableCell align="left">
                    <Typography variant="body2" fontWeight={700}>
                      {maintenance.name}
                    </Typography>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {maintenance.repairDate
                      ? formatDate(maintenance.repairDate, false)
                      : ''}
                  </TableCell>
                  <TableCell align="right" width="120px">
                    <IconButton
                      color="secondary"
                      onClick={() => clickMaintenanceDetail(maintenance)}>
                      <Search />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(maintenance)}>
                      <DeleteForeverIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {errorMessage && (
        <Typography variant="body1" color="error">
          {errorMessage}
        </Typography>
      )}

      <Button
        sx={{my: 2, ml: 'auto', mr: 2, display: 'flex'}}
        onClick={handleOpenModal}
        variant="contained"
        startIcon={<AddIcon />}>
        Ajouter une réparation
      </Button>

      <ModalAddMaintenance
        bike={bike}
        openModal={openModal}
        handleCloseModal={handleCloseModal}
        maintenance={null}
      />

      <ModalDetailMaintenance
        maintenance={maintenanceSelected}
        openModal={openModalDetail}
        handleCloseModal={handleCloseModalDetail}
      />

      {selectedMaintenanceToDelete && (
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Confirmation</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {`Êtes-vous sûr de vouloir supprimer ${selectedMaintenanceToDelete.name}`}
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

export default BikeMaintenance;
