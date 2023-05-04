import React, {useContext, useEffect} from 'react';
import dynamic from 'next/dynamic';
import InputLabel from '@mui/material/InputLabel';
import {RepairerFormContext} from '@contexts/RepairerFormContext';
const Editor = dynamic(() => import('@components/form/Editor'), {
    ssr: false,
});
import {Repairer} from '@interfaces/Repairer';

interface OpeningHoursProps {
    repairer: Repairer | null;
}

export const OpeningHours = ({repairer}: OpeningHoursProps): JSX.Element => {
    const {openingHours, setOpeningHours} = useContext(RepairerFormContext);

    useEffect(() => {
        if (repairer) {
            setOpeningHours(repairer.openingHours ?? '');
        }
    }, [repairer, setOpeningHours]);

    return (
        <>
            <InputLabel sx={{mb: -2, ml: 1}}>Horaires d&apos;ouverture</InputLabel>
            <Editor content={openingHours} setContent={setOpeningHours} />
        </>
    );
};

export default OpeningHours;
