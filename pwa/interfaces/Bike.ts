import {BikeType} from '@interfaces/BikeType';
import {MediaObject} from "@interfaces/MediaObject";
import {DateObject} from "@interfaces/DateObject";
import {User} from "@interfaces/User";

export interface Bike {
    '@id': string;
    '@type': string;
    id: string;
    owner: User;
    brand?: string;
    bikeType?: BikeType;
    name?: string;
    description?: string;
    createdAt?: DateObject;
    picture?: MediaObject;
    wheelPicture?: MediaObject;
    transmissionPicture?: MediaObject;
}
