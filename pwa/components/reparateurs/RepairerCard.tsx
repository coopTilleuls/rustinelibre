import Link from 'next/link';
import React from "react";
import {Repairer} from "../../interfaces/Repairer";

interface RepairerProps {
    repairer: Repairer;
}

export const RepairerCard = ({repairer}: RepairerProps): JSX.Element => {

    console.log(repairer.firstSlotAvailable);
    console.log(typeof repairer.firstSlotAvailable);

    return (
        <div className="max-w-sm rounded overflow-hidden shadow-lg mb-10">
                <div className="px-6 py-4">
                    <div className="font-bold text-xl mb-2">Un réparateur </div>
                    <p className="text-gray-700 text-base">
                        {repairer.street}  <br/>
                        {repairer.postcode} {repairer.city}
                    </p>
                    {
                        repairer.firstSlotAvailable !== undefined ?
                        <p>
                            <strong>Prochaine disponibilité : </strong>
                            {new Date(repairer.firstSlotAvailable.date).toLocaleDateString()} -
                            {new Date(repairer.firstSlotAvailable.date).toLocaleTimeString()}
                        </p> : 'Pas de créneau indiqué'
                    }
                </div>
        </div>
    )
};
