import React, {ChangeEvent, useState} from 'react';
import {bikeResource} from '@resources/bikeResource';
import {
  Box,
  Button,
  Alert,
  CircularProgress,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
  Typography,
} from '@mui/material';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import SaveIcon from '@mui/icons-material/Save';
import BikeIdentityPhoto from '@components/bike/BikeIdentityPhoto';
import {Bike} from '@interfaces/Bike';
import {RequestBody} from '@interfaces/Resource';
import {BikeType} from '@interfaces/BikeType';
import {errorRegex} from '@utils/errorRegex';
import Grid2 from '@mui/material/Unstable_Grid2';

type BikeIdentityProps = {
  bike: Bike;
  setBike: (bike: Bike) => void;
  bikeTypes: BikeType[];
};

const BikeIdentity = ({
  bike,
  setBike,
  bikeTypes,
}: BikeIdentityProps): JSX.Element => {
  const [brand, setBrand] = useState<string>(bike.brand ? bike.brand : '');
  const [description, setDescription] = useState<string>(
    bike.description ? bike.description : ''
  );
  const [pendingUpdate, setPendingUpdate] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(bike.name ? bike.name : '');
  const [selectedBike, setSelectedBike] = useState<BikeType | null>(
    bike.bikeType ? bike.bikeType : null
  );
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);

  const handleBikeChange = (event: SelectChangeEvent): void => {
    const selectedBikeType = bikeTypes.find(
      (bt) => bt.name === event.target.value
    );
    setSelectedBike(selectedBikeType ? selectedBikeType : null);
  };

  const handleChangeName = (event: ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value);
  };

  const handleChangeBrand = (event: ChangeEvent<HTMLInputElement>): void => {
    setBrand(event.target.value);
  };

  const handleChangeDescription = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setDescription(event.target.value);
  };

  const handleSubmit = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): Promise<void> => {
    event.preventDefault();
    if (!name || !selectedBike) {
      return;
    }

    setErrorMessage(null);
    setPendingUpdate(true);

    try {
      let bodyRequest: RequestBody = {
        name: name,
        selectedBike: selectedBike['@id'],
      };
      if (brand) {
        bodyRequest['brand'] = brand;
      }
      if (description) {
        bodyRequest['description'] = description;
      }

      bike = await bikeResource.put(bike['@id'], bodyRequest);
      setBike(bike);
    } catch (e: any) {
      setErrorMessage(
        `Mise à jour du vélo impossible:${e.message?.replace(errorRegex, '$2')}`
      );
    }

    if (bike) {
      setUpdateSuccess(true);
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
    }
    setPendingUpdate(false);
  };

  return (
    <>
      <Box width="100%" px={4} py={2}>
        <Typography variant="h5" gutterBottom>
          Détails
        </Typography>
        {updateSuccess && <Alert severity="success">Vélo mis à jour</Alert>}
        {errorMessage && (
          <Alert severity="error" onClose={() => setErrorMessage(null)}>
            {errorMessage}
          </Alert>
        )}
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
          inputProps={{maxLength: 255}}
          onChange={handleChangeName}
        />
        <Grid2 container spacing={2}>
          <Grid2 xs={12} md={6}>
            <FormControl fullWidth required sx={{mt: 2, mb: 1}}>
              <InputLabel id="bike-type-label">Type de vélo</InputLabel>
              <Select
                label="Type de vélo"
                required
                id="bike-type"
                labelId="bike-type-label"
                onChange={handleBikeChange}
                value={selectedBike?.name}
                style={{width: '100%'}}>
                <MenuItem disabled value="">
                  Choisissez un type de vélo
                </MenuItem>
                {bikeTypes.map((bike) => (
                  <MenuItem key={bike.id} value={bike.name}>
                    {bike.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid2>
          <Grid2 xs={12} md={6}>
            <TextField
              margin="normal"
              fullWidth
              id="brand"
              label="Marque"
              name="name"
              autoComplete="brand"
              value={brand}
              inputProps={{maxLength: 255}}
              onChange={handleChangeBrand}
            />
          </Grid2>
        </Grid2>
        <TextField
          margin="normal"
          placeholder="Description de votre vélo"
          multiline
          label="Description"
          fullWidth
          value={description}
          minRows={1}
          maxRows={6}
          inputProps={{maxLength: 2000}}
          onChange={handleChangeDescription}
        />
        <Button
          onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
            handleSubmit(e)
          }
          disabled={pendingUpdate}
          sx={{ml: 'auto', mt: 1, display: 'flex'}}
          variant="contained"
          startIcon={
            pendingUpdate ? <CircularProgress size={18} /> : <SaveIcon />
          }>
          Enregistrer
        </Button>
      </Box>
      <Box mb={4}>
        <BikeIdentityPhoto
          bike={bike}
          photo={bike.picture ? bike.picture : null}
          propertyName="picture"
          title="Photo du vélo"
          onUpdatePhoto={(photo) => setBike({...bike, picture: photo})}
        />
        <BikeIdentityPhoto
          bike={bike}
          photo={bike.wheelPicture ? bike.wheelPicture : null}
          propertyName="wheelPicture"
          title="Photo roue"
          onUpdatePhoto={(photo) => setBike({...bike, wheelPicture: photo})}
        />
        <BikeIdentityPhoto
          bike={bike}
          photo={bike.transmissionPicture ? bike.transmissionPicture : null}
          propertyName="transmissionPicture"
          title="Photo transmission"
          onUpdatePhoto={(photo) =>
            setBike({...bike, transmissionPicture: photo})
          }
        />
      </Box>
    </>
  );
};

export default BikeIdentity;
