import React, {createContext, ReactNode, useState} from 'react';
import {City} from "@interfaces/City";
import {BikeType} from "@interfaces/BikeType";
import useBikeTypes from "@hooks/useBikeTypes";
import {RepairerType} from "@interfaces/RepairerType";
import useRepairerTypes from "@hooks/useRepairerTypes";
import {MediaObject} from "@interfaces/MediaObject";

interface ProviderProps {
    children: ReactNode;
}

interface RepairerFormContext {
    name: string,
    description: string,
    street: string,
    mobilePhone: string,
    cityInput: string,
    latitude: string,
    longitude: string,
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
    thumbnail: MediaObject|null,
    descriptionPicture: MediaObject|null,
    setName: (value: string) => void,
    setDescription: (value: string) => void,
    setStreet: (value: string) => void,
    setMobilePhone: (value: string) => void,
    setCityInput: (value: string) => void,
    setLatitude: (value: string) => void,
    setLongitude: (value: string) => void,
    setCity: (value: City|null) => void,
    setCitiesList: (value: City[]) => void,
    setTimeoutId: (value: number) => void,
    setRepairerTypeSelected: (value: RepairerType|null) => void,
    setPendingRegistration: (value: boolean) => void,
    setErrorMessage: (value: string|null) => void,
    setSelectedBikeTypes: (value: string[]) => void,
    setOpeningHours: (value: string) => void,
    setOptionalPage: (value: string) => void,
    setThumbnail: (value: MediaObject|null) => void,
    setDescriptionPicture: (value: MediaObject|null) => void,
}

const initialValue = {
    name: '',
    mobilePhone: '',
    description: '',
    street: '',
    cityInput: '',
    latitude: '',
    longitude: '',
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
    thumbnail: null,
    descriptionPicture: null,
    setName: () => null,
    setMobilePhone: () => null,
    setDescription: () => null,
    setStreet: () => null,
    setCityInput: () => null,
    setLatitude: () => null,
    setLongitude: () => null,
    setCity: () => null,
    setCitiesList: () => [],
    setTimeoutId: () => null,
    setRepairerTypeSelected: () => null,
    setPendingRegistration: () => null,
    setErrorMessage: () => null,
    setSelectedBikeTypes: () => null,
    setOpeningHours: () => null,
    setOptionalPage: () => null,
    setThumbnail: () => null,
    setDescriptionPicture: () => null,
};

export const RepairerFormContext = createContext<RepairerFormContext>(initialValue);

export const RepairerFormProvider = ({ children }: ProviderProps): JSX.Element => {
    const [name, setName] = useState<string>('');
    const [mobilePhone, setMobilePhone] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [street, setStreet] = useState<string>('');
    const [cityInput, setCityInput] = useState<string>('');
    const [latitude, setLatitude] = useState<string>('');
    const [longitude, setLongitude] = useState<string>('');
    const [city, setCity] = useState<City | null>(null);
    const [citiesList, setCitiesList] = useState<City[]>([]);
    const [timeoutId, setTimeoutId] = useState<number | null>(0);
    const [repairerTypeSelected, setRepairerTypeSelected] = useState<RepairerType | null>(null);
    const [pendingRegistration, setPendingRegistration] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string|null>(null);
    const [selectedBikeTypes, setSelectedBikeTypes] = useState<string[]>([]);
    const [openingHours, setOpeningHours] = useState<string>('');
    const [optionalPage, setOptionalPage] = useState<string>('');
    const [thumbnail, setThumbnail] = useState<MediaObject | null>(null);
    const [descriptionPicture, setDescriptionPicture] = useState<MediaObject | null>(null);

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
                latitude,
                longitude,
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
                thumbnail,
                descriptionPicture,
                setName,
                setMobilePhone,
                setDescription,
                setStreet,
                setCityInput,
                setLatitude,
                setLongitude,
                setCity,
                setCitiesList,
                setTimeoutId,
                setRepairerTypeSelected,
                setPendingRegistration,
                setErrorMessage,
                setSelectedBikeTypes,
                setOpeningHours,
                setOptionalPage,
                setThumbnail,
                setDescriptionPicture,
            }}
        >
            {children}
        </RepairerFormContext.Provider>
    );
};
