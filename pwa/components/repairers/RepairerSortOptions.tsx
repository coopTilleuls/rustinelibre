import React, {useContext, useEffect, useState} from 'react';
import {repairerTypeResource} from '@resources/repairerTypeResource';
import {SearchRepairerContext} from '@contexts/SearchRepairerContext';
import {
  Box,
  Button,
  Typography,
  FormControl,
  MenuItem,
  InputLabel,
} from '@mui/material';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import {RepairerType} from '@interfaces/RepairerType';

const sortOptions: Record<string, string> = {
  availability: 'Disponibilité',
  proximity: 'Proximité',
  repairersType: 'Réparateur',
};

interface RepairerSortOptionsProps {
  isMobile: boolean;
}

const RepairerSortOptions = ({
  isMobile,
}: RepairerSortOptionsProps): JSX.Element => {
  const [repairerTypes, setRepairerTypes] = useState<RepairerType[]>([]);
  const {
    city,

    repairerTypeSelected,
    setRepairerTypeSelected,
    setOrderBy,
    sortChosen,
    setSortChosen,
  } = useContext(SearchRepairerContext);

  useEffect(() => {
    async function fetchRepairerTypes() {
      const response = await repairerTypeResource.getAll(false);
      setRepairerTypes(response['hydra:member']);
      if (response['hydra:totalItems'] > 0) {
        setRepairerTypeSelected(response['hydra:member'][0].id.toString());
      }
    }

    fetchRepairerTypes();
  }, [setRepairerTypeSelected]);

  const handleSelectRepairerType = (event: SelectChangeEvent) => {
    setRepairerTypeSelected(event.target.value);
  };

  const handleChangeSort = (sortOption: string): void => {
    setSortChosen(sortOption);

    let value = '';
    if (sortOption === 'repairersType') {
      value = repairerTypeSelected;
    } else if (sortOption === 'availability') {
      value = 'ASC';
    } else if (sortOption === 'proximity') {
      value = `${city?.lat},${city?.lon}`;
    }

    setOrderBy({
      key: sortOption,
      value: value,
    });
  };

  return (
    <>
      <Typography
        id="sort-results-label"
        sx={{mt: {xs: 2, md: 0}, fontSize: {xs: 14, md: 16}}}>
        Filtrer vos résultats par :
      </Typography>
      <Box
        display="flex"
        flexDirection={{xs: 'column', md: 'row'}}
        alignItems="center">
        <Box display="flex" alignItems="center">
          {Object.entries(sortOptions).map(([key, option]) => (
            <Button
              type="submit"
              variant={sortChosen === key ? 'contained' : 'outlined'}
              sx={{textTransform: 'capitalize', mr: 1, my: 1}}
              key={key}
              value={key}
              onClick={() => handleChangeSort(key)}>
              {option}
            </Button>
          ))}
        </Box>
        {sortChosen === 'repairersType' && (
          <FormControl
            sx={{mt: {xs: 1, md: 0}, width: {xs: '100%', md: '20%'}}}>
            <InputLabel
              id="repairer-type-label"
              sx={{fontSize: {xs: 14, md: 16}}}>
              Choisissez un type de réparateur
            </InputLabel>
            <Select
              size="small"
              labelId="repairer-type-label"
              id="repairer-type"
              label="Choisissez un type de réparateur"
              onChange={handleSelectRepairerType}
              value={repairerTypeSelected}>
              {repairerTypes.map((repairerType) => (
                <MenuItem key={repairerType.id} value={repairerType.id}>
                  {repairerType.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>
    </>
  );
};

export default RepairerSortOptions;
