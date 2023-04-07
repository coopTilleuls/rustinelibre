import {User} from 'interfaces/User';
import {BikeType} from 'interfaces/BikeType';
import {RepairerType} from "interfaces/RepairerType";

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
    firstSlotAvailable?: string,
    bikeTypesSupported: BikeType[],
    repairerType: RepairerType,
}
