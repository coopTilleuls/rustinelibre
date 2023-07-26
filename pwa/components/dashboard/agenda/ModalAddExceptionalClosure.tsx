import React, {useState} from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import {exceptionalClosureResource} from '@resources/exceptionalClosingResource';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  useTheme,
} from '@mui/material';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import CloseIcon from '@mui/icons-material/Close';
import {frFR} from '@mui/x-date-pickers';
import useMediaQuery from '@mui/material/useMediaQuery';
import {errorRegex} from '@utils/errorRegex';
import {RequestBody} from '@interfaces/Resource';

const hoursArray: string[] = [];
for (let i = 0; i <= 23; i++) {
  for (let j = 0; j <= 1; j++) {
    let hour: string = i.toString().padStart(2, '0');
    let minute: string = (j * 30).toString().padStart(2, '0');
    hoursArray.push(`${hour}:${minute}`);
  }
}

type ModalAddExceptionalClosureProps = {
  openModal: boolean;
  handleCloseModal: (refresh: boolean | undefined) => void;
};

const ModalAddExceptionalClosure = ({
  openModal,
  handleCloseModal,
}: ModalAddExceptionalClosureProps): JSX.Element => {
  const [pendingAdd, setPendingAdd] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleSubmit = async (): Promise<void> => {
    if (!startDate || !endDate) {
      return;
    }
    setErrorMessage(null);
    setPendingAdd(true);
    try {
      let bodyRequest: RequestBody = {
        startDate: startDate,
        endDate: endDate,
      };
      await exceptionalClosureResource.post(bodyRequest);
      handleCloseModal(true);
      setStartDate(null);
      setEndDate(null);
    } catch (e: any) {
      setErrorMessage(e.message?.replace(errorRegex, '$2'));
    }
    setPendingAdd(false);
  };

  const handleClose = () => {
    setStartDate(null);
    setEndDate(null);
    setErrorMessage(null);
    handleCloseModal(false);
  };

  return (
    <Dialog
      maxWidth="sm"
      fullWidth
      open={openModal}
      onClose={handleClose}
      aria-labelledby="Ajouter une fermeture exceptionnelle"
      aria-describedby="modal_add_exceptional_closure">
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Typography id="modal-modal-title" variant="h3" color="primary">
          Ajouter une fermeture
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
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              localeText={
                frFR.components.MuiLocalizationProvider.defaultProps.localeText
              }
              adapterLocale="fr">
              <DatePicker
                sx={{width: '100%'}}
                format="DD-MM-YYYY"
                label="Jour début"
                value={startDate}
                onChange={(newValue: string | dayjs.Dayjs | null) =>
                  setStartDate(
                    newValue && typeof newValue !== 'string'
                      ? newValue.format('YYYY-MM-DD')
                      : null
                  )
                }
              />
            </LocalizationProvider>
          </Box>
          <Box width={isMobile ? '100%' : '50%'}>
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              localeText={
                frFR.components.MuiLocalizationProvider.defaultProps.localeText
              }
              adapterLocale="fr">
              <DatePicker
                sx={{width: '100%'}}
                format="DD-MM-YYYY"
                label="Jour fin (inclus)"
                value={endDate}
                onChange={(newValue: string | dayjs.Dayjs | null) =>
                  setEndDate(
                    newValue && typeof newValue !== 'string'
                      ? newValue.format('YYYY-MM-DD')
                      : null
                  )
                }
              />
            </LocalizationProvider>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{p: 2}}>
        <Box display="flex" flexDirection="column" alignItems="end">
          <Button
            type="submit"
            variant="contained"
            onClick={handleSubmit}
            sx={{width: 'fit-content'}}
            startIcon={
              pendingAdd && <CircularProgress size={18} sx={{color: 'white'}} />
            }>
            Ajouter cette période
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

export default ModalAddExceptionalClosure;
