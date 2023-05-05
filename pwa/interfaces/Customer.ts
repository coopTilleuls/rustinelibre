import {Appointment} from '@interfaces/Appointment';

export interface Customer {
    '@id': string;
    '@type': string;
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    appointments?: Appointment[];
}
