import {User} from 'interfaces/User';

export interface Repairer {
    '@id': string;
    '@type': string;
    id: string;
    owner: User;
    description?: string;
    city?: string;
    postcode?: string;
    country?: string;
    mobilePhone?: string;
    street?: string;
    rrule: string;
    latitude?: string;
    longitude?: string;
    firstSlotAvailable?: Date
}
