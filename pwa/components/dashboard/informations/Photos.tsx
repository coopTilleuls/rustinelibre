import React, {useContext, useEffect, useState} from 'react';
import {RepairerFormContext} from '@contexts/RepairerFormContext';
import {repairerResource} from '@resources/repairerResource';
import {InputLabel, Box, Grid, Button, Typography} from '@mui/material';
import {apiImageUrl} from '@helpers/apiImagesHelper';
import {checkFileSize} from '@helpers/checkFileSize';
import {MediaObject} from '@interfaces/MediaObject';
import {Repairer} from '@interfaces/Repairer';
import {uploadFile} from '@helpers/uploadFile';

interface DashboardInfosPhotosProps {
  repairer: Repairer | null;
  fetchRepairer: () => void;
}

export const DashboardInfosPhotos = ({
  repairer,
  fetchRepairer,
}: DashboardInfosPhotosProps): JSX.Element => {
  const {setThumbnail, setDescriptionPicture} = useContext(RepairerFormContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [imageTooHeavy, setImageTooHeavy] = useState<boolean>(false);

  useEffect(() => {
    if (repairer) {
      setThumbnail(repairer.thumbnail ?? null);
      setDescriptionPicture(repairer.descriptionPicture ?? null);
    }
  }, [repairer, setThumbnail, setDescriptionPicture]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    pictureType: string
  ) => {
    if (event.target.files && repairer) {
      setImageTooHeavy(false);
      const file = event.target.files[0];
      if (!checkFileSize(file)) {
        setImageTooHeavy(true);
        return;
      }

      setLoading(true);

      const response = await uploadFile(file);
      const mediaObjectResponse = (await response?.json()) as MediaObject;
      if (mediaObjectResponse) {
        if (pictureType === 'thumbnail') {
          setThumbnail(mediaObjectResponse);
          await repairerResource.put(repairer['@id'], {
            thumbnail: mediaObjectResponse['@id'],
          });
        } else if (pictureType === 'description') {
          setDescriptionPicture(mediaObjectResponse);
          await repairerResource.put(repairer['@id'], {
            descriptionPicture: mediaObjectResponse['@id'],
          });
        }
        setLoading(false);
        fetchRepairer();
        setThumbnail(repairer.thumbnail ?? null);
        setDescriptionPicture(repairer.descriptionPicture ?? null);
      }
    }
  };

  return (
    <Box
      sx={{
        marginTop: 8,
      }}>
      <InputLabel>Photo de profil</InputLabel>
      <Grid container spacing={2}>
        <Grid item>
          {repairer?.thumbnail && (
            <img
              alt="thumbnail"
              width="500"
              height="auto"
              src={apiImageUrl(repairer.thumbnail.contentUrl)}
            />
          )}
        </Grid>
      </Grid>
      <Button variant="contained" component="label" sx={{my: 2}}>
        Changer de photo de profil
        <input
          type="file"
          hidden
          onChange={(e) => handleFileChange(e, 'thumbnail')}
        />
      </Button>
      {imageTooHeavy && (
        <Typography sx={{textAlign: 'center', color: 'red'}}>
          Votre photo dépasse la taille maximum autorisée (5mo)
        </Typography>
      )}
      <InputLabel sx={{mt: 4}}>Photo de description</InputLabel>
      <Grid container spacing={2} sx={{marginTop: '10'}}>
        <Grid item>
          {repairer?.descriptionPicture && (
            <img
              alt="photo de description"
              width="500"
              height="auto"
              src={apiImageUrl(repairer.descriptionPicture.contentUrl)}
            />
          )}
        </Grid>
      </Grid>
      <Button variant="contained" component="label" sx={{my: 2}}>
        Changer de photo de description
        <input
          type="file"
          hidden
          onChange={(e) => handleFileChange(e, 'description')}
        />
      </Button>
      {imageTooHeavy && (
        <Typography sx={{textAlign: 'center', color: 'red'}}>
          Votre photo dépasse la taille maximum autorisée (5mo)
        </Typography>
      )}
    </Box>
  );
};

export default DashboardInfosPhotos;
