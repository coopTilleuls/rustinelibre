import {User} from '@interfaces/User';
import {Repairer} from '@interfaces/Repairer';

export interface Discussion {
    '@id': string;
    '@type': string;
    id: number;
    customer: User;
    repairer: Repairer;
    createdAt: string;
    lastMessage: string;
}
