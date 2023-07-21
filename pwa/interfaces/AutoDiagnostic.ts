import {MediaObject} from '@interfaces/MediaObject';
import {Appointment} from '@interfaces/Appointment';

export interface AutoDiagnostic {
  '@id': string;
  '@type': string;
  id: string;
  appointment: Appointment;
  prestation: string;
  photo: MediaObject;
}
