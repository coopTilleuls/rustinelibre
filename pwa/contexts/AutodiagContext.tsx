import React, {createContext, ReactNode, useState} from 'react';
import {Repairer} from "@interfaces/Repairer";
import {City} from "@interfaces/City";
import {BikeType} from "@interfaces/BikeType";
import {Appointment} from "@interfaces/Appointment";
import App from "next/app";
import {AutoDiagnostic} from "@interfaces/AutoDiagnostic";
import {MediaObject} from "@interfaces/MediaObject";

interface ProviderProps {
    children: ReactNode;
}

interface AutodiagContext {
    tunnelStep: string,
    prestation: string,
    appointment: Appointment|null,
    autoDiagnostic: AutoDiagnostic|null,
    photo: MediaObject|null,
    setTunnelStep: (value: string) => void,
    setPrestation: (value: string) => void,
    setAppointment: (value: Appointment) => void,
    setAutoDiagnostic: (value: AutoDiagnostic) => void,
    setPhoto: (value: MediaObject|null) => void,
}

const initialValue = {
    tunnelStep: 'yesOrNo',
    prestation: 'Entretien classique',
    appointment: null,
    autoDiagnostic: null,
    photo: null,
    setTunnelStep: () => null,
    setPrestation: () => null,
    setAppointment: () => null,
    setAutoDiagnostic: () => null,
    setPhoto: () => null,
};

export const AutodiagContext = createContext<AutodiagContext>(initialValue);

export const AutodiagProvider = ({ children }: ProviderProps): JSX.Element => {
    const [cityInput, setCityInput] = useState<string>('');
    const [selectedRepairer, setSelectedRepairer] = useState<string>('');
    const [city, setCity] = useState<City | null>(null);
    const [selectedBike, setSelectedBike] = useState<BikeType | null>(null);
    const [showMap, setShowMap] = useState<boolean>(false);
    const [repairers, setRepairers] = useState<Repairer[]>([]);
    const [repairerTypeSelected, setRepairerTypeSelected] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [orderBy, setOrderBy] = useState<OrderByOption|null>(null);
    const [sortChosen, setSortChosen] = useState<string>('availability');
    const [totalItems, setTotalItems] = useState<number>(0);

    return (
        <AutodiagContext.Provider
            value={{
                cityInput,
                selectedRepairer,
                city,
                selectedBike,
                showMap,
                repairers,
                currentPage,
                repairerTypeSelected,
                orderBy,
                sortChosen,
                totalItems,
                setRepairers,
                setCityInput,
                setShowMap,
                setSelectedBike,
                setSelectedRepairer,
                setCity,
                setCurrentPage,
                setRepairerTypeSelected,
                setOrderBy,
                setSortChosen,
                setTotalItems,
            }}
        >
            {children}
        </AutodiagContext.Provider>
    );
};
