import {User} from '@interfaces/User';
import {Repairer} from '@interfaces/Repairer';

export interface Appointment {
    '@id': string;
    '@type': string;
    id: string;
    customer: User;
    repairer: Repairer;
    slotTime: string;
}
