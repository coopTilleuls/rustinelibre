import React, {useState} from 'react';
import router from 'next/router';
import {Box, Button, Typography, Modal} from '@mui/material';
import {bikeResource} from '@resources/bikeResource';
import {Bike} from '@interfaces/Bike';

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
    } catch (e) {
      setErrorMessage('Suppression du vélo impossible, veuillez réessayer');
    }
    setLoading(false);
    router.push('/velos/mes-velos');
  };

  return (
    <Modal
      open={openModal}
      onClose={handleCloseModal}
      aria-labelledby="Ajouter un vélo"
      aria-describedby="popup_add_bike">
      <Box
        position={'absolute'}
        top={'50%'}
        left={'50%'}
        width={{xs: '85%', md: '40%'}}
        maxWidth={700}
        p={4}
        boxShadow={24}
        sx={{
          backgroundColor: 'background.paper',
          transform: 'translate(-50%, -50%)',
        }}>
        <Typography
          id="modal-modal-title"
          textAlign="center"
          fontSize={18}
          fontWeight={600}>
          Êtes-vous sûr(e) de vouloir supprimer ce vélo ?
        </Typography>
        <Box display="flex" justifyContent="space-evenly" px={{md: 4}} pt={4}>
          <Button variant="outlined" color="error" onClick={handleCloseModal}>
            Annuler
          </Button>
          <Button variant="contained" onClick={handleDelete}>
            Valider
          </Button>
        </Box>
        {errorMessage && (
          <Typography color="error" textAlign="center" sx={{pt: 4}}>
            {errorMessage}
          </Typography>
        )}
      </Box>
    </Modal>
  );
};

export default ModalDeleteBike;
