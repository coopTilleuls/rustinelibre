import React, {ChangeEvent, useState} from "react";
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import {CircularProgress} from "@mui/material";
import TextField from "@mui/material/TextField";
import {MediaObject} from "@interfaces/MediaObject";
import { uploadFile } from "@helpers/uploadFile";
import {apiImageUrl} from "@helpers/apiImagesHelper";
import {mediaObjectResource} from "@resources/mediaObjectResource";
import {RequestBody} from "@interfaces/Resource";
import useMediaQuery from "@hooks/useMediaQuery";
import {maintenanceResource} from "@resources/MaintenanceResource";
import {Bike} from "@interfaces/Bike";

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

type ModalAddMaintenanceProps = {
    bike: Bike;
    openModal: boolean;
    handleCloseModal: () => void;
};

const ModalAddMaintenance = ({bike, openModal, handleCloseModal}: ModalAddMaintenanceProps): JSX.Element => {

    const [pendingAdd, setPendingAdd] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [name, setName] = useState<string | null>(null);
    const [description, setDescription] = useState<string | null>(null);
    const [loadingPhoto, setLoadingPhoto] = useState<boolean>(false);
    const [photo, setPhoto] = useState<MediaObject|null>(null);
    const isMobile = useMediaQuery('(max-width: 640px)');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {

        event.preventDefault();
        if (!name) {
            return;
        }

        setErrorMessage(null);
        setPendingAdd(true);

        let newMaintenance;
        try {
            let bodyRequest: RequestBody = {
                'name': name,
                'bike': bike['@id']
            };
            if (description) {
                bodyRequest['description'] = description;
            }
            if (photo) {
                bodyRequest['photo'] = photo['@id'];
            }
            newMaintenance = await maintenanceResource.post(bodyRequest)
        } catch (e) {
            setErrorMessage('Ajout de cette réparation impossible');
        }

        if (newMaintenance) {
            setName('');
            setDescription('');
            setPhoto(null);
            handleCloseModal();
        }

        setPendingAdd(false);
    };

    const handleChangeName = (event: ChangeEvent<HTMLInputElement>): void => {
        setName(event.target.value);
    };

    const handleChangeDescription = (event: ChangeEvent<HTMLInputElement>): void => {
        setDescription(event.target.value);
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {

        if (photo) {
            await mediaObjectResource.delete(photo['@id']);
        }

        if (event.target.files) {
            setLoadingPhoto(true);

            const response = await uploadFile(event.target.files[0]);
            const mediaObjectResponse = await response?.json() as MediaObject;
            if (mediaObjectResponse) {
                setPhoto(mediaObjectResponse);
                setLoadingPhoto(false)
            }
        }
    };

    return (
        <Modal
            open={openModal}
            onClose={handleCloseModal}
            aria-labelledby="Ajouter un vélo"
            aria-describedby="popup_add_bike"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Ajouter une réparation
                </Typography>
                {photo && <img width={isMobile ? "80%" : "200"} src={apiImageUrl(photo.contentUrl)}/>}
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Nom"
                        name="name"
                        autoComplete="name"
                        autoFocus
                        value={name}
                        onChange={handleChangeName}
                    />
                    <TextField
                        margin="normal"
                        placeholder="Description de votre réparation"
                        multiline
                        fullWidth
                        rows={3}
                        maxRows={6}
                        onChange={handleChangeDescription}
                    />
                    <Button
                        variant="outlined"
                        component="label"
                        sx={{ mt: 2, mb: 2 }}
                    >
                        {loadingPhoto ? <CircularProgress /> : (photo ? 'Changer de photo' : 'Ajouter une photo')}
                        <input
                            type="file"
                            hidden
                            onChange={(e) => handleFileChange(e)}
                        />
                    </Button>
                    <Button
                        type="submit"
                        fullWidth
                        variant="outlined"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        {!pendingAdd ? 'Ajouter cette réparation' : <CircularProgress size={20} />}
                    </Button>
                    {errorMessage && (
                        <Typography variant="body1" color="error">
                            {errorMessage}
                        </Typography>
                    )}
                </Box>
            </Box>
        </Modal>
    )
}

export default ModalAddMaintenance;
