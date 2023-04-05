import React, {useEffect, useState} from "react";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import {repairerTypeResource} from "../../resources/repairerTypeResource";
import {RepairerType} from "../../interfaces/RepairerType";
import useRepairerTypes from "../../hooks/useRepairerTypes";

const sortOptions: Record<string, string> = {
    "availability": 'Par disponibilité',
    "repairersType": 'Par type de réparateur',
    "proximity": 'Par proximité'
};

interface RepairerSortOptionsProps {
    sortChosen: string;
    handleChangeSort: (newSortSelected: string) => void;
    isMobile: boolean;
    repairerTypeSelected: string;
    setRepairerTypeSelected: (newRepairerTypeSelected: string) => void;
}

const RepairerSortOptions = ({sortChosen, handleChangeSort, isMobile, repairerTypeSelected, setRepairerTypeSelected}: RepairerSortOptionsProps): JSX.Element => {

    const repairerTypes = useRepairerTypes();

    const handleSelectSortOption = (event: SelectChangeEvent) => {
        handleChangeSort(event.target.value);
    };

    const handleSelectRepairerType = (event: SelectChangeEvent) => {
        setRepairerTypeSelected(event.target.value);
    };

    return (
        <div style={{display: 'inline-flex'}}>
            <FormControl style={{ width: (sortChosen === 'repairersType' && !isMobile) ? '50%' : '100%' }}>
                <InputLabel id="demo-simple-select-label">Filtrer vos résultats</InputLabel>
                <Select
                    labelId="select_sort_option"
                    id="select_sort_option"
                    label="Filtrer vos résultats"
                    onChange={handleSelectSortOption}
                    value={sortChosen}
                >
                    {Object.entries(sortOptions).map(([key, option]) => (
                        <MenuItem key={key} value={key}>
                            {option}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            {
                sortChosen === 'repairersType' &&
                <FormControl style={{ width: (sortChosen === 'repairersType' && !isMobile) ? '50%' : '100%', marginLeft: '10px' }}>
                    <InputLabel id="demo-simple-select-label">Choisissez un type de réparateur</InputLabel>
                    <Select
                        labelId="select_sort_type_option"
                        id="select_sort_type_option"
                        label="Choisissez un type de réparateur"
                        onChange={handleSelectRepairerType}
                        value={repairerTypeSelected}
                    >
                        {repairerTypes.map((repairerType) => (
                            <MenuItem key={repairerType.id} value={repairerType.id}>{repairerType.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            }
        </div>
    )
};

export default RepairerSortOptions;
