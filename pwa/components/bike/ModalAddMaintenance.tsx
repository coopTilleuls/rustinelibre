import React, {ChangeEvent, useEffect, useState} from 'react';
import dayjs, {Dayjs} from 'dayjs';
import 'dayjs/locale/fr';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import {mediaObjectResource} from '@resources/mediaObjectResource';
import {maintenanceResource} from '@resources/MaintenanceResource';
import {useAccount} from '@contexts/AuthContext';
import {errorRegex} from '@utils/errorRegex';
import {uploadFile, uploadImage} from '@helpers/uploadFile';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  CircularProgress,
  TextField,
  Button,
  Box,
  Typography,
  Dialog,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {frFR} from '@mui/x-date-pickers';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import CloseIcon from '@mui/icons-material/Close';
import {MediaObject} from '@interfaces/MediaObject';
import {Bike} from '@interfaces/Bike';
import {RequestBody} from '@interfaces/Resource';
import {Maintenance} from '@interfaces/Maintenance';

type ModalAddMaintenanceProps = {
  bike: Bike;
  openModal: boolean;
  handleCloseModal: (refresh?: boolean) => void;
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
  const [description, setDescription] = useState<string | null>(
    maintenance?.description || null
  );
  const [loadingPhoto, setLoadingPhoto] = useState<boolean>(false);
  const [loadingInvoice, setLoadingInvoice] = useState<boolean>(false);
  const [newPhoto, setNewPhoto] = useState<MediaObject | null>(null);
  const [newInvoice, setNewInvoice] = useState<MediaObject | null>(null);
  const [photo, setPhoto] = useState<MediaObject | null>(
    maintenance?.photo || null
  );
  const [invoice, setInvoice] = useState<MediaObject | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const {user} = useAccount({});

  dayjs.extend(timezone);
  dayjs.extend(utc);

  useEffect(() => {
    if (maintenance) {
      setSelectedDate(maintenance.repairDate ?? null);
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
        setNewPhoto(null);
        setNewInvoice(null);
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
    type: string
  ): Promise<void> => {
    if (event.target.files) {
      const isPhoto = type === 'photo';
      isPhoto ? setLoadingPhoto(true) : setLoadingInvoice(true);

      // on enregistre la nouvelle photo/facture
      const response = isPhoto
        ? await uploadImage(event.target.files[0])
        : await uploadFile(event.target.files[0]);
      const mediaObject = (await response?.json()) as MediaObject;
      isPhoto ? setNewPhoto(mediaObject) : setNewInvoice(mediaObject);

      // si elle existe, on supprime l'ancienne photo/facture
      if (maintenance && isPhoto && photo) {
        await mediaObjectResource.delete(photo['@id']);
      } else if (maintenance && !isPhoto && invoice) {
        await mediaObjectResource.delete(invoice['@id']);
      }
      isPhoto ? setPhoto(mediaObject) : setInvoice(mediaObject);

      // dans le cas d'une modification, on met à jour la maintenance avec la nouvelle photo/facture
      if (maintenance && mediaObject) {
        const bodyRequest: RequestBody = {};
        isPhoto
          ? (bodyRequest['photo'] = mediaObject['@id'])
          : (bodyRequest['invoice'] = mediaObject['@id']);
        maintenance = await maintenanceResource.put(
          maintenance['@id'],
          bodyRequest
        );
      }
      isPhoto ? setLoadingPhoto(false) : setLoadingInvoice(false);
    }
  };

  const handleClose = async () => {
    if (!maintenance && newPhoto) {
      await mediaObjectResource.delete(newPhoto['@id']);
    }
    if (!maintenance && newInvoice) {
      await mediaObjectResource.delete(newInvoice['@id']);
    }
    setName(null);
    setDescription(null);
    setPhoto(null);
    setInvoice(null);
    setNewPhoto(null);
    setNewInvoice(null);
    setErrorMessage(null);
    setSelectedDate(null);
    handleCloseModal();
  };

  return (
    <Dialog
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      open={openModal}
      onClose={handleClose}
      aria-labelledby="Ajouter une réparation"
      aria-describedby="popup_add_maintenance">
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Typography id="modal-modal-title" variant="h3" color="primary">
          {maintenance ? 'Détails de la réparation' : 'Ajouter une réparation'}
        </Typography>
        <IconButton aria-label="close" color="primary" onClick={handleClose}>
          <CloseIcon fontSize="large" />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box
          component="form"
          id="add-maintenance-form"
          onSubmit={handleSubmit}
          noValidate>
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
          <Box mt={1}>
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              localeText={
                frFR.components.MuiLocalizationProvider.defaultProps.localeText
              }
              adapterLocale="fr">
              <DatePicker
                format="DD-MM-YYYY"
                label="Date de la réparation"
                defaultValue={null}
                value={selectedDate && dayjs(selectedDate)}
                onChange={(newValue: string | Dayjs | null) =>
                  setSelectedDate(
                    newValue && typeof newValue !== 'string'
                      ? newValue.format('YYYY-MM-DD')
                      : null
                  )
                }
              />
            </LocalizationProvider>
          </Box>
          <TextField
            margin="normal"
            label="Description de votre réparation"
            multiline
            fullWidth
            rows={3}
            maxRows={6}
            value={description}
            inputProps={{maxLength: 3000}}
            onChange={handleChangeDescription}
          />
          <Box
            mt={1}
            display="flex"
            flexDirection="column"
            gap={isMobile ? 2 : 4}>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent={photo ? 'space-between' : 'end'}
              width={isMobile ? '100%' : '50%'}>
              <Typography variant="h5">Photo de la réparation</Typography>
              {(newPhoto || photo) && (
                <Box
                  mt={1}
                  mb={2}
                  width={isMobile ? '100%' : '200'}
                  sx={{
                    borderRadius: 6,
                    boxShadow: 4,
                    overflow: 'hidden',
                    minHeight: 150,
                  }}>
                  <img
                    width="100%"
                    height="100%"
                    src={newPhoto ? newPhoto.contentUrl : photo?.contentUrl}
                    alt="Photo de la réparation"
                    style={{objectFit: 'cover', display: 'block'}}
                  />
                </Box>
              )}
              <Button
                size="small"
                variant="outlined"
                color="secondary"
                component="label"
                startIcon={
                  loadingPhoto ? (
                    <CircularProgress size={18} color="secondary" />
                  ) : (
                    <AddAPhotoIcon />
                  )
                }
                sx={{
                  mt: 1,
                  width: 'fit-content',
                }}>
                {newPhoto || photo ? 'Changer de photo' : 'Ajouter une photo'}
                <input
                  type="file"
                  hidden
                  accept={'.png, .jpg, .jpeg'}
                  onChange={(e) => handleFileChange(e, 'photo')}
                />
              </Button>
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent={invoice ? 'space-between' : 'end'}
              width={isMobile ? '100%' : '50%'}>
              <Typography variant="h5">Votre facture</Typography>
              {(newInvoice || invoice) && (
                <a
                  href={
                    newInvoice ? newInvoice.contentUrl : invoice?.contentUrl
                  }
                  target="_blank">
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    flexDirection="column"
                    mt={1}
                    mb={2}
                    width={isMobile ? '100%' : '200'}
                    minHeight={150}
                    bgcolor="lightsecondary.main"
                    sx={{
                      borderRadius: 6,
                      boxShadow: 4,
                      overflow: 'hidden',
                    }}>
                    <InsertDriveFileIcon
                      sx={{fontSize: 60}}
                      color="secondary"
                    />
                    <Typography color="secondary" align="center">
                      {newInvoice ? newInvoice.filePath : invoice?.filePath}
                    </Typography>
                  </Box>
                </a>
              )}
              <Button
                size="small"
                variant="outlined"
                color="secondary"
                component="label"
                startIcon={
                  loadingInvoice ? (
                    <CircularProgress size={18} color="secondary" />
                  ) : (
                    <NoteAddIcon />
                  )
                }
                sx={{
                  mt: 1,
                  width: 'fit-content',
                }}>
                {newInvoice || invoice
                  ? 'Changer de facture'
                  : 'Ajouter une facture'}
                <input
                  type="file"
                  hidden
                  accept={
                    '.pdf, .doc, .docx, .odt, .xls, .csv, .png, .jpg, .jpeg'
                  }
                  onChange={(e) => handleFileChange(e, 'invoice')}
                />
              </Button>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{p: 2}}>
        <Box display="flex" flexDirection="column" justifyContent="end">
          <Button
            type="submit"
            form="add-maintenance-form"
            variant="contained"
            startIcon={
              pendingAdd && <CircularProgress sx={{color: 'white'}} size={18} />
            }
            disabled={!name}>
            {maintenance && user
              ? `${isMobile ? 'Enregistrer' : 'Enregistrer les modifications'}`
              : `${isMobile ? 'Ajouter' : 'Ajouter cette réparation'}`}
          </Button>
          {errorMessage && (
            <Typography variant="body1" color="error" textAlign="end" pt={2}>
              {errorMessage}
            </Typography>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default ModalAddMaintenance;
