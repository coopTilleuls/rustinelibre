import React from "react";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import {Maintenance} from "@interfaces/Maintenance";

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

type ModalDetailMaintenanceProps = {
    maintenance: Maintenance|null;
    openModal: boolean;
    handleCloseModal: () => void;
};

const ModalDetailMaintenance = ({maintenance, openModal, handleCloseModal}: ModalDetailMaintenanceProps): JSX.Element => {

    return (
        <Modal
            open={openModal}
            onClose={handleCloseModal}
            aria-labelledby="Détail de l'intervention"
            aria-describedby="maintenance_detail"
        >
            <Box sx={style}>
                TEST
            </Box>
        </Modal>
    )
}

export default ModalDetailMaintenance;
