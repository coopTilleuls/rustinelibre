import React, {useState} from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import {Button, CircularProgress, Typography} from '@mui/material';

type ModalCancelAppointmentProps = {
  openModal: boolean;
  loading: boolean;
  handleCloseModal: () => void;
  handleCancelAppointment: () => void;
};

const ModalCancelAppointment = ({
  openModal,
  loading,
  handleCloseModal,
  handleCancelAppointment,
}: ModalCancelAppointmentProps): JSX.Element => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
        maxWidth={500}
        p={4}
        boxShadow={24}
        sx={{
          backgroundColor: 'background.paper',
          transform: 'translate(-50%, -50%)',
        }}>
        <Typography component="h2" fontWeight={600} textAlign="center">
          Etes-vous sûr(e) de vouloir annuler ce rendez-vous ?
        </Typography>
        <Box
          display="flex"
          justifyContent="space-between"
          pt={2}
          mx="auto"
          width={{xs: '100%', md: '50%'}}>
          <Button variant="outlined" onClick={handleCloseModal}>
            Non
          </Button>
          <Button variant="contained" onClick={handleCancelAppointment}>
            {loading ? <CircularProgress size={4} /> : 'Oui'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalCancelAppointment;
