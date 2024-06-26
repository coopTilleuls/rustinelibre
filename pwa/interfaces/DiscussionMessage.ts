import {User} from '@interfaces/User';
import {Discussion} from '@interfaces/Discussion';

export interface DiscussionMessage {
  '@id': string;
  '@type': string;
  id: number;
  sender: User;
  discussion: Discussion;
  content: string;
  createdAt: string;
  alreadyRead: boolean;
}
