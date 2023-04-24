import {BikeType} from '@interfaces/BikeType';
import {MediaObject} from "@interfaces/MediaObject";
import {DateObject} from "@interfaces/DateObject";

export interface Bike {
    '@id': string;
    '@type': string;
    id: string;
    brand?: string;
    bikeType?: BikeType;
    name?: string;
    description?: string;
    createdAt?: DateObject;
    picture?: MediaObject;
    wheelPicture?: MediaObject;
    transmissionPicture?: MediaObject;
}
