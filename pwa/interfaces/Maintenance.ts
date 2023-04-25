import {MediaObject} from "@interfaces/MediaObject";
import {DateObject} from "@interfaces/DateObject";
import {User} from "@interfaces/User";
import {Bike} from "@interfaces/Bike";

export interface Maintenance {
    '@id': string;
    '@type': string;
    id: string;
    owner: User;
    bike: Bike;
    name: string;
    description?: string;
    repairDate?: DateObject;
    image?: MediaObject;
}
