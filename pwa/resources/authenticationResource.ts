import {AbstractResource} from '@resources/AbstractResource';
import {
  Collection,
  RequestBody,
} from 'interfaces/Resource';

import {
  AuthenticationResponse,
  NewPasswordForm,
} from 'interfaces/Authentication';

class AuthenticationResource extends AbstractResource<AuthenticationResponse> {
  protected endpoint = '';

  async authenticate(body: RequestBody = {}): Promise<AuthenticationResponse> {
    const doFetch = async () => {
      return await fetch(this.getUrl('/auth'), {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(body),
      });
    };

    return await this.getResult(doFetch);
  }
}

export const authenticationResource = new AuthenticationResource();
