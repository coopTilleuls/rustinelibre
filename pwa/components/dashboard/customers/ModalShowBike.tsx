import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {Bike} from '@interfaces/Bike';
import PedalBikeIcon from '@mui/icons-material/PedalBike';
import CopyrightIcon from '@mui/icons-material/Copyright';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import PersonIcon from '@mui/icons-material/Person';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '70%',
  maxHeight: '100%',
  overflow: 'scroll',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

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
    <Modal
      open={openModal}
      onClose={() => handleCloseModal()}
      aria-labelledby="Show bike"
      aria-describedby="popup_show_bike">
      <Box sx={style}>
        <Box sx={{mt: 1}}>
          {bike && (
            <Box>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <PedalBikeIcon />
                  </ListItemIcon>
                  <ListItemText primary={bike.name} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${bike.owner.firstName} ${bike.owner.lastName}`}
                  />
                </ListItem>
                {bike.brand && (
                  <ListItem>
                    <ListItemIcon>
                      <CopyrightIcon />
                    </ListItemIcon>
                    <ListItemText primary={bike.brand} />
                  </ListItem>
                )}
                {bike.bikeType && (
                  <ListItem>
                    <ListItemIcon>
                      <PedalBikeIcon />
                    </ListItemIcon>
                    <ListItemText primary={bike.bikeType.name} />
                  </ListItem>
                )}
                {bike.description && (
                  <ListItem>
                    <ListItemIcon>
                      <TextSnippetIcon />
                    </ListItemIcon>
                    <ListItemText primary={bike.description} />
                  </ListItem>
                )}

                {bike.picture && (
                  <img
                    width="300"
                    height="auto"
                    alt="photo du véo"
                    src={bike.picture.contentUrl}
                  />
                )}
                {bike.wheelPicture && (
                  <img
                    width="300"
                    height="auto"
                    alt="photo de la roue"
                    src={bike.wheelPicture.contentUrl}
                  />
                )}
                {bike.transmissionPicture && (
                  <img
                    width="300"
                    height="auto"
                    alt="photo de la transmission"
                    src={bike.transmissionPicture.contentUrl}
                  />
                )}
              </List>

              <Button
                variant="outlined"
                onClick={handleCloseModal}
                sx={{float: 'right'}}>
                Fermer
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalShowBike;
