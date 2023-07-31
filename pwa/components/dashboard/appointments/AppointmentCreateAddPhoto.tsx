import React, {useState} from 'react';
import {mediaObjectResource} from '@resources/mediaObjectResource';
import {CircularProgress, Typography, Box, useMediaQuery} from '@mui/material';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import {uploadImage} from '@helpers/uploadFile';
import {checkFileSize} from '@helpers/checkFileSize';
import {MediaObject} from '@interfaces/MediaObject';
import theme from 'styles/theme';

interface AppointmentCreateAddPhotoProps {
  photo: MediaObject | null;
  setPhoto: React.Dispatch<React.SetStateAction<MediaObject | null>>;
}

const AppointmentCreateAddPhoto = ({
  photo,
  setPhoto,
}: AppointmentCreateAddPhotoProps): JSX.Element => {
  const [loadingPhoto, setLoadingPhoto] = useState<boolean>(false);
  const [imageTooHeavy, setImageTooHeavy] = useState<boolean>(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    if (event.target.files && event.target.files.length > 0) {
      setImageTooHeavy(false);
      const file = event.target.files[0];
      if (!checkFileSize(file)) {
        setImageTooHeavy(true);
        return;
      }
      setLoadingPhoto(true);
      if (photo) {
        await mediaObjectResource.delete(photo['@id']);
      }
      const response = await uploadImage(file);
      const mediaObjectResponse = (await response?.json()) as MediaObject;
      if (mediaObjectResponse) {
        setPhoto(mediaObjectResponse);
      }
      setLoadingPhoto(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      {imageTooHeavy && (
        <Typography sx={{textAlign: 'center', color: 'red'}}>
          Votre photo dépasse la taille maximum autorisée (5mo)
        </Typography>
      )}
      <Box width="100%" boxShadow={2} borderRadius={6} my={1}>
        {loadingPhoto && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width={isMobile ? '100%' : '200'}
            minHeight={200}
            bgcolor="lightsecondary.main"
            sx={{
              borderRadius: 6,
              boxShadow: 4,
              overflow: 'hidden',
            }}>
            <CircularProgress sx={{fontSize: 60}} color="secondary" />
          </Box>
        )}
        {!loadingPhoto && (
          <label htmlFor="fileUpload">
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              width={isMobile ? '100%' : '200'}
              minHeight={200}
              bgcolor="lightsecondary.main"
              sx={{
                borderRadius: 6,
                boxShadow: 4,
                overflow: 'hidden',
              }}>
              {photo ? (
                <img
                  width="100%"
                  src={photo.contentUrl}
                  alt="Photo du diagnostic"
                  style={{
                    objectFit: 'cover',
                    display: 'block',
                    cursor: 'pointer',
                  }}
                />
              ) : (
                <AddAPhotoIcon sx={{fontSize: 60}} color="secondary" />
              )}
            </Box>
          </label>
        )}
        <input
          id="fileUpload"
          name="fileUpload"
          type="file"
          hidden
          onChange={(e) => handleFileChange(e)}
        />
      </Box>
    </Box>
  );
};

export default AppointmentCreateAddPhoto;
