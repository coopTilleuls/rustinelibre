import {User} from '@interfaces/User';
import {Repairer} from '@interfaces/Repairer';
import {DateObject} from '@interfaces/DateObject';

export interface RepairerEmployee {
  '@id': string;
  '@type': string;
  id: string;
  repairer: Repairer;
  enabled: boolean;
  employee: User;
  sinceDate?: DateObject;
}
