import React, {useContext, useEffect, useState} from 'react';
import {ENTRYPOINT} from '@config/entrypoint';
import {RepairerFormContext} from '@contexts/RepairerFormContext';
import {repairerResource} from '@resources/repairerResource';
import {InputLabel, Box, Grid, Button} from '@mui/material';
import {getToken} from '@helpers/localHelper';
import {apiImageUrl} from '@helpers/apiImagesHelper';
import {MediaObject} from '@interfaces/MediaObject';
import {Repairer} from '@interfaces/Repairer';

interface DashboardInfosPhotosProps {
  repairer: Repairer | null;
}

export const DashboardInfosPhotos = ({
  repairer,
}: DashboardInfosPhotosProps): JSX.Element => {
  const {thumbnail, setThumbnail, descriptionPicture, setDescriptionPicture} =
    useContext(RepairerFormContext);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (repairer) {
      setThumbnail(repairer.thumbnail ? repairer.thumbnail : null);
      setDescriptionPicture(
        repairer.descriptionPicture ? repairer.descriptionPicture : null
      );
    }
  }, [repairer, setThumbnail, setDescriptionPicture]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    pictureType: string
  ) => {
    if (event.target.files && repairer) {
      setLoading(true);

      const response = await uploadFile(event.target.files[0]);
      const mediaObjectResponse = (await response?.json()) as MediaObject;
      if (mediaObjectResponse) {
        if (pictureType === 'thumbnail') {
          setThumbnail(mediaObjectResponse);
          repairerResource.put(repairer['@id'], {
            thumbnail: mediaObjectResponse['@id'],
          });
        } else if (pictureType === 'description') {
          setDescriptionPicture(mediaObjectResponse);
          repairerResource.put(repairer['@id'], {
            descriptionPicture: mediaObjectResponse['@id'],
          });
        }

        setLoading(false);
      }
    }
  };

  async function uploadFile(file: File): Promise<Response | undefined> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(ENTRYPOINT + '/media_objects', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      body: formData,
    });

    if (response.ok) {
      return response;
    }

    if (!response.ok) {
      throw new Error(`Failed to upload file: ${response.statusText}`);
    }
  }

  return (
    <>
      <Box
        sx={{
          marginTop: 8,
        }}>
        <InputLabel>Photo de profil</InputLabel>
        <Grid container spacing={2}>
          <Grid item>
            {thumbnail && (
              <img
                alt="thumbnail"
                width="200"
                height="200"
                src={apiImageUrl(thumbnail.contentUrl)}
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
        <InputLabel sx={{mt: 4}}>Photo de description</InputLabel>
        <Grid container spacing={2} sx={{marginTop: '10'}}>
          <Grid item>
            {descriptionPicture && (
              <img
                alt="photo de description"
                width="200"
                height="200"
                src={apiImageUrl(descriptionPicture.contentUrl)}
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
      </Box>
    </>
  );
};

export default DashboardInfosPhotos;
