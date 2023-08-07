import React, {useState} from 'react';
import {repairerResource} from '@resources/repairerResource';
import {
  InputLabel,
  Box,
  Grid,
  Button,
  Typography,
  CircularProgress,
} from '@mui/material';
import {checkFileSize} from '@helpers/checkFileSize';
import {Repairer} from '@interfaces/Repairer';
import {mediaObjectResource} from '@resources/mediaObjectResource';
import {errorRegex} from '@utils/errorRegex';

interface DashboardInfosPhotosProps {
  repairer: Repairer | null;
  fetchRepairer: () => void;
}

export const Photos = ({
  repairer,
  fetchRepairer,
}: DashboardInfosPhotosProps): JSX.Element => {
  const [thumbnailLoading, setThumbnailLoading] = useState<boolean>(false);
  const [descriptionLoading, setDescriptionLoading] = useState<boolean>(false);
  const [errorMessageThumbnail, setErrorMessageThumbnail] = useState<
    string | null
  >(null);
  const [errorMessageDescription, setErrorMessageDescription] = useState<
    string | null
  >(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    pictureType: string
  ) => {
    if (event.target.files && repairer) {
      if ('thumbnail' === pictureType) setThumbnailLoading(true);
      if ('description' === pictureType) setDescriptionLoading(true);
      setErrorMessageThumbnail(null);
      setErrorMessageDescription(null);
      const file = event.target.files[0];
      if (!checkFileSize(file)) {
        const errorMessage =
          'Votre photo dépasse la taille maximum autorisée (5mo)';
        if ('thumbnail' === pictureType) {
          setErrorMessageThumbnail(errorMessage);
        }
        if ('description' === pictureType) {
          setErrorMessageDescription(errorMessage);
        }
        setThumbnailLoading(false);
        setDescriptionLoading(false);
        return;
      }

      try {
        const mediaObjectResponse = await mediaObjectResource.uploadImage(
          file,
          'public'
        );
        if (mediaObjectResponse) {
          if (pictureType === 'thumbnail') {
            await repairerResource.put(repairer['@id'], {
              thumbnail: mediaObjectResponse['@id'],
            });
          } else if (pictureType === 'description') {
            await repairerResource.put(repairer['@id'], {
              descriptionPicture: mediaObjectResponse['@id'],
            });
          }
          fetchRepairer();
        }
      } catch (e: any) {
        const errorMessage = `Envoi de l'image impossible : ${e.message?.replace(
          errorRegex,
          '$2'
        )}`;
        if ('thumbnail' === pictureType) {
          setErrorMessageThumbnail(errorMessage);
        }
        if ('description' === pictureType) {
          setErrorMessageDescription(errorMessage);
        }
        setTimeout(() => {
          setErrorMessageThumbnail(null);
          setErrorMessageDescription(null);
        }, 3000);
      }
      setThumbnailLoading(false);
      setDescriptionLoading(false);
    }
  };

  return (
    <Box mt={8}>
      <InputLabel>Photo de profil</InputLabel>
      <Grid container spacing={2}>
        <Grid item>
          {repairer?.thumbnail && (
            <img
              alt="thumbnail"
              width="500"
              height="auto"
              src={repairer.thumbnail.contentUrl}
            />
          )}
        </Grid>
      </Grid>
      {errorMessageThumbnail && (
        <Typography color="red">{errorMessageThumbnail}</Typography>
      )}
      <Button variant="contained" component="label" sx={{my: 2}}>
        {thumbnailLoading && (
          <CircularProgress sx={{color: 'white'}} size={20} />
        )}
        {!thumbnailLoading && (
          <>
            Changer de photo de profil
            <input
              type="file"
              accept={'.png, .jpg, .jpeg'}
              hidden
              onChange={(e) => handleFileChange(e, 'thumbnail')}
            />
          </>
        )}
      </Button>
      <InputLabel sx={{mt: 4}}>Photo de description</InputLabel>
      <Grid container spacing={2} sx={{marginTop: '10'}}>
        <Grid item>
          {repairer?.descriptionPicture && (
            <img
              alt="photo de description"
              width="500"
              height="auto"
              src={repairer.descriptionPicture.contentUrl}
            />
          )}
        </Grid>
      </Grid>
      {errorMessageDescription && (
        <Typography color="red">{errorMessageDescription}</Typography>
      )}
      <Button variant="contained" component="label" sx={{my: 2}}>
        {descriptionLoading && (
          <CircularProgress sx={{color: 'white'}} size={20} />
        )}
        {!descriptionLoading && (
          <>
            Changer de photo de description
            <input
              accept={'.png, .jpg, .jpeg'}
              type="file"
              hidden
              onChange={(e) => handleFileChange(e, 'description')}
            />
          </>
        )}
      </Button>
    </Box>
  );
};

export default Photos;
