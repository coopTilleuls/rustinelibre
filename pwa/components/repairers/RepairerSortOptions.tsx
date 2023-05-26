import React, {useContext} from 'react';
import {SearchRepairerContext} from '@contexts/SearchRepairerContext';
import {
  Box,
  Button,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  SelectChangeEvent,
  Checkbox,
} from '@mui/material';
import {RepairerType} from '@interfaces/RepairerType';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';

import OutlinedInput from '@mui/material/OutlinedInput';
import ListItemText from '@mui/material/ListItemText';


const sortOptions: Record<string, string> = {
  availability: 'Disponibilité',
  proximity: 'Proximité',
};

interface RepairerSortOptionsProps {
  isMobile: boolean;
  handleSelectSortOption: (event: SelectChangeEvent) => Promise<void>;
  handleChangeRepairerType: (e: any) => void,
  repairerTypes: RepairerType[],
}

const RepairerSortOptions = ({
  handleSelectSortOption,
  handleChangeRepairerType,
  repairerTypes,
}: RepairerSortOptionsProps): JSX.Element => {

  const {
    repairers,
    sortChosen,
    showMap,
    setShowMap,
      repairerTypeSelected
  } = useContext(SearchRepairerContext);

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
          sx={{width: {xs: '30%', md: '30%'}, ml: {md: 2}}}
          size="small">
          <InputLabel id="filter-results-label">Type de réparateur</InputLabel>
          <Select
              labelId="Select multiple repairer type"
              id="multiple_select_repairer_type"
              multiple
              value={repairerTypeSelected}
              onChange={handleChangeRepairerType}
              input={<OutlinedInput label="Type de réparateur" />}
              renderValue={(selected) => selected.join(', ')}
          >
            {repairerTypes.map((repairerType) => (
                <MenuItem key={repairerType.id} value={repairerType.name}>
                  <Checkbox checked={repairerTypeSelected.indexOf(repairerType.name) > -1} />
                  <ListItemText primary={repairerType.name} />
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
