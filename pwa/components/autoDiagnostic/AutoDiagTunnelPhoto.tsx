import React, {useContext, useState} from 'react';
import {useRouter} from 'next/router';
import {mediaObjectResource} from '@resources/mediaObjectResource';
import {autoDiagnosticResource} from '@resources/autoDiagResource';
import {AutodiagContext} from '@contexts/AutodiagContext';
import {Button, CircularProgress, Typography, Stack, Box} from '@mui/material';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import {errorRegex} from '@utils/errorRegex';
import {checkFileSize} from '@helpers/checkFileSize';

export const AutoDiagTunnelPhoto = (): JSX.Element => {
  const router = useRouter();
  const [loadingPhoto, setLoadingPhoto] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
      setErrorMessage(null);
      const file = event.target.files[0];
      if (!checkFileSize(file)) {
        setErrorMessage(
          'Votre photo dépasse la taille maximum autorisée (5mo)'
        );
        return;
      }

      setLoadingPhoto(true);
      if (photo) {
        await mediaObjectResource.delete(photo['@id']);
      }
      try {
        // Upload new picture
        const mediaObjectResponse = await mediaObjectResource.uploadImage(file);
        if (mediaObjectResponse) {
          // Display new photo
          setPhoto(mediaObjectResponse);
          // Update autodiag
          await autoDiagnosticResource.put(autoDiagnostic['@id'], {
            photo: mediaObjectResponse['@id'],
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
      {errorMessage && (
        <Typography sx={{textAlign: 'center', color: 'red'}}>
          {errorMessage}
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
          accept={'.png, .jpg, .jpeg'}
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
