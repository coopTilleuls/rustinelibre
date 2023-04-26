import React, {useState} from "react";
import {Bike} from "@interfaces/Bike";
import Box from "@mui/material/Box";
import {MediaObject} from "@interfaces/MediaObject";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {CircularProgress} from "@mui/material";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import {uploadFile} from "@helpers/uploadFile";
import {bikeResource} from "@resources/bikeResource";
import {mediaObjectResource} from "@resources/mediaObjectResource";
import {useAccount} from "@contexts/AuthContext";

type BikeIdentityPhotoProps = {
    bike: Bike;
    photo: MediaObject|null;
    propertyName: string;
    title: string;
};

const BikeIdentityPhoto = ({bike, photo, propertyName, title}: BikeIdentityPhotoProps): JSX.Element => {


    const [photoDisplay, setPhotoDisplay] = useState<MediaObject|null>(photo);
    const [loading, setLoading] = useState<boolean>(false);
    const user = useAccount({redirectIfNotFound: '/velo/mes-velos'});

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
        if (event.target.files) {
            setLoading(true);

            // Upload new picture
            const response = await uploadFile(event.target.files[0]);
            const mediaObjectResponse = await response?.json() as MediaObject;
            if (mediaObjectResponse) {
                // Display new photo
                setPhotoDisplay(mediaObjectResponse);
                setLoading(false);

                // Update bike
                await bikeResource.put(bike['@id'], {
                    [propertyName] : mediaObjectResponse['@id']
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

        // Update bike
        await bikeResource.put(bike['@id'], {
            propertyName: null
        });
        // Delete media object
        await mediaObjectResource.delete(photoIri);
    }

    return (
        <Box
            sx={{
                marginTop: 4,
            }}
        >
            <Card sx={{ minWidth: 275 }}>
                <CardContent>
                    {loading && <CircularProgress />}
                    {photoDisplay && !loading && <Box>
                        <Typography variant="h5" sx={{textAlign: 'center'}}>
                            {title}
                        </Typography>
                        <img src={photoDisplay.contentUrl} alt="Photo du vélo" style={{marginLeft: '30%'}} />
                    </Box>}
                    {!photoDisplay && !loading &&
                        <Box>
                            <label htmlFor="fileUpload">
                                <Typography variant="h4" sx={{cursor:'pointer', textAlign: 'center'}}>
                                    {title}
                                </Typography>
                                <Typography sx={{textAlign: 'center'}}>
                                    <AddAPhotoIcon sx={{fontSize: "3em", cursor: 'pointer', marginBottom: '20px'}} />
                                    <br />
                                    Ajouter une photo (taille maximum 10mo)
                                </Typography>
                            </label>
                            <input
                                id="fileUpload"
                                name="fileUpload"
                                type="file"
                                hidden
                                onChange={(e) => handleFileChange(e)}
                            />
                        </Box>}
                </CardContent>
                    {
                        photoDisplay && <CardActions>
                            <Button
                                component="label"
                                size="small">
                                Modifier
                                <input
                                    type="file"
                                    hidden
                                    onChange={(e) => handleFileChange(e)}
                                />
                            </Button>
                            <Button size="small" onClick={handleRemoveImage}>Supprimer</Button>
                        </CardActions>
                    }
            </Card>
        </Box>
    )
}

export default BikeIdentityPhoto;
