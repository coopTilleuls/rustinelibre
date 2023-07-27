import React from 'react';
import {
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PedalBikeIcon from '@mui/icons-material/PedalBike';
import CopyrightIcon from '@mui/icons-material/Copyright';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import PersonIcon from '@mui/icons-material/Person';
import {Bike} from '@interfaces/Bike';

type ModalShowBikeProps = {
  bike: Bike | null;
  openModal: boolean;
  handleCloseModal: () => void;
};

const ModalShowBike = ({
  bike,
  openModal,
  handleCloseModal,
}: ModalShowBikeProps): JSX.Element => {
  return (
    <Dialog
      maxWidth="sm"
      fullWidth
      open={openModal}
      onClose={() => handleCloseModal()}
      aria-labelledby="Affiche le vélo d'un utilisateur"
      aria-describedby="popup_show_bike">
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Typography
          id="modal-modal-title"
          variant="h3"
          color="primary"
          textTransform="capitalize">
          {bike?.name}
        </Typography>
        <IconButton
          aria-label="close"
          color="primary"
          onClick={handleCloseModal}>
          <CloseIcon fontSize="large" />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <List>
          <ListItem>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText
              primary={`${bike?.owner.firstName} ${bike?.owner.lastName}`}
            />
          </ListItem>
          {bike?.brand && (
            <ListItem>
              <ListItemIcon>
                <CopyrightIcon />
              </ListItemIcon>
              <ListItemText primary={bike?.brand} />
            </ListItem>
          )}
          {bike?.bikeType && (
            <ListItem>
              <ListItemIcon>
                <PedalBikeIcon />
              </ListItemIcon>
              <ListItemText primary={bike?.bikeType.name} />
            </ListItem>
          )}
          {bike?.description && (
            <ListItem>
              <ListItemIcon>
                <TextSnippetIcon />
              </ListItemIcon>
              <ListItemText primary={bike?.description} />
            </ListItem>
          )}
          {bike?.picture && (
            <img
              width="300"
              height="auto"
              alt="photo du véo"
              src={bike?.picture.contentUrl}
            />
          )}
          {bike?.wheelPicture && (
            <img
              width="300"
              height="auto"
              alt="photo de la roue"
              src={bike?.wheelPicture.contentUrl}
            />
          )}
          {bike?.transmissionPicture && (
            <img
              width="300"
              height="auto"
              alt="photo de la transmission"
              src={bike?.transmissionPicture.contentUrl}
            />
          )}
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default ModalShowBike;
