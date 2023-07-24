import {MediaObject} from '@interfaces/MediaObject';
import {User} from '@interfaces/User';
import {Bike} from '@interfaces/Bike';

export interface Maintenance {
  '@id': string;
  '@type': string;
  id: string;
  owner: User;
  bike: Bike;
  name: string;
  description?: string;
  repairDate?: string;
  photo?: MediaObject;
  invoice?: MediaObject;
  author: User;
}
