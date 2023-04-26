import React, {useContext, useEffect, useState} from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import {repairerTypeResource} from '@resources/repairerTypeResource';
import {RepairerType} from '@interfaces/RepairerType';
import {SearchRepairerContext} from '@contexts/SearchRepairerContext';

const sortOptions: Record<string, string> = {
  availability: 'Par disponibilité',
  repairersType: 'Par type de réparateur',
  proximity: 'Par proximité',
};

interface RepairerSortOptionsProps {
  handleChangeSort: (newSortSelected: string) => void;
  isMobile: boolean;
}

const RepairerSortOptions = ({
  handleChangeSort,
  isMobile,
}: RepairerSortOptionsProps): JSX.Element => {
  const [repairerTypes, setRepairerTypes] = useState<RepairerType[]>([]);
  const {repairerTypeSelected, setRepairerTypeSelected, sortChosen} =
    useContext(SearchRepairerContext);

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

  const handleSelectSortOption = (event: SelectChangeEvent) => {
    handleChangeSort(event.target.value);
  };

  const handleSelectRepairerType = (event: SelectChangeEvent) => {
    setRepairerTypeSelected(event.target.value);
  };

  return (
    <>
      <FormControl sx={{width: {xs: '100%', md: '50%'}}}>
        <InputLabel id="select_sort_option" sx={{fontSize: {xs: 14, md: 16}}}>
          Filtrer vos résultats
        </InputLabel>
        <Select
          labelId="select_sort_option"
          id="select_sort_option"
          label="Filtrer vos résultats"
          onChange={handleSelectSortOption}
          value={sortChosen}>
          {Object.entries(sortOptions).map(([key, option]) => (
            <MenuItem key={key} value={key}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {sortChosen === 'repairersType' && (
        <FormControl sx={{width: {xs: '100%', md: '50%'}}}>
          <InputLabel
            id="select_sort_type_option"
            sx={{fontSize: {xs: 14, md: 16}}}>
            Choisissez un type de réparateur
          </InputLabel>
          <Select
            labelId="select_sort_type_option"
            id="select_sort_type_option"
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
    </>
  );
};

export default RepairerSortOptions;
