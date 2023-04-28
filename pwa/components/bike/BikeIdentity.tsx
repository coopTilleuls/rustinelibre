import React, {ChangeEvent, useState} from 'react';
import {bikeResource} from '@resources/bikeResource';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Button,
  Alert,
  CircularProgress,
  MenuItem,
  TextField,
} from '@mui/material';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import BikeIdentityPhoto from '@components/bike/BikeIdentityPhoto';
import {Bike} from '@interfaces/Bike';
import {RequestBody} from '@interfaces/Resource';
import {BikeType} from '@interfaces/BikeType';

type BikeIdentityProps = {
  bike: Bike;
  bikeTypes: BikeType[];
};

const BikeIdentity = ({bike, bikeTypes}: BikeIdentityProps): JSX.Element => {
  const [addDescription, setAddDescription] = useState<boolean>(false);
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

  const handleAddDescription = (): void => {
    setAddDescription(true);
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
    } catch (e) {
      setErrorMessage('Mise à jour du vélo impossible');
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
    <Box width={'100%'}>
      <Card>
        <CardContent>
          {updateSuccess && <Alert severity="success">Vélo mis à jour</Alert>}
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
          <Select
            required
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
          <TextField
            margin="normal"
            required
            fullWidth
            id="brand"
            label="Marque"
            name="name"
            autoComplete="brand"
            autoFocus
            value={brand}
            onChange={handleChangeBrand}
          />
          {addDescription && (
            <TextField
              margin="normal"
              placeholder="Description de votre vélo"
              multiline
              fullWidth
              value={description}
              rows={3}
              maxRows={6}
              onChange={handleChangeDescription}
            />
          )}
        </CardContent>
        <CardActions
          sx={{
            display: 'flex',
            flexDirection: {xs: 'column', md: 'row'},
            justifyContent: {md: 'center'},
          }}>
          {!addDescription && (
            <Button
              onClick={handleAddDescription}
              size="small"
              variant="contained">
              <AddIcon /> Ajouter une description
            </Button>
          )}
          {pendingUpdate ? (
            <CircularProgress />
          ) : (
            <Button
              onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
                handleSubmit(e)
              }
              size="small"
              variant="contained"
              sx={{my: 2}}>
              <SaveIcon /> Enregistrer
            </Button>
          )}
        </CardActions>
      </Card>

      <BikeIdentityPhoto
        bike={bike}
        photo={bike.picture ? bike.picture : null}
        propertyName="picture"
        title="Photo du vélo"
      />
      <BikeIdentityPhoto
        bike={bike}
        photo={bike.wheelPicture ? bike.wheelPicture : null}
        propertyName="wheelPicture"
        title="Photo roue"
      />
      <BikeIdentityPhoto
        bike={bike}
        photo={bike.transmissionPicture ? bike.transmissionPicture : null}
        propertyName="transmissionPicture"
        title="Photo transmission"
      />
    </Box>
  );
};

export default BikeIdentity;
