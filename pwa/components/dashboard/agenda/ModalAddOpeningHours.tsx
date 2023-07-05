import React, {useState} from 'react';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {CircularProgress} from '@mui/material';
import {RequestBody} from '@interfaces/Resource';
import {openingHoursResource} from '@resources/openingHours';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import {errorRegex} from '@utils/errorRegex';

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

  return (
    <Modal
      open={openModal}
      onClose={() => handleCloseModal(false)}
      aria-labelledby="Ajouter une plage horaire"
      aria-describedby="popup_add_opening">
      <Box sx={style}>
        <Box sx={{mt: 1}}>
          <Box sx={{display: 'flex', marginLeft: '20%'}}>
            <Box>
              <InputLabel id="demo-simple-select-label">
                Horaire d&apos;ouverture
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={startTime}
                label="Horaire d'ouverture"
                onChange={handleChangeOpen}>
                {hoursArray.map((hour) => {
                  return (
                    <MenuItem key={hour} value={hour}>
                      {hour}
                    </MenuItem>
                  );
                })}
              </Select>
            </Box>

            <Box sx={{marginLeft: '90px'}}>
              <InputLabel id="demo-simple-select-label">
                Horaire de fermeture
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={endTime}
                label="Horaire de fermeture"
                onChange={handleChangeClose}>
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

          <Button
            type="submit"
            fullWidth
            variant="outlined"
            sx={{mt: 3, mb: 2}}
            onClick={handleSubmit}>
            {!pendingAdd ? (
              'Ajouter cette plage horaire'
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

export default ModalAddOpeningHours;
