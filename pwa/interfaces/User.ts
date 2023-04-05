export interface User {
    '@id': string;
    '@type': string;
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    roles: string[];
    repairers: string[],
    plainPassword: string;
    emailConfirmed: number;
}
