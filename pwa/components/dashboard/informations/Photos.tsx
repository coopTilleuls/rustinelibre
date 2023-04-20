import React, {useContext, useEffect, useState} from "react";
import {Repairer} from "@interfaces/Repairer";
import InputLabel from "@mui/material/InputLabel";
import {RepairerFormContext} from "@contexts/RepairerFormContext";
import Box from "@mui/material/Box";
import {apiImageUrl} from "@helpers/apiImagesHelper";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import {getToken} from "@helpers/sessionHelper";
import {MediaObject} from "@interfaces/MediaObject";
import {repairerResource} from "@resources/repairerResource";
import Image from "next/image";
import {ENTRYPOINT} from "../../../config/entrypoint";

interface DashboardInfosPhotosProps {
    repairer: Repairer|null;
}

export const DashboardInfosPhotos = ({repairer}: DashboardInfosPhotosProps): JSX.Element => {
    const {thumbnail, setThumbnail, descriptionPicture, setDescriptionPicture} = useContext(RepairerFormContext);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (repairer) {
            setThumbnail(repairer.thumbnail ? repairer.thumbnail : null);
            setDescriptionPicture(repairer.descriptionPicture ? repairer.descriptionPicture : null);
        }
    }, [repairer, setThumbnail, setDescriptionPicture]);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, pictureType: string) => {
        if (event.target.files && repairer) {
            setLoading(true);

            const response = await uploadFile(event.target.files[0]);
            const mediaObjectResponse = await response?.json() as MediaObject;
            if (mediaObjectResponse) {
                if (pictureType === 'thumbnail') {
                    setThumbnail(mediaObjectResponse);
                    repairerResource.put(repairer['@id'], {
                        'thumbnail': mediaObjectResponse['@id']
                    })
                } else if (pictureType === 'description') {
                    setDescriptionPicture(mediaObjectResponse);
                    repairerResource.put(repairer['@id'], {
                        'descriptionPicture': mediaObjectResponse['@id']
                    })
                }

                setLoading(false)
            }
        }
    };

    async function uploadFile(file: File): Promise<Response|undefined> {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(ENTRYPOINT+"/media_objects", {
            method: "POST",
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
                }}
            >
                <InputLabel>Photo de profil</InputLabel>
                <Grid container spacing={2} sx={{marginTop: '10'}}>
                    <Grid item>
                        {
                            thumbnail && <img alt="thumbnail" width="200" height="200" src={apiImageUrl(thumbnail.contentUrl)} />
                        }
                    </Grid>
                    <Grid item>
                        <Button
                            variant="outlined"
                            component="label"
                        >
                            Changer de photo de profil
                            <input
                                type="file"
                                hidden
                                onChange={(e) => handleFileChange(e, 'thumbnail')}
                            />
                        </Button>
                    </Grid>
                </Grid>
                <InputLabel>Photo de description</InputLabel>
                <Grid container spacing={2} sx={{marginTop: '10'}}>
                    <Grid item>
                        {
                            descriptionPicture && <img alt="photo de description" width="200" height="200" src={apiImageUrl(descriptionPicture.contentUrl)} />
                        }
                    </Grid>
                    <Grid item>
                        <Button
                            variant="outlined"
                            component="label"
                        >
                            Changer de photo de description
                            <input
                                type="file"
                                hidden
                                onChange={(e) => handleFileChange(e, 'description')}
                            />
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default DashboardInfosPhotos;
