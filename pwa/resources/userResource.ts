import {AbstractResource} from 'resources/AbstractResource';
import {User} from 'interfaces/User';

class UserResource extends AbstractResource<User> {
  protected endpoint = '/users';

  async getCurrent(): Promise<User> {
    return await this.get(
        '/me'
    );
  }
}

export const userResource = new UserResource();
