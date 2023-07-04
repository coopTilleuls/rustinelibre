import React, {useState} from 'react';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {CircularProgress} from '@mui/material';
import {RequestBody} from '@interfaces/Resource';
import InputLabel from '@mui/material/InputLabel';
import {SelectChangeEvent} from '@mui/material/Select';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {Moment} from 'moment';
import {exceptionalClosureResource} from '@resources/exceptionalClosingResource';
import {errorRegex} from "@utils/errorRegex";

const hoursArray: string[] = [];
for (let i = 0; i <= 23; i++) {
  for (let j = 0; j <= 1; j++) {
    let hour: string = i.toString().padStart(2, '0');
    let minute: string = (j * 30).toString().padStart(2, '0');
    hoursArray.push(`${hour}:${minute}`);
  }
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

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

  const handleChangStartDate = (event: SelectChangeEvent) => {
    setStartDate(event.target.value);
  };

  const handleChangeEndDate = (event: SelectChangeEvent) => {
    setEndDate(event.target.value);
  };

  return (
    <Modal
      open={openModal}
      onClose={() => handleCloseModal(false)}
      aria-labelledby="Ajouter une plage horaire"
      aria-describedby="popup_add_bike">
      <Box sx={style}>
        <Box sx={{mt: 1}}>
          <Box sx={{display: 'flex'}}>
            <Box>
              <InputLabel id="demo-simple-select-label">
                Début de la fermeture
              </InputLabel>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  format="DD-MM-YYYY"
                  label="Début de la fermeture"
                  value={startDate}
                  onChange={(newValue: string | Moment | null) =>
                    setStartDate(
                      newValue && typeof newValue !== 'string'
                        ? newValue.format('YYYY-MM-DD')
                        : null
                    )
                  }
                />
              </LocalizationProvider>
            </Box>

            <Box sx={{marginLeft: '90px'}}>
              <InputLabel id="demo-simple-select-label">
                Fin de la fermeture (incluse)
              </InputLabel>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  format="DD-MM-YYYY"
                  label="Fin"
                  value={endDate}
                  onChange={(newValue: string | Moment | null) =>
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

          <Button
            type="submit"
            fullWidth
            variant="outlined"
            sx={{mt: 3, mb: 2}}
            onClick={handleSubmit}>
            {!pendingAdd ? (
              'Ajouter cette période'
            ) : (
              <CircularProgress size={20} />
            )}
          </Button>
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

export default ModalAddExceptionalClosure;
