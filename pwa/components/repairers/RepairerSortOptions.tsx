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
  FormGroup,
  FormControlLabel,
  Checkbox,
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
  handleSelectFilters: (event: any, filterId: any) => void;
}

const RepairerSortOptions = ({
  handleSelectSortOption,
  handleSelectFilters,
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
        sx={{width: {xs: '30%', md: '30%'}, ml: {md: 2}}}
        size="small">
        <InputLabel id="filter-results-label">Filtrer</InputLabel>
        <FormGroup>
          <Select sx={{pl: 4}}>
            {repairerTypes.map((repairerType) => (
              <FormControlLabel
                sx={{display: 'flex', pl: 2}}
                key={repairerType.id}
                value={`(${repairerTypeSelected.length})`}
                control={
                  <Checkbox
                    checked={repairerTypeSelected.includes(repairerType.id)}
                    onChange={(event) =>
                      handleSelectFilters(event, repairerType.id)
                    }
                    value={repairerType.id}
                    name={`filter-${repairerType.id}`}
                  />
                }
                label={repairerType.name}
              />
            ))}
          </Select>
        </FormGroup>
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
