import {User} from '@interfaces/User';
import {Repairer} from '@interfaces/Repairer';
import {AutoDiagnostic} from "@interfaces/AutoDiagnostic";
import {Bike} from "@interfaces/Bike";
import {BikeType} from "@interfaces/BikeType";

export interface Appointment {
    '@id': string;
    '@type': string;
    id: string;
    customer: User;
    repairer: Repairer;
    accepted?: boolean;
    autoDiagnostic?: AutoDiagnostic;
    slotTime: string;
    bike?: Bike;
    bikeType?: BikeType;
}
