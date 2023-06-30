import React, {useState} from "react";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import {Maintenance} from "@interfaces/Maintenance";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import ReceiptIcon from '@mui/icons-material/Receipt';
import {formatDate} from "@helpers/dateHelper";
import EventIcon from '@mui/icons-material/Event';
import ModeIcon from '@mui/icons-material/Mode';
import {Button} from "@mui/material";
import ModalAddMaintenance from "@components/bike/ModalAddMaintenance";

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

type ModalDetailMaintenanceProps = {
    maintenance: Maintenance|null;
    openModal: boolean;
    handleCloseModal: (refresh : boolean) => void;
};

const ModalDetailMaintenance = ({maintenance, openModal, handleCloseModal}: ModalDetailMaintenanceProps): JSX.Element => {

    const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);

    const handleCloseModalEdit = () => {
        setOpenModalEdit(false);
        handleCloseModal(true);
    }

    return (
        <Box>
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="Détail de l'intervention"
                aria-describedby="maintenance_detail"
            >
                <Box sx={style}>
                    {
                        maintenance && <List>
                            <ListItem key="bike">
                                <ListItemIcon>
                                    <DirectionsBikeIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary={maintenance.bike.name}
                                />
                            </ListItem>
                            <ListItem key="name">
                                <ListItemIcon>
                                    <ReceiptIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary={maintenance.name}
                                />
                            </ListItem>
                            <ListItem key="date">
                                <ListItemIcon>
                                    <EventIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary={formatDate(maintenance.repairDate, false)}
                                />
                            </ListItem>
                            {maintenance.description &&
                                <ListItem key="description">
                                    <ListItemIcon>
                                        <ModeIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={maintenance.description}
                                    />
                                </ListItem>}
                        </List>
                    }
                    {maintenance && maintenance.photo && <img width="400" height="auto" alt="Image de la réparation" src={maintenance.photo.contentUrl} />}

                    <Box>
                        <Button variant="contained" onClick={() => setOpenModalEdit(true)} sx={{mt: 2}}>
                            Modifier
                        </Button>
                        <Button variant="outlined" onClick={() => handleCloseModal(false)} sx={{mt: 2, float: 'right'}}>
                            Fermer
                        </Button>
                    </Box>
                </Box>
            </Modal>

            {maintenance &&
                <ModalAddMaintenance
                    bike={maintenance.bike}
                    openModal={openModalEdit}
                    handleCloseModal={handleCloseModalEdit}
                    maintenance={maintenance}
                />
            }
        </Box>
    )
}

export default ModalDetailMaintenance;
