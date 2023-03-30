import React from "react";
import {Repairer} from "../../interfaces/Repairer";
import {formatDate} from 'helpers/dateHelper';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

interface RepairerProps {
    repairer: Repairer;
    isSelect: boolean;
}

export const RepairerCard = ({repairer, isSelect}: RepairerProps): JSX.Element => {

    return (
        <Card sx={{ display: 'flex', marginBottom: '10px', backgroundColor: isSelect ? 'lightgreen' : 'white' }}>
            <CardMedia
                component="img"
                sx={{ width: 151 }}
                image="https://les-tilleuls.coop/_next/image?url=https%3A%2F%2Fapi.les-tilleuls.coop%2Fwp-content%2Fuploads%2F2021%2F08%2Fhome-tilleuls-scop-1024x783.jpeg&w=3840&q=75"
                alt="Photo du réparateur"
            />
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                    <Typography component="div" variant="h5">
                        {repairer.name}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" component="div">
                        {repairer.street}  <br/>
                        {repairer.postcode} {repairer.city}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary" component="div">
                        {
                            repairer.firstSlotAvailable !== undefined ?
                                <p>
                                    <strong>Prochaine disponibilité : </strong>
                                    {formatDate(repairer.firstSlotAvailable)}
                                </p> : 'Pas de créneau indiqué'
                        }
                    </Typography>
                </CardContent>
            </Box>
        </Card>

        // <div className={`max-w-sm rounded overflow-hidden shadow-lg mb-10 ${isSelect && 'bg-green-400'}`}>
        //     <div className="px-6 py-4">
        //         <div className="font-bold text-xl mb-2">{repairer.name}</div>
        //         <p className="text-gray-700 text-base">
        //             {repairer.street}  <br/>
        //             {repairer.postcode} {repairer.city}
        //         </p>
        //         {
        //             repairer.firstSlotAvailable !== undefined ?
        //             <p>
        //                 <strong>Prochaine disponibilité : </strong>
        //                 {formatDate(repairer.firstSlotAvailable.date)}
        //             </p> : 'Pas de créneau indiqué'
        //         }
        //     </div>
        // </div>
    )
};
