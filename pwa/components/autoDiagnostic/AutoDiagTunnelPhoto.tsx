import React, {useContext, useState} from 'react';
import {useRouter} from 'next/router';
import {mediaObjectResource} from '@resources/mediaObjectResource';
import {autoDiagnosticResource} from '@resources/autoDiagResource';
import {AutodiagContext} from '@contexts/AutodiagContext';
import {Button, CircularProgress, Typography, Stack, Box} from '@mui/material';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import {uploadImage} from '@helpers/uploadFile';
import {MediaObject} from '@interfaces/MediaObject';
import {checkFileSize} from '@helpers/checkFileSize';

export const AutoDiagTunnelPhoto = (): JSX.Element => {
  const router = useRouter();
  const [loadingPhoto, setLoadingPhoto] = useState<boolean>(false);
  const [imageTooHeavy, setImageTooHeavy] = useState<boolean>(false);

  const {
    appointment,
    autoDiagnostic,
    photo,
    setTunnelStep,
    setAutoDiagnostic,
    setPhoto,
  } = useContext(AutodiagContext);

  const handleClickNext = async () => {
    if (!appointment || !autoDiagnostic) {
      return;
    }

    if (photo) {
      const autodiag = await autoDiagnosticResource.put(autoDiagnostic['@id'], {
        photo: photo['@id'],
      });
      setAutoDiagnostic(autodiag);
    }

    router.push(`/rendez-vous/recapitulatif/${appointment.id}`);
  };

  const handleClickBack = (): void => {
    setTunnelStep('prestation');
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    if (!autoDiagnostic) {
      return;
    }
    if (event.target.files) {
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
      // Upload new picture
      const response = await uploadImage(file);
      const mediaObjectResponse = (await response?.json()) as MediaObject;
      if (mediaObjectResponse) {
        // Display new photo
        setPhoto(mediaObjectResponse);
        // Update autodiag
        await autoDiagnosticResource.put(autoDiagnostic['@id'], {
          photo: mediaObjectResponse['@id'],
        });
      }
      setLoadingPhoto(false);
    }
  };

  return (
    <Stack
      spacing={4}
      display="flex"
      flexDirection="column"
      alignItems="center"
      width="100%">
      <Typography variant="h5" component="label">
        Ajouter une photo
      </Typography>
      {imageTooHeavy && (
        <Typography sx={{textAlign: 'center', color: 'red'}}>
          Votre photo dépasse la taille maximum autorisée (5mo)
        </Typography>
      )}
      <Box>
        {loadingPhoto && <CircularProgress />}
        {!loadingPhoto && (
          <label htmlFor="fileUpload">
            {!photo ? (
              <Box
                border="1px solid"
                borderColor="grey.300"
                p={2}
                borderRadius={5}
                sx={{cursor: 'pointer'}}
                display="flex"
                flexDirection="column"
                alignItems="center">
                <Typography component="p" sx={{mt: 2}}>
                  Sélectionner la photo du vélo
                </Typography>
                <AddAPhotoIcon sx={{fontSize: '3em'}} color="primary" />
              </Box>
            ) : (
              <Box
                sx={{
                  overflow: 'hidden',
                  borderRadius: 6,
                  boxShadow: 4,
                }}>
                <img
                  height="auto"
                  src={photo.contentUrl}
                  alt="Photo du diagnostic"
                  style={{
                    cursor: 'pointer',
                    display: 'block',
                    maxWidth: '400px',
                    width: '100%',
                  }}
                />
              </Box>
            )}
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
      <Box width="100%" display="flex" justifyContent="space-between" mt={6}>
        <Button variant="outlined" onClick={handleClickBack}>
          Retour
        </Button>
        <Button variant="contained" onClick={handleClickNext}>
          Suivant
        </Button>
      </Box>
    </Stack>
  );
};

export default AutoDiagTunnelPhoto;
