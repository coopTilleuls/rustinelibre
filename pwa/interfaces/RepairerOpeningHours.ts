import {Repairer} from '@interfaces/Repairer';

export interface RepairerOpeningHours {
  '@id': string;
  '@type': string;
  id: string;
  repairer: Repairer;
  day: string;
  startTime: string;
  endTime: string;
}
