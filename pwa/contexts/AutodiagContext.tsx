import React, {createContext, ReactNode, useState} from 'react';
import {Appointment} from "@interfaces/Appointment";
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
    setPhoto: (value: MediaObject) => void,
}

const initialValue = {
    tunnelStep: 'choice',
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
    const [tunnelStep, setTunnelStep] = useState<string>('bike_selection');
    const [prestation, setPrestation] = useState<string>('Entretien classique');
    const [appointment, setAppointment] = useState<Appointment|null>(null);
    const [autoDiagnostic, setAutoDiagnostic] = useState<AutoDiagnostic|null>(null);
    const [photo, setPhoto] = useState<MediaObject|null>(null);

    return (
        <AutodiagContext.Provider
            value={{
                tunnelStep,
                prestation,
                appointment,
                autoDiagnostic,
                photo,
                setTunnelStep,
                setPrestation,
                setAppointment,
                setAutoDiagnostic,
                setPhoto,
            }}
        >
            {children}
        </AutodiagContext.Provider>
    );
};
