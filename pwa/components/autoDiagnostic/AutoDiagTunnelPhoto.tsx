import React, {useContext, useState} from 'react';
import {useRouter} from 'next/router';
import {mediaObjectResource} from '@resources/mediaObjectResource';
import {autoDiagnosticResource} from '@resources/autoDiagResource';
import {AutodiagContext} from '@contexts/AutodiagContext';
import {Button, CircularProgress, Typography, Stack, Box} from '@mui/material';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import {uploadImage} from '@helpers/uploadFile';
import {MediaObject} from '@interfaces/MediaObject';
import {checkFileSize} from "@helpers/checkFileSize";

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
      alignItems="center">
      <Typography component="h2" fontSize={18} fontWeight={600} my={{xs: 2}}>
        Ajouter une photo
      </Typography>
      {imageTooHeavy && <Typography sx={{textAlign: 'center', color: 'red'}}>
        Votre photo dépasse la taille maximum autorisée (5mo)
      </Typography>}
      <Box border="1px solid grey" p={2} borderRadius={5}>
        {loadingPhoto && <CircularProgress />}
        {!loadingPhoto && (
          <label htmlFor="fileUpload">
            {!photo ? (
              <Box
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
              <img
                alt="Photo du diagnostic"
                src={photo.contentUrl}
                style={{cursor: 'pointer', width: '80%', marginLeft: '10%'}}
              />
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
      <Box width="100%" display="flex" justifyContent="space-between">
        <Button
          variant="outlined"
          sx={{marginTop: '30px'}}
          onClick={handleClickBack}>
          Retour
        </Button>
        <Button
          variant="contained"
          sx={{marginTop: '30px'}}
          onClick={handleClickNext}>
          Suivant
        </Button>
      </Box>
    </Stack>
  );
};

export default AutoDiagTunnelPhoto;
