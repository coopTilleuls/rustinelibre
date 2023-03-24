import {AbstractResource} from 'resources/AbstractResource';
import {User} from 'interfaces/User';

class UserResource extends AbstractResource<User> {
  protected endpoint = '/users';
}

export const userResource = new UserResource();
