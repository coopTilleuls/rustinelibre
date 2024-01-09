import React, {useContext, useRef, useState} from 'react';
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
import {capitalizeFirstLetter} from '@helpers/capitalizeFirstLetter';

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
            <InputLabel sx={{pb: 1}}>Pour quel type de vélo ?*</InputLabel>
            <FormControl variant="standard" sx={{width: '100%'}}>
              <Select
                variant="filled"
                sx={{
                  borderRadius: '10px',
                  '& .MuiFilledInput-input': {py: 2, color: 'grey.500'},
                }}
                label="Pour quel type de vélo ?"
                labelId="sort-results-label"
                id="sort-results"
                displayEmpty
                value={
                  selectedBike
                    ? selectedBike['name']
                    : 'Sélectionnez un type de vélo'
                }
                onChange={handleBikeChange}
                disableUnderline>
                <MenuItem
                  sx={{display: 'none'}}
                  value="Sélectionnez un type de vélo"
                  disabled>
                  Sélectionnez un type de vélo
                </MenuItem>
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
            <InputLabel sx={{pb: 1}}>Dans quelle ville ?*</InputLabel>
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
                  : capitalizeFirstLetter(`${city.name}`) +
                    ' ' +
                    `(${city.postcode})`
              }
              onChange={(event, value) => handleSelectedCity(value as City)}
              onInputChange={(event, value) => setCityInput(value)}
              renderInput={(params) => (
                <TextField
                  placeholder="Ex: Lille"
                  sx={{'& .MuiFilledInput-root': {borderRadius: '10px', py: 1}}}
                  variant="filled"
                  required
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
