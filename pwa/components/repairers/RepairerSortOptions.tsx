import React, {useState} from "react";
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

interface RepairerSortOptionsProps {
    handleChangeSort: any;
}

const sortOptions = [
    'availability',
    'repairersType',
    'proximity'
];

const RepairerSortOptions = ({handleChangeSort}: RepairerSortOptionsProps): JSX.Element => {

    const [sortChosen, setSortChosen] = useState<string>('availability');


    return (
        <div>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Age</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Age"
                    onChange={handleChangeSort}
                >
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                </Select>
            </FormControl>
        </div>
    )
};

export default RepairerSortOptions;
