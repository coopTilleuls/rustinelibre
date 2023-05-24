import React, {ChangeEvent, useState} from 'react';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {CircularProgress, FormControl, InputLabel} from '@mui/material';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import {BikeType} from '@interfaces/BikeType';
import {MediaObject} from '@interfaces/MediaObject';
import {uploadFile} from '@helpers/uploadFile';
import {apiImageUrl} from '@helpers/apiImagesHelper';
import {mediaObjectResource} from '@resources/mediaObjectResource';
import {bikeResource} from '@resources/bikeResource';
import {RequestBody} from '@interfaces/Resource';
import useMediaQuery from '@hooks/useMediaQuery';
import {checkFileSize} from "@helpers/checkFileSize";

type ModalAddBikeProps = {
  bikeTypes: BikeType[];
  openModal: boolean;
  handleCloseModal: () => void;
  bikeTypeSelectedProps?: string|null
};

const ModalAddBike = ({
  bikeTypes,
  openModal,
  handleCloseModal,
  bikeTypeSelectedProps = null
}: ModalAddBikeProps): JSX.Element => {
  const [pendingAdd, setPendingAdd] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [selectedBike, setSelectedBike] = useState<BikeType | null>(null);
  const [loadingPhoto, setLoadingPhoto] = useState<boolean>(false);
  const [photo, setPhoto] = useState<MediaObject | null>(null);
  const isMobile = useMediaQuery('(max-width: 640px)');
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
    } catch (e) {
      setErrorMessage('Ajout du vélo impossible');
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
      const response = await uploadFile(file);
      const mediaObjectResponse = (await response?.json()) as MediaObject;
      if (mediaObjectResponse) {
        setPhoto(mediaObjectResponse);
        setLoadingPhoto(false);
      }
    }
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
        <Typography id="modal-modal-title" fontSize={20} fontWeight={600}>
          Ajouter un vélo
        </Typography>
        {photo && (
          <img
            width={isMobile ? '80%' : '300'}
            height="auto"
            src={apiImageUrl(photo.contentUrl)}
            alt="Photo du vélo"
            style={{marginLeft: isMobile ? '10%' : '300'}}
          />
        )}
        <Box
          display={'flex'}
          flexDirection={'column'}
          alignItems={'center'}
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{mt: 1}}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Nom"
            name="name"
            autoComplete="name"
            autoFocus
            value={name}
            onChange={handleChangeName}
          />
          {!bikeTypeSelectedProps &&
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
          }

          <Button variant="outlined" component="label" sx={{mt: 2, mb: 2}}>
            {loadingPhoto ? (
              <CircularProgress color={"primary"} />
            ) : photo ? (
              'Changer de photo'
            ) : (
              'Ajouter une photo'
            )}
            <input type="file" hidden onChange={(e) => handleFileChange(e)} />
          </Button>
          {imageTooHeavy && <Typography sx={{textAlign: 'center', color: 'red'}}>
            Votre photo dépasse la taille maximum autorisée (5mo)
          </Typography>}
          <Button type="submit" variant="contained">
            {!pendingAdd ? 'Ajouter ce vélo' : <CircularProgress size={20} sx={{color: 'white'}} />}
          </Button>
          {errorMessage && (
            <Typography variant="body1" color="error">
              {errorMessage}
            </Typography>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalAddBike;
