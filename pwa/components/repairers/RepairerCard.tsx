import React from "react";
import {Repairer} from "../../interfaces/Repairer";
import {formatDate} from 'helpers/dateHelper';

interface RepairerProps {
    repairer: Repairer;
    isSelect: boolean;
}

export const RepairerCard = ({repairer, isSelect}: RepairerProps): JSX.Element => {

    return (
        <div className={`max-w-sm rounded overflow-hidden shadow-lg mb-10 ${isSelect && 'bg-green-400'}`}>
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">{repairer.name}</div>
                <p className="text-gray-700 text-base">
                    {repairer.street}  <br/>
                    {repairer.postcode} {repairer.city}
                </p>
                {
                    repairer.firstSlotAvailable !== undefined ?
                    <p>
                        <strong>Prochaine disponibilité : </strong>
                        {formatDate(repairer.firstSlotAvailable.date)}
                    </p> : 'Pas de créneau indiqué'
                }
            </div>
        </div>
    )
};
