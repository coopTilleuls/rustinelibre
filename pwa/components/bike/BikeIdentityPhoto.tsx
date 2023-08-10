import React, {useState} from 'react';
import {Bike} from '@interfaces/Bike';
import Box from '@mui/material/Box';
import {MediaObject} from '@interfaces/MediaObject';
import {Alert, CircularProgress} from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import {bikeResource} from '@resources/bikeResource';
import {mediaObjectResource} from '@resources/mediaObjectResource';
import {checkFileSize} from '@helpers/checkFileSize';
import {Delete} from '@mui/icons-material';
import {errorRegex} from '@utils/errorRegex';

type BikeIdentityPhotoProps = {
  bike: Bike;
  photo: MediaObject | null;
  propertyName: string;
  title: string;
  onUpdatePhoto?: (photo?: MediaObject) => void;
};

const BikeIdentityPhoto = ({
  bike,
  photo,
  propertyName,
  title,
  onUpdatePhoto,
}: BikeIdentityPhotoProps): JSX.Element => {
  const [photoDisplay, setPhotoDisplay] = useState<MediaObject | null>(photo);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    if (event.target.files && event.target.files[0]) {
      setErrorMessage(null);
      const file = event.target.files[0];

      if (!checkFileSize(file)) {
        setErrorMessage(
          'Votre photo dépasse la taille maximum autorisée (5mo)'
        );
        return;
      }

      setLoading(true);

      try {
        // Upload new picture
        const mediaObjectResponse = await mediaObjectResource.uploadImage(file);
        if (mediaObjectResponse) {
          // Display new photo
          setPhotoDisplay(mediaObjectResponse);
          setLoading(false);
          onUpdatePhoto?.(mediaObjectResponse);

          // Update bike
          await bikeResource.put(bike['@id'], {
            [propertyName]: mediaObjectResponse['@id'],
          });
        }
      } catch (e: any) {
        setErrorMessage(
          `Envoi de l'image impossible : ${e.message?.replace(
            errorRegex,
            '$2'
          )}`
        );
        setTimeout(() => setErrorMessage(null), 3000);
      }
    }
  };

  const handleRemoveImage = async (): Promise<void> => {
    if (!photoDisplay) {
      return;
    }
    const photoIri = photoDisplay['@id'];
    // Remove image displayed
    setPhotoDisplay(null);
    onUpdatePhoto?.(undefined);

    // Delete media object
    await mediaObjectResource.delete(photoIri);
  };

  return (
    <Box
      sx={{
        mt: 4,
        pt: 4,
        px: 4,
        borderTop: '1px solid',
        borderColor: 'divider',
        '&:first-of-type': {
          mt: 0,
        },
      }}>
      <Typography variant="h5" component="span" sx={{mr: 1}}>
        {title}
      </Typography>
      <Typography component="span" variant="caption" color="text.secondary">
        (Max 5mo)
      </Typography>
      {errorMessage && (
        <Alert
          severity="error"
          sx={{mt: 1}}
          onClose={() => setErrorMessage(null)}>
          {errorMessage}
        </Alert>
      )}
      {photoDisplay && (
        <Box>
          <Box
            display="flex"
            flexDirection="column"
            gap={1}
            my={2}
            alignItems="flex-start">
            <Box
              sx={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 6,
                boxShadow: 4,
              }}>
              <img
                height="auto"
                src={photoDisplay.contentUrl}
                alt="Photo du vélo"
                style={{
                  display: 'block',
                  maxWidth: '500px',
                  width: '100%',
                }}
              />
            </Box>
          </Box>
        </Box>
      )}
      <Box display="flex" gap={2} my={2} alignItems="center">
        <Button
          variant="outlined"
          size="small"
          color="secondary"
          disabled={loading}
          startIcon={
            loading ? (
              <CircularProgress size={18} color="secondary" />
            ) : (
              <AddAPhotoIcon />
            )
          }
          component="label">
          {photoDisplay ? 'Changer de photo' : 'Ajouter une photo'}
          <input
            type="file"
            accept={'.png, .jpg, .jpeg'}
            hidden
            onChange={(e) => handleFileChange(e)}
          />
        </Button>
        {photoDisplay ? (
          <Button
            size="small"
            color="error"
            variant="outlined"
            onClick={handleRemoveImage}
            startIcon={<Delete />}>
            Supprimer
          </Button>
        ) : null}
      </Box>
    </Box>
  );
};

export default BikeIdentityPhoto;
