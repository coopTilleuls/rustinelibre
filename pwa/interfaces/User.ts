import {Repairer} from '@interfaces/Repairer';

export interface User {
  '@id': string;
  '@type': string;
  id: string;
  firstName: string;
  lastName: string;
  city?: string;
  street?: string;
  email: string;
  roles: string[];
  repairer: Repairer;
  plainPassword: string;
  lastConnect?: string;
  emailConfirmed: boolean;
  lastRepairers: Repairer[];
}
