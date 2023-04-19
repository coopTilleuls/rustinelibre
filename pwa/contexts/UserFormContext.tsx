import React, {createContext, ReactNode, useState} from 'react';

interface ProviderProps {
    children: ReactNode;
}

interface UserFormContext {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    emailError: boolean,
    passwordError: boolean,
    emailHelperText: string,
    passwordInfo: string,
    setFirstName: (value: string) => void,
    setLastName: (value: string) => void,
    setEmail: (value: string) => void,
    setPassword: (value: string) => void,
    setEmailError: (value: boolean) => void,
    setPasswordError: (value: boolean) => void,
    setEmailHelperText: (value: string) => void,
    setPasswordInfo: (value: string) => void,
}

const initialValue = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    emailError: false,
    passwordError: false,
    emailHelperText: '',
    passwordInfo: '',
    setFirstName: () => null,
    setLastName: () => null,
    setEmail: () => null,
    setPassword: () => null,
    setEmailError: () => [],
    setPasswordError: () => null,
    setEmailHelperText: () => null,
    setPasswordInfo: () => null,
};

export const UserFormContext = createContext<UserFormContext>(initialValue);

export const UserFormProvider = ({ children }: ProviderProps): JSX.Element => {
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordError, setPasswordError] = useState<boolean>(false);
    const [emailError, setEmailError] = useState<boolean>(false);
    const [emailHelperText, setEmailHelperText] = useState<string>('');
    const [passwordInfo, setPasswordInfo] = useState<string>('');

    return (
        <UserFormContext.Provider
            value={{
                firstName,
                lastName,
                email,
                password,
                emailError,
                passwordError,
                emailHelperText,
                passwordInfo,
                setFirstName,
                setLastName,
                setEmail,
                setPassword,
                setEmailError,
                setPasswordError,
                setEmailHelperText,
                setPasswordInfo,
            }}
        >
            {children}
        </UserFormContext.Provider>
    );
};
