import {User} from '@interfaces/User';
import {BikeType} from '@interfaces/BikeType';
import {RepairerType} from "@interfaces/RepairerType";
import {MediaObject} from "@interfaces/MediaObject";

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
    thumbnail?: MediaObject;
    descriptionPicture?: MediaObject;
    street?: string;
    rrule: string;
    latitude?: number;
    longitude?: number;
    firstSlotAvailable?: string,
    comment?: string,
    bikeTypesSupported: BikeType[],
    repairerType: RepairerType,
    enabled: boolean,
    openingHours?: string
    optionalPage?: string
}
