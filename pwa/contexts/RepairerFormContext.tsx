import React, {createContext, ReactNode, useState} from 'react';
import {City} from "@interfaces/City";
import {BikeType} from "@interfaces/BikeType";
import useBikeTypes from "@hooks/useBikeTypes";
import {RepairerType} from "@interfaces/RepairerType";
import useRepairerTypes from "@hooks/useRepairerTypes";

interface ProviderProps {
    children: ReactNode;
}

interface RepairerFormContext {
    name: string,
    description: string,
    street: string,
    mobilePhone: string,
    cityInput: string,
    city: City|null,
    citiesList: City[],
    timeoutId: number|null,
    repairerTypeSelected: RepairerType|null,
    pendingRegistration: boolean,
    errorMessage: string|null,
    selectedBikeTypes: string[],
    repairerTypes: RepairerType[],
    bikeTypes: BikeType[],
    openingHours: string,
    optionalPage: string,
    setName: (value: string) => void,
    setDescription: (value: string) => void,
    setStreet: (value: string) => void,
    setMobilePhone: (value: string) => void,
    setCityInput: (value: string) => void,
    setCity: (value: City|null) => void,
    setCitiesList: (value: City[]) => void,
    setTimeoutId: (value: number) => void,
    setRepairerTypeSelected: (value: RepairerType|null) => void,
    setPendingRegistration: (value: boolean) => void,
    setErrorMessage: (value: string|null) => void,
    setSelectedBikeTypes: (value: string[]) => void,
    setOpeningHours: (value: string) => void,
    setOptionalPage: (value: string) => void,
}

const initialValue = {
    name: '',
    mobilePhone: '',
    description: '',
    street: '',
    cityInput: '',
    city: null,
    citiesList: [],
    timeoutId: 0,
    repairerTypeSelected: null,
    pendingRegistration: false,
    errorMessage: null,
    selectedBikeTypes: [],
    repairerTypes: [],
    bikeTypes: [],
    openingHours: '',
    optionalPage: '',
    setName: () => null,
    setMobilePhone: () => null,
    setDescription: () => null,
    setStreet: () => null,
    setCityInput: () => null,
    setCity: () => null,
    setCitiesList: () => [],
    setTimeoutId: () => null,
    setRepairerTypeSelected: () => null,
    setPendingRegistration: () => null,
    setErrorMessage: () => null,
    setSelectedBikeTypes: () => null,
    setOpeningHours: () => null,
    setOptionalPage: () => null
};

export const RepairerFormContext = createContext<RepairerFormContext>(initialValue);

export const RepairerFormProvider = ({ children }: ProviderProps): JSX.Element => {
    const [name, setName] = useState<string>('');
    const [mobilePhone, setMobilePhone] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [street, setStreet] = useState<string>('');
    const [cityInput, setCityInput] = useState<string>('');
    const [city, setCity] = useState<City | null>(null);
    const [citiesList, setCitiesList] = useState<City[]>([]);
    const [timeoutId, setTimeoutId] = useState<number | null>(0);
    const [repairerTypeSelected, setRepairerTypeSelected] = useState<RepairerType | null>(null);
    const [pendingRegistration, setPendingRegistration] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string|null>(null);
    const [selectedBikeTypes, setSelectedBikeTypes] = useState<string[]>([]);
    const [openingHours, setOpeningHours] = useState<string>('');
    const [optionalPage, setOptionalPage] = useState<string>('');

    const repairerTypes = useRepairerTypes();
    const bikeTypes = useBikeTypes();

    return (
        <RepairerFormContext.Provider
            value={{
                name,
                mobilePhone,
                description,
                street,
                cityInput,
                city,
                citiesList,
                timeoutId,
                repairerTypeSelected,
                pendingRegistration,
                errorMessage,
                selectedBikeTypes,
                repairerTypes,
                bikeTypes,
                openingHours,
                optionalPage,
                setName,
                setMobilePhone,
                setDescription,
                setStreet,
                setCityInput,
                setCity,
                setCitiesList,
                setTimeoutId,
                setRepairerTypeSelected,
                setPendingRegistration,
                setErrorMessage,
                setSelectedBikeTypes,
                setOpeningHours,
                setOptionalPage,
            }}
        >
            {children}
        </RepairerFormContext.Provider>
    );
};
