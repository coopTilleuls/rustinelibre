import {User} from 'interfaces/User';
import {BikeType} from 'interfaces/BikeType';
import {DateObject} from 'interfaces/DateObject';

export interface Repairer {
    '@id': string;
    '@type': string;
    id: string;
    owner: User;
    name?: string;
    description?: string;
    city?: string;
    postcode?: string;
    country?: string;
    mobilePhone?: string;
    street?: string;
    rrule: string;
    latitude?: number;
    longitude?: number;
    firstSlotAvailable?: DateObject,
    bikeTypesSupported: BikeType[]
}
