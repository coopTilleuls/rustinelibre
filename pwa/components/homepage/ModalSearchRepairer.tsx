import React, {useContext, useRef} from 'react';
import router from 'next/router';
import {SearchRepairerContext} from '@contexts/SearchRepairerContext';
import {
  Modal,
  Box,
  Autocomplete,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  SelectChangeEvent,
} from '@mui/material';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import {BikeType} from '@interfaces/BikeType';
import {City} from '@interfaces/City';

type ModalSearchRepairerProps = {
  openModal: boolean;
  bikeTypes: BikeType[];
  handleCloseModal: () => void;
  citiesList: City[];
};

const ModalSearchRepairer = ({
  openModal,
  bikeTypes,
  handleCloseModal,
  citiesList,
}: ModalSearchRepairerProps): JSX.Element => {
  const listContainerRef = useRef<HTMLDivElement>(null);

  const {city, setCity, selectedBike, setSelectedBike, setCityInput} =
    useContext(SearchRepairerContext);

  const handleBikeChange = (event: SelectChangeEvent): void => {
    const selectedBikeType = bikeTypes.find(
      (bt) => bt.name === event.target.value
    );
    setSelectedBike(selectedBikeType ? selectedBikeType : null);
  };

  const closeAndReset = () => {
    handleCloseModal();
    setSelectedBike(null);
    setCity(null);
  };

  const handleSelectedCity = (value: City) => {
    setCity(value);
    router.push('/reparateur/chercher-un-reparateur');
  };

  return (
    <Modal
      open={openModal}
      onClose={closeAndReset}
      aria-labelledby="Chercher un réparateur"
      aria-describedby="popup_search_repairer">
      <Box
        position="absolute"
        width="100%"
        height="50%"
        boxShadow={24}
        sx={{
          backgroundColor: 'background.paper',
        }}>
        <Box p={4} display="flex" alignItems="center" gap={4}>
          <ArrowBackIosNewRoundedIcon
            color="primary"
            onClick={selectedBike ? () => setSelectedBike(null) : closeAndReset}
          />
          <Typography fontWeight={600}>Je trouve un réparateur</Typography>
        </Box>
        {!selectedBike && (
          <Box px={4}>
            <FormControl variant="standard" sx={{width: '100%'}}>
              <InputLabel id="sort-results-label">
                Pour quel type de vélo
              </InputLabel>
              <Select
                label="Pour quel type de vélo"
                labelId="sort-results-label"
                id="sort-results"
                displayEmpty
                value={selectedBike ? selectedBike['name'] : ''}
                onChange={handleBikeChange}
                disableUnderline>
                {bikeTypes.map((bike) => (
                  <MenuItem key={bike.id} value={bike.name}>
                    {bike.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}
        {selectedBike && !city && (
          <Box px={4}>
            <Autocomplete
              filterOptions={(options, state) => options}
              sx={{width: '100%'}}
              ref={listContainerRef}
              freeSolo
              value={city}
              options={citiesList}
              getOptionLabel={(city) =>
                typeof city === 'string'
                  ? city
                  : `${city.name}  (${city.postcode})`
              }
              onChange={(event, value) => handleSelectedCity(value as City)}
              onInputChange={(event, value) => setCityInput(value)}
              renderInput={(params) => (
                <TextField
                  variant="standard"
                  required
                  label="Dans quelle ville ?"
                  {...params}
                  InputProps={{
                    ...params.InputProps,
                    disableUnderline: true,
                  }}
                />
              )}
            />
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default ModalSearchRepairer;
