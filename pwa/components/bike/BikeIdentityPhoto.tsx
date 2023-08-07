import React, {useState} from 'react';
import {Bike} from '@interfaces/Bike';
import Box from '@mui/material/Box';
import {MediaObject} from '@interfaces/MediaObject';
import {Alert, CircularProgress} from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import {uploadImage} from '@helpers/uploadFile';
import {bikeResource} from '@resources/bikeResource';
import {mediaObjectResource} from '@resources/mediaObjectResource';
import {checkFileSize} from '@helpers/checkFileSize';
import {Delete} from '@mui/icons-material';

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
  const [imageTooHeavy, setImageTooHeavy] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    if (event.target.files) {
      setImageTooHeavy(false);
      const file = event.target.files[0];

      if (!checkFileSize(file)) {
        setImageTooHeavy(true);
        return;
      }

      setLoading(true);

      // Upload new picture
      const response = await uploadImage(file);
      const mediaObjectResponse = (await response?.json()) as MediaObject;
      if (mediaObjectResponse) {
        // Display new photo
        setPhotoDisplay(mediaObjectResponse);
        setLoading(false);
        onUpdatePhoto?.(mediaObjectResponse);

        // Update bike
        await bikeResource.put(bike['@id'], {
          [propertyName]: mediaObjectResponse['@id'],
        });

        // Remove old picture
        if (photo) {
          await mediaObjectResource.delete(photo['@id']);
        }
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

    // Update bike
    await bikeResource.put(bike['@id'], {
      propertyName: null,
    });
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
      {imageTooHeavy && (
        <Alert
          severity="error"
          sx={{mt: 1}}
          onClose={() => setImageTooHeavy(false)}>
          Votre photo dépasse la taille maximum autorisée (5mo)
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
