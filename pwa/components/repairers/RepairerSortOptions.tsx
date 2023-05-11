import React, {useContext, useEffect, useState} from 'react';
import {repairerTypeResource} from '@resources/repairerTypeResource';
import {SearchRepairerContext} from '@contexts/SearchRepairerContext';
import {
  Box,
  Button,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import {RepairerType} from '@interfaces/RepairerType';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';

const sortOptions: Record<string, string> = {
  availability: 'Disponibilité',
  proximity: 'Proximité',
};

interface RepairerSortOptionsProps {
  isMobile: boolean;
  handleSelectSortOption: (event: SelectChangeEvent) => Promise<void>;
  handleSelectFilterOption: (event: SelectChangeEvent) => Promise<void>;
}

const RepairerSortOptions = ({
  handleSelectSortOption,
  handleSelectFilterOption,
}: RepairerSortOptionsProps): JSX.Element => {
  const [repairerTypes, setRepairerTypes] = useState<RepairerType[]>([]);
  const {
    repairers,
    repairerTypeSelected,
    setRepairerTypeSelected,
    sortChosen,
    showMap,
    setShowMap,
  } = useContext(SearchRepairerContext);

  useEffect(() => {
    const fetchRepairerTypes = async () => {
      const response = await repairerTypeResource.getAll(false);
      setRepairerTypes(response['hydra:member']);
      if (response['hydra:totalItems'] > 0) {
        setRepairerTypeSelected(response['hydra:member'][0].id.toString());
      }
    };

    fetchRepairerTypes();
  }, [setRepairerTypeSelected]);

  return (
    <Box
      display="flex"
      justifyContent={{xs: 'space-between', md: 'start'}}
      alignItems="center"
      width="100%"
      pt={{xs: 2, md: 5}}>
      <FormControl sx={{width: {xs: '30%', md: '20%'}}} size="small">
        <InputLabel id="sort-results-label">Trier</InputLabel>
        <Select
          sx={{
            '& .MuiSelect-select': {fontSize: {xs: 12, md: 16}},
          }}
          label="trier"
          labelId="sort-results-label"
          id="sort-results"
          onChange={handleSelectSortOption}
          value={sortChosen}>
          <MenuItem disabled value="">
            <em>Trier</em>
          </MenuItem>
          {Object.entries(sortOptions).map(([key, option]) => (
            <MenuItem key={key} value={key}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl
        sx={{width: {xs: '30%', md: '20%'}, ml: {md: 2}}}
        size="small">
        <InputLabel id="filter-results-label">Filtrer</InputLabel>
        <Select
          sx={{
            '& .MuiSelect-select': {fontSize: {xs: 12, md: 16}},
          }}
          label="Filtrer"
          labelId="filter-results-label"
          id="filter-results"
          onChange={handleSelectFilterOption}
          value={repairerTypeSelected}>
          <MenuItem disabled value="">
            <em>Filtrer</em>
          </MenuItem>
          {repairerTypes.map((repairerType) => (
            <MenuItem key={repairerType.id} value={repairerType.id}>
              {repairerType.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {repairers.length ? (
        <Button
          sx={{
            border: '2px solid',
            borderColor: 'primary.main',
            fontSize: {xs: 12, md: 16},
            borderRadius: '5px',
            width: '30%',
            display: {md: 'none'},
            textTransform: 'capitalize',
          }}
          onClick={() => setShowMap(!showMap)}
          variant="contained">
          {showMap ? (
            <FormatListBulletedOutlinedIcon sx={{color: 'white'}} />
          ) : (
            <MapOutlinedIcon sx={{color: 'white'}} />
          )}
        </Button>
      ) : null}
    </Box>
  );
};

export default RepairerSortOptions;
