import {AbstractResource} from '@resources/AbstractResource';
import {Repairer} from '@interfaces/Repairer';
import {RequestBody, RequestHeaders} from '@interfaces/Resource';

class RepairerResource extends AbstractResource<Repairer> {
  protected endpoint = '/repairers';

  async postRepairerAndUser(
    body: RequestBody = {},
    headers?: RequestHeaders
  ): Promise<Repairer> {
    const url = this.getUrl('/create_user_and_repairer');

    const doFetch = async () => {
      return await fetch(url, {
        headers: {
          ...this.getDefaultHeaders(),
          ...headers,
        },
        method: 'POST',
        body: JSON.stringify(body),
      });
    };

    return await this.getResult(doFetch);
  }
}

export const repairerResource = new RepairerResource();
