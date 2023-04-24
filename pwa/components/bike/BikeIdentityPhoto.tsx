import React, {useState} from "react";
import {Bike} from "@interfaces/Bike";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import BikeIdentity from "@components/bike/BikeIdentity";
import {BikeType} from "@interfaces/BikeType";
import {MediaObject} from "@interfaces/MediaObject";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {Alert, CircularProgress} from "@mui/material";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import {apiImageUrl} from "@helpers/apiImagesHelper";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import Typography from "@mui/material/Typography";
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import {repairerResource} from "@resources/repairerResource";
import {uploadFile} from "@helpers/uploadFile";
import {bikeResource} from "@resources/bikeResource";
import {mediaObjectResource} from "@resources/mediaObjectResource";

type BikeIdentityPhotoProps = {
    bike: Bike;
    photo: MediaObject|null;
    propertyName: string;
    title: string;
};

const BikeIdentityPhoto = ({bike, photo, propertyName, title}: BikeIdentityPhotoProps): JSX.Element => {

    const [loading, setLoading] = useState<boolean>(false);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
        if (event.target.files) {
            setLoading(true);
            const response = await uploadFile(event.target.files[0]);
            const mediaObjectResponse = await response?.json() as MediaObject;
            if (mediaObjectResponse) {
                await bikeResource.put(bike['@id'], {
                    propertyName: mediaObjectResponse['@id']
                })
                setLoading(false)
            }
        }
    };

    const handleRemoveImage = async (): Promise<void> => {
        if (!photo) {
            return;
        }

        await mediaObjectResource.delete(photo['@id']);
        bike = await bikeResource.put(bike['@id'], {
            propertyName: null
        });

        photo = null;
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
                    {photo && !loading && <img src={photo.contentUrl} />}
                    {!photo && !loading && <Box>
                        <input
                            type="file"
                            hidden
                            onChange={(e) => handleFileChange(e)}
                        />
                        <Typography variant="h4">
                            {title}
                        </Typography>
                        <Typography>
                            <AddAPhotoIcon sx={{fontSize: "2em", marginLeft: "20%"}} />
                            <br />
                            Ajouter une photo (taille maximum 10mo)
                        </Typography>
                    </Box>}
                </CardContent>
                    {
                        photo && <CardActions>
                            <Button size="small">
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
