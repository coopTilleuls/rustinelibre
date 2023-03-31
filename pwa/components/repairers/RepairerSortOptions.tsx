import React, {ChangeEvent, useState} from "react";
import {Repairer} from "../../interfaces/Repairer";
import {formatDate} from 'helpers/dateHelper';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const sortOptions: Record<string, string> = {
    "availability": 'Disponibilité',
    "repairersType": 'Type de réparateur',
    "proximity": 'Proximité'
};

interface RepairerSortOptionsProps {
    handleChangeSort: any;
}

const RepairerSortOptions = ({handleChangeSort}: RepairerSortOptionsProps): JSX.Element => {

    const [sortChosen, setSortChosen] = useState<string>('availability');

    const handleSelect = (event: SelectChangeEvent) => {
        setSortChosen(event.target.value);
        handleChangeSort(event.target.value);
    };

    return (
        <div>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Filtrer vos résultats</InputLabel>
                <Select
                    labelId="select_sort_option"
                    id="select_sort_option"
                    label="Filtrer vos résultats"
                    onChange={handleSelect}
                    value={sortChosen}
                >
                    {Object.entries(sortOptions).map(([key, option]) => (
                        <MenuItem key={key} value={key}>
                            {option}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    )
};

export default RepairerSortOptions;
