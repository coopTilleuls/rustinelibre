import React, {useState} from 'react';
import {mediaObjectResource} from '@resources/mediaObjectResource';
import {CircularProgress, Typography, Stack, Box} from '@mui/material';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import {apiImageUrl} from '@helpers/apiImagesHelper';
import {uploadFile} from '@helpers/uploadFile';
import {MediaObject} from '@interfaces/MediaObject';
import {checkFileSize} from "@helpers/checkFileSize";

interface AppointmentCreateAddPhotoProps {
    photo: MediaObject | null;
    setPhoto: React.Dispatch<React.SetStateAction<MediaObject | null>>;
}

const AppointmentCreateAddPhoto = ({photo, setPhoto}: AppointmentCreateAddPhotoProps): JSX.Element => {

    const [loadingPhoto, setLoadingPhoto] = useState<boolean>(false);
    const [imageTooHeavy, setImageTooHeavy] = useState<boolean>(false);

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

            setLoadingPhoto(true);
            if (photo) {
                await mediaObjectResource.delete(photo['@id']);
            }

            // Upload new picture
            const response = await uploadFile(file);
            const mediaObjectResponse = (await response?.json()) as MediaObject;
            if (mediaObjectResponse) {
                // Display new photo
                setPhoto(mediaObjectResponse);
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
                                    Télécharger une photo
                                </Typography>
                                <AddAPhotoIcon sx={{fontSize: '3em'}} color="primary" />
                            </Box>
                        ) : (
                            <img
                                alt="Photo du diagnostic"
                                src={apiImageUrl(photo.contentUrl)}
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
        </Stack>
    );
};

export default AppointmentCreateAddPhoto;
