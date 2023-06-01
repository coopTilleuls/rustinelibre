export interface User {
    '@id': string;
    '@type': string;
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    roles: string[];
    repairer: string,
    plainPassword: string;
    lastConnect?: string;
    emailConfirmed: boolean;
}
