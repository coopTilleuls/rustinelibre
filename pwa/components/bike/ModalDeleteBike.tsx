import React, {useState} from 'react';
import router from 'next/router';
import {
  Button,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {bikeResource} from '@resources/bikeResource';
import CloseIcon from '@mui/icons-material/Close';
import {Bike} from '@interfaces/Bike';
import {errorRegex} from '@utils/errorRegex';

type ModalDeleteBikeProps = {
  bike: Bike;
  openModal: boolean;
  handleCloseModal: () => void;
};

const ModalDeleteBike = ({
  bike,
  openModal,
  handleCloseModal,
}: ModalDeleteBikeProps): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDelete = async () => {
    setErrorMessage(null);
    setLoading(true);
    try {
      await bikeResource.delete(bike!['@id']);
    } catch (e: any) {
      setErrorMessage(
        `Suppression du vélo impossible: ${e.message?.replace(
          errorRegex,
          '$2'
        )}, veuillez réessayer`
      );
    }
    router.push('/velos/mes-velos');
    setLoading(false);
  };

  return (
    <Dialog
      maxWidth="sm"
      fullWidth
      open={openModal}
      onClose={handleCloseModal}
      aria-labelledby="Ajouter un vélo"
      aria-describedby="popup_add_bike">
      <DialogTitle
        sx={{
          m: 0,
          p: 1,
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}>
        <IconButton
          aria-label="close"
          color="primary"
          onClick={handleCloseModal}>
          <CloseIcon fontSize="large" />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{pt: 0, pb: 4, borderTop: 'none'}}>
        <Typography variant="h5" gutterBottom>
          Êtes-vous sûr(e) de vouloir supprimer ce vélo ?
        </Typography>
        <Typography color="text.secondary">
          {`Vous êtes sur le point de supprimer "${
            bike?.name || 'votre vélo'
          }".`}
        </Typography>
      </DialogContent>
      <DialogActions sx={{p: 2}}>
        <Button variant="outlined" color="secondary" onClick={handleCloseModal}>
          Annuler
        </Button>
        <Button variant="contained" color="error" onClick={handleDelete}>
          {loading ? <CircularProgress sx={{color: 'white'}} /> : 'Valider'}
        </Button>
        {errorMessage && (
          <Typography color="error" textAlign="center" sx={{pt: 4}}>
            {errorMessage}
          </Typography>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ModalDeleteBike;
