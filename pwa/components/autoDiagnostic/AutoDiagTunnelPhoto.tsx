import React, {useContext, useState} from 'react';
import Box from '@mui/material/Box';
import {Button, CircularProgress, Typography} from '@mui/material';
import {AutodiagContext} from "@contexts/AutodiagContext";
import {useRouter} from "next/router";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import {apiImageUrl} from "@helpers/apiImagesHelper";
import {autoDiagnosticResource} from "@resources/autoDiagResource";
import {uploadFile} from "@helpers/uploadFile";
import {MediaObject} from "@interfaces/MediaObject";
import {mediaObjectResource} from "@resources/mediaObjectResource";

export const AutoDiagTunnelPhoto = (): JSX.Element => {

    const router = useRouter();
    const [loadingPhoto, setLoadingPhoto] = useState<boolean>(false);

    const {appointment,
        autoDiagnostic,
        photo,
        setTunnelStep,
        setAutoDiagnostic,
        setPhoto} = useContext(AutodiagContext);

    const handleClickNext = async() => {
        if (!appointment || !autoDiagnostic) {
            return;
        }

        if (photo) {
            const autodiag = await autoDiagnosticResource.put(autoDiagnostic['@id'], {
                'photo' : photo['@id']
            })
            setAutoDiagnostic(autodiag);
        }

        router.push(`/rendez-vous/recapitulatif/${appointment.id}`)
    }

    const handleClickBack = (): void => {
        setTunnelStep('prestation');
    }

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
        if (!autoDiagnostic) {
            return;
        }

        if (event.target.files) {
            setLoadingPhoto(true);
            if (photo) {
                await mediaObjectResource.delete(photo['@id']);
            }

            // Upload new picture
            const response = await uploadFile(event.target.files[0]);
            const mediaObjectResponse = await response?.json() as MediaObject;
            if (mediaObjectResponse) {
                // Display new photo
                setPhoto(mediaObjectResponse);
                // Update autodiag
                await autoDiagnosticResource.put(autoDiagnostic['@id'], {
                    'photo': mediaObjectResponse['@id']
                })
            }

            setLoadingPhoto(false);
        }
    };

    return (
        <Box>
            <Typography
                component="p"
                align="center"
                sx={{mt: 2}}>
                Ajouter une photo
            </Typography>
            <Box sx={{border: '1px solid black', padding: '10px', cursor: 'pointer'}}>

                {loadingPhoto && <CircularProgress />}

                {!loadingPhoto && <label htmlFor="fileUpload">
                    {!photo ? <Box>
                        <Typography
                            component="p"
                            align="center"
                            sx={{mt: 2}}>
                            Sélectionner la photo de votre vélo
                        </Typography>
                        <AddAPhotoIcon sx={{marginLeft:'30%', fontSize: '3em'}} />
                    </Box> : <img alt="Photo du diagnostic" src={apiImageUrl(photo.contentUrl)} style={{cursor: 'pointer'}} />
                    }
                </label>}
                <input
                    id="fileUpload"
                    name="fileUpload"
                    type="file"
                    hidden
                    onChange={(e) => handleFileChange(e)}
                />
            </Box>

            <Button variant="outlined" sx={{marginTop:'30px'}} onClick={handleClickBack}>
                Retour
            </Button>
            <Button variant="outlined" sx={{marginTop:'30px'}} onClick={handleClickNext}>
                Suivant
            </Button>
        </Box>
    );
};

export default AutoDiagTunnelPhoto;
