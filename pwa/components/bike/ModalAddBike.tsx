import React, {ChangeEvent, useEffect, useState} from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import UserForm from "@components/profile/UserForm";
import Button from "@mui/material/Button";
import {CircularProgress} from "@mui/material";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import {userResource} from "@resources/userResource";
import MenuItem from "@mui/material/MenuItem";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import {BikeType} from "@interfaces/BikeType";
import {MediaObject} from "@interfaces/MediaObject";
import {repairerResource} from "@resources/repairerResource";
import { uploadFile } from "@helpers/uploadFile";
import BuildIcon from "@mui/icons-material/Build";
import Avatar from "@mui/material/Avatar";
import {apiImageUrl} from "@helpers/apiImagesHelper";
import {mediaObjectResource} from "@resources/mediaObjectResource";
import {bikeResource} from "@resources/bikeResource";


const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

type ModalAddBikeProps = {
    bikeTypes: BikeType[];
    openModal: boolean;
    handleCloseModal: () => void;
};

const ModalAddBike = ({bikeTypes, openModal, handleCloseModal}: ModalAddBikeProps): JSX.Element => {

    const [pendingAdd, setPendingAdd] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [name, setName] = useState<string | null>(null);
    const [selectedBike, setSelectedBike] = useState<BikeType | null>(null);
    const [loadingPhoto, setLoadingPhoto] = useState<boolean>(false);
    const [photo, setPhoto] = useState<MediaObject|null>(null);

    const handleBikeChange = (event: SelectChangeEvent): void => {
        const selectedBikeType = bikeTypes.find((bt) => bt.name === event.target.value);
        setSelectedBike(selectedBikeType ? selectedBikeType : null);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {

        event.preventDefault();
        if (!name || !selectedBike) {
            return;
        }

        setErrorMessage(null);
        setPendingAdd(true);

        let newBike;
        try {
            newBike = await bikeResource.post({
                'name': name,
                'selectedBike': selectedBike['@id'],
            })
        } catch (e) {
            setErrorMessage('Ajout du vélo impossible');
        }

        if (newBike) {
            handleCloseModal();
        }

        setPendingAdd(false);
    };

    const handleChangeName = (event: ChangeEvent<HTMLInputElement>): void => {
        setName(event.target.value);
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
                    Ajouter un vélo
                </Typography>
                {photo && <img width="300" src={apiImageUrl(photo.contentUrl)}/>}
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
                    <Select
                        required
                        onChange={handleBikeChange}
                        value={selectedBike?.name}
                        style={{width: '100%'}}
                    >
                        <MenuItem disabled value="">Choisissez un type de vélo</MenuItem>
                        {bikeTypes.map((bike) => (
                            <MenuItem key={bike.id} value={bike.name}>{bike.name}</MenuItem>
                        ))}
                    </Select>
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
                        {!pendingAdd ? 'Ajouter ce vélo' : <CircularProgress size={20} />}
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

export default ModalAddBike;
