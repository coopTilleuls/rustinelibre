import React, {ChangeEvent, useEffect, useState} from 'react';
import {
  CircularProgress,
  Link,
  TextField,
  Button,
  Box,
  Modal,
  Typography,
  InputLabel,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import {MediaObject} from '@interfaces/MediaObject';
import {uploadFile, uploadImage} from '@helpers/uploadFile';
import {mediaObjectResource} from '@resources/mediaObjectResource';
import {RequestBody} from '@interfaces/Resource';
import useMediaQuery from '@mui/material/useMediaQuery';
import {maintenanceResource} from '@resources/MaintenanceResource';
import {Bike} from '@interfaces/Bike';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {Moment} from 'moment';
import {Maintenance} from '@interfaces/Maintenance';
import {useAccount} from '@contexts/AuthContext';
import {useTheme} from "@mui/material/styles";
import {errorRegex} from "@utils/errorRegex";

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
  handleCloseModal: (refresh: boolean) => void;
  maintenance: Maintenance | null;
};

const ModalAddMaintenance = ({
  bike,
  openModal,
  handleCloseModal,
  maintenance = null,
}: ModalAddMaintenanceProps): JSX.Element => {
  const [pendingAdd, setPendingAdd] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [loadingPhoto, setLoadingPhoto] = useState<boolean>(false);
  const [loadingInvoice, setLoadingInvoice] = useState<boolean>(false);
  const [photo, setPhoto] = useState<MediaObject | null>(null);
  const [invoice, setInvoice] = useState<MediaObject | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const {user} = useAccount({});

  useEffect(() => {
    if (maintenance) {
      setName(maintenance.name);
      setDescription(maintenance.description ?? null);
      setPhoto(maintenance.photo ?? null);
      setInvoice(maintenance.invoice ?? null);
    }
  }, [maintenance]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    if (!name) {
      return;
    }

    setErrorMessage(null);
    setPendingAdd(true);

    try {
      let bodyRequest: RequestBody = {
        name: name,
        bike: bike['@id'],
      };
      if (description) {
        bodyRequest['description'] = description;
      }
      if (selectedDate) {
        bodyRequest['repairDate'] = selectedDate;
      }
      if (photo) {
        bodyRequest['photo'] = photo['@id'];
      }
      if (invoice) {
        bodyRequest['invoice'] = invoice['@id'];
      }
      if (maintenance) {
        maintenance = await maintenanceResource.put(
          maintenance['@id'],
          bodyRequest
        );
      } else {
        maintenance = await maintenanceResource.post(bodyRequest);
        setName('');
        setDescription('');
        setPhoto(null);
        setInvoice(null);
        setSelectedDate(null);
      }

      handleCloseModal(true);
    } catch (e: any) {
      setErrorMessage(
        `Ajout de cette réparation impossible: ${e.message?.replace(
          errorRegex,
          '$2'
        )}`
      );
    }
    setPendingAdd(false);
  };

  const handleChangeName = (event: ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value);
  };

  const handleChangeDescription = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setDescription(event.target.value);
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    mediaObject: MediaObject | null,
    type: string
  ): Promise<void> => {
    if (mediaObject) {
      await mediaObjectResource.delete(mediaObject['@id']);
    }

    if (event.target.files) {
      const isPhoto = type === 'photo';
      isPhoto ? setLoadingPhoto(true) : setLoadingInvoice(true);
      const response = await uploadFile(event.target.files[0]);
      const mediaObjectResponse = (await response?.json()) as MediaObject;
      if (mediaObjectResponse) {
        isPhoto
          ? setPhoto(mediaObjectResponse)
          : setInvoice(mediaObjectResponse);
        isPhoto ? setLoadingPhoto(false) : setLoadingInvoice(false);
      }
    }
  };

  return (
    <Modal
      open={openModal}
      onClose={() => handleCloseModal(false)}
      aria-labelledby="Ajouter un vélo"
      aria-describedby="popup_add_bike">
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {maintenance ? 'Modifier une réparation' : 'Ajouter une réparation'}
        </Typography>
        {photo && (
          <img
            width={isMobile ? '80%' : '200'}
            src={photo.contentUrl}
            alt="Photo de la réparation"
          />
        )}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
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
            inputProps={{maxLength: 255}}
            onChange={handleChangeName}
          />
          {!maintenance && (
            <Box>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  format="DD-MM-YYYY"
                  label="Date de la réparation"
                  value={selectedDate}
                  onChange={(newValue: string | Moment | null) =>
                    setSelectedDate(
                      newValue && typeof newValue !== 'string'
                        ? newValue.format('YYYY-MM-DD')
                        : null
                    )
                  }
                />
              </LocalizationProvider>
            </Box>
          )}
          <TextField
            margin="normal"
            placeholder="Description de votre réparation"
            multiline
            fullWidth
            rows={3}
            maxRows={6}
            value={description}
            inputProps={{maxLength: 3000}}
            onChange={handleChangeDescription}
          />
          <Button variant="outlined" component="label" sx={{mt: 2, mb: 2}}>
            {loadingPhoto ? (
              <CircularProgress />
            ) : photo ? (
              'Changer de photo'
            ) : (
              'Ajouter une photo'
            )}
            <input
              type="file"
              hidden
              onChange={(e) => handleFileChange(e, photo, 'photo')}
            />
          </Button>
          <Button
            variant="outlined"
            component="label"
            sx={{mt: 2, mb: 2, ml: 2}}>
            {loadingInvoice ? (
              <CircularProgress />
            ) : invoice ? (
              'Changer de facture'
            ) : (
              'Ajouter une facture'
            )}
            <input
              type="file"
              hidden
              accept={'.pdf, .doc, .docx, .odt, .xls, .csv, .png, .jpg, .jpeg'}
              onChange={(e) => handleFileChange(e, invoice, 'invoice')}
            />
          </Button>
          {invoice && (
            <Button
              variant="outlined"
              component="label"
              sx={{mt: 2, mb: 2, ml: 2}}>
              <DownloadIcon />
              <Link
                href={invoice.contentUrl}
                target="_blank"
                sx={{ml: 1, textDecoration: 'none'}}>
                Télécharger la facture
              </Link>
            </Button>
          )}
          <Box sx={{float: 'right', mt: 5}}>
            <Button
              onClick={() => handleCloseModal(false)}
              variant="outlined"
              sx={{mt: 3, mb: 2}}>
              Fermer
            </Button>
            {maintenance && user && (
              <Button type="submit" variant="contained" sx={{mt: 3, mb: 2}}>
                {!pendingAdd ? (
                  'Modifier cette réparation'
                ) : (
                  <CircularProgress sx={{color: 'white'}} size={20} />
                )}
              </Button>
            )}
            {user && !maintenance && (
              <Button type="submit" variant="contained" sx={{mt: 3, mb: 2}}>
                {!pendingAdd ? (
                  'Ajouter cette réparation'
                ) : (
                  <CircularProgress sx={{color: 'white'}} size={20} />
                )}
              </Button>
            )}
          </Box>

          {errorMessage && (
            <Typography variant="body1" color="error">
              {errorMessage}
            </Typography>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalAddMaintenance;
