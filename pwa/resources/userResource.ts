import {AbstractResource} from '@resources/AbstractResource';
import {User} from '@interfaces/User';
import {RequestBody, RequestHeaders} from "@interfaces/Resource";

class UserResource extends AbstractResource<User> {
  protected endpoint = '/users';

  async getCurrent(): Promise<User> {
    return await this.get(
        '/me',
        true
    );
  }

  async register(body: RequestBody = {}): Promise<User> {
    const doFetch = async () => {
      return await fetch(this.getUrl( '/users'), {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(body),
      });
    };

    return await this.getResult(doFetch);
  }

  async validCode(body: RequestBody = {}): Promise<User> {

    const doFetch = async () => {
      return await fetch(this.getUrl(`/validation-code`), {
        headers: {
          ...this.getDefaultHeaders(true),
        },
        method: 'POST',
        body: JSON.stringify(body),
      });
    };

    return await this.getResult(doFetch);
  }

  async forgotPassword(body: RequestBody = {}): Promise<User> {
    const doFetch = async () => {
      return await fetch(this.getUrl(`/forgot-password`), {
        headers: {
          ...this.getDefaultHeaders(true),
        },
        method: 'POST',
        body: JSON.stringify(body),
      });
    };

    return await this.getResult(doFetch);
  }

  async resetPassword(body: RequestBody = {}): Promise<User> {
    const doFetch = async () => {
      return await fetch(this.getUrl(`/reset-password`), {
        headers: {
          ...this.getDefaultHeaders(true),
        },
        method: 'POST',
        body: JSON.stringify(body),
      });
    };

    return await this.getResult(doFetch);
  }
}

export const userResource = new UserResource();
