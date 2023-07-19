import React, {ChangeEvent, useState} from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import Button from '@mui/material/Button';
import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
} from '@mui/material';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import {BikeType} from '@interfaces/BikeType';
import {MediaObject} from '@interfaces/MediaObject';
import {uploadImage} from '@helpers/uploadFile';
import {mediaObjectResource} from '@resources/mediaObjectResource';
import {bikeResource} from '@resources/bikeResource';
import {RequestBody} from '@interfaces/Resource';
import useMediaQuery from '@hooks/useMediaQuery';
import {checkFileSize} from '@helpers/checkFileSize';
import {useTheme} from '@mui/material/styles';
import {errorRegex} from '@utils/errorRegex';

type ModalAddBikeProps = {
  bikeTypes: BikeType[];
  openModal: boolean;
  handleCloseModal: () => void;
  bikeTypeSelectedProps?: string | null;
};

const ModalAddBike = ({
  bikeTypes,
  openModal,
  handleCloseModal,
  bikeTypeSelectedProps = null,
}: ModalAddBikeProps): JSX.Element => {
  const [pendingAdd, setPendingAdd] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [selectedBike, setSelectedBike] = useState<BikeType | null>(null);
  const [loadingPhoto, setLoadingPhoto] = useState<boolean>(false);
  const [photo, setPhoto] = useState<MediaObject | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [imageTooHeavy, setImageTooHeavy] = useState<boolean>(false);

  const handleBikeChange = (event: SelectChangeEvent): void => {
    const selectedBikeType = bikeTypes.find(
      (bt) => bt.name === event.target.value
    );
    setSelectedBike(selectedBikeType ? selectedBikeType : null);
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    if (!name || (!selectedBike && !bikeTypeSelectedProps)) {
      return;
    }

    setErrorMessage(null);
    setPendingAdd(true);

    let newBike;
    try {
      let bodyRequest: RequestBody = {
        name: name,
      };
      if (bikeTypeSelectedProps) {
        bodyRequest['bikeType'] = bikeTypeSelectedProps;
      } else if (selectedBike) {
        bodyRequest['bikeType'] = selectedBike['@id'];
      }
      if (photo) {
        bodyRequest['picture'] = photo['@id'];
      }
      await bikeResource.post(bodyRequest);
      setPhoto(null);
      setName('');
      setSelectedBike(null);
      handleCloseModal();
    } catch (e: any) {
      setErrorMessage(
        `Ajout du vélo impossible: ${e.message?.replace(errorRegex, '$2')}`
      );
    }

    setPendingAdd(false);
  };

  const handleChangeName = (event: ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value);
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    if (photo) {
      await mediaObjectResource.delete(photo['@id']);
    }

    if (event.target.files) {
      setImageTooHeavy(false);
      const file = event.target.files[0];
      if (!checkFileSize(file)) {
        setImageTooHeavy(true);
        return;
      }

      setLoadingPhoto(true);
      const response = await uploadImage(file);
      const mediaObjectResponse = (await response?.json()) as MediaObject;
      if (mediaObjectResponse) {
        setPhoto(mediaObjectResponse);
        setLoadingPhoto(false);
      }
    }
  };

  return (
    <Dialog
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      open={openModal}
      onClose={handleCloseModal}
      aria-labelledby="Ajouter un vélo"
      aria-describedby="popup_add_bike">
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Typography id="modal-modal-title" variant="h3" color="primary">
          Ajouter un vélo
        </Typography>
        <IconButton
          aria-label="close"
          color="primary"
          onClick={handleCloseModal}>
          <CloseIcon fontSize="large" />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box
          display={'flex'}
          flexDirection={'column'}
          alignItems="flex-start"
          gap={1}
          component="form"
          id="add-bike-form"
          onSubmit={handleSubmit}
          sx={{mt: 1}}>
          <TextField
            required
            fullWidth
            id="name"
            label="Nom"
            name="name"
            autoComplete="name"
            autoFocus
            value={name}
            inputProps={{maxLength: 255}}
            onChange={handleChangeName}
          />
          {!bikeTypeSelectedProps && (
            <FormControl fullWidth required sx={{mt: 2, mb: 1}}>
              <InputLabel id="bike-type-label">Type de velo</InputLabel>
              <Select
                required
                id="bike-type"
                labelId="bike-type-label"
                label="Type de velo"
                onChange={handleBikeChange}
                value={selectedBike?.name}
                style={{width: '100%'}}>
                <MenuItem disabled value="">
                  Choisissez un type de vélo
                </MenuItem>
                {bikeTypes.map(({id, name}) => (
                  <MenuItem key={id} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          <Box
            display="flex"
            flexDirection="column"
            gap={1}
            my={2}
            alignItems="flex-start">
            {photo && (
              <Box
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: 6,
                  boxShadow: 4,
                }}>
                <img
                  height="auto"
                  src={photo.contentUrl}
                  alt="Photo du vélo"
                  style={{
                    display: 'block',
                    maxWidth: '300px',
                    width: '100%',
                  }}
                />
              </Box>
            )}
            <Button
              variant="outlined"
              size={photo ? 'small' : 'medium'}
              color="secondary"
              disabled={loadingPhoto}
              startIcon={
                loadingPhoto ? (
                  <CircularProgress size={18} color="secondary" />
                ) : (
                  <AddAPhotoIcon />
                )
              }
              component="label"
              sx={{mt: 2, mb: 2}}>
              {photo ? 'Changer de photo' : 'Ajouter une photo'}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => handleFileChange(e)}
              />
            </Button>
            {imageTooHeavy && (
              <Typography
                textAlign="center"
                color="error"
                variant="body2"
                gutterBottom>
                Votre photo dépasse la taille maximum autorisée (5mo)
              </Typography>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{p: 2}}>
        <Button
          type="submit"
          form="add-bike-form"
          variant="contained"
          size="large">
          {!pendingAdd ? (
            'Ajouter ce vélo'
          ) : (
            <CircularProgress size={20} sx={{color: 'white'}} />
          )}
        </Button>
        {errorMessage && (
          <Typography variant="body1" color="error">
            {errorMessage}
          </Typography>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ModalAddBike;
