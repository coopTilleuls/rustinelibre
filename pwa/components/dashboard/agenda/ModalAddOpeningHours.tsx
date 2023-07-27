import React, {useState} from 'react';
import {openingHoursResource} from '@resources/openingHours';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Typography,
  InputLabel,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import useMediaQuery from '@mui/material/useMediaQuery';
import {RequestBody} from '@interfaces/Resource';
import {errorRegex} from '@utils/errorRegex';

type ModalAddOpeningHoursProps = {
  day: string;
  openModal: boolean;
  handleCloseModal: (refresh: boolean | undefined) => void;
};

const ModalAddOpeningHours = ({
  day,
  openModal,
  handleCloseModal,
}: ModalAddOpeningHoursProps): JSX.Element => {
  const [pendingAdd, setPendingAdd] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<string>('09:00');
  const [endTime, setEndTime] = useState<string>('18:00');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  let hoursArray: string[] = [];
  for (let i = 0; i <= 23; i++) {
    for (let j = 0; j <= 1; j++) {
      let hour: string = i.toString().padStart(2, '0');
      let minute: string = (j * 30).toString().padStart(2, '0');
      hoursArray.push(`${hour}:${minute}`);
    }
  }

  const handleSubmit = async (): Promise<void> => {
    if (!startTime || !endTime) {
      return;
    }
    setErrorMessage(null);
    setPendingAdd(true);
    try {
      let bodyRequest: RequestBody = {
        startTime: startTime,
        endTime: endTime,
        day: day,
      };
      await openingHoursResource.post(bodyRequest);
      handleCloseModal(true);
      setStartTime('09:00');
      setEndTime('18:00');
    } catch (e: any) {
      setErrorMessage(e.message?.replace(errorRegex, '$2'));
    }
    setPendingAdd(false);
  };

  const handleChangeOpen = (event: SelectChangeEvent) => {
    setStartTime(event.target.value);
  };

  const handleChangeClose = (event: SelectChangeEvent) => {
    setEndTime(event.target.value);
  };

  const handleClose = () => {
    setStartTime('09:00');
    setEndTime('18:00');
    setErrorMessage(null);
    handleCloseModal(false);
  };

  return (
    <Dialog
      maxWidth="sm"
      fullWidth
      open={openModal}
      onClose={handleClose}
      aria-labelledby="Ajouter les horaires d'ouverture"
      aria-describedby="modal_add_opening_hours">
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Typography id="modal-modal-title" variant="h3" color="primary">
          Ajouter une plage horaire
        </Typography>
        <IconButton aria-label="close" color="primary" onClick={handleClose}>
          <CloseIcon fontSize="large" />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box
          display="flex"
          sx={{flexDirection: isMobile ? 'column' : 'row'}}
          gap={2}>
          <Box width={isMobile ? '100%' : '50%'}>
            <InputLabel id="opening-hours-label">
              Horaire d&apos;ouverture
            </InputLabel>
            <Select
              sx={{width: '50%', mt: 1}}
              labelId="opening-hours-label"
              id="opening-hours"
              value={startTime}
              onChange={handleChangeOpen}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 200,
                    overflowY: 'auto',
                  },
                },
              }}>
              {hoursArray.map((hour) => {
                return (
                  <MenuItem key={hour} value={hour}>
                    {hour}
                  </MenuItem>
                );
              })}
            </Select>
          </Box>
          <Box width={isMobile ? '100%' : '50%'}>
            <InputLabel id="closing-hours-label">
              Horaire de fermeture
            </InputLabel>
            <Select
              sx={{width: '50%', mt: 1}}
              labelId="closing-hours-label"
              id="closing-hours"
              value={endTime}
              onChange={handleChangeClose}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 200,
                    overflowY: 'auto',
                  },
                },
              }}>
              {hoursArray.map((hour) => {
                return (
                  <MenuItem key={hour} value={hour}>
                    {hour}
                  </MenuItem>
                );
              })}
            </Select>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{p: 2}}>
        <Box display="flex" flexDirection="column" alignItems="end">
          <Button
            type="submit"
            variant="contained"
            onClick={handleSubmit}
            startIcon={
              pendingAdd && <CircularProgress size={18} sx={{color: 'white'}} />
            }>
            Ajouter cette plage horaire
          </Button>
          {errorMessage && (
            <Typography pt={1} variant="body1" color="error">
              {errorMessage}
            </Typography>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default ModalAddOpeningHours;
