import {AbstractResource} from '@resources/AbstractResource';
import {RepairerEmployee} from '@interfaces/RepairerEmployee';
import {RequestBody, RequestHeaders} from '@interfaces/Resource';

class RepairerEmployeesResource extends AbstractResource<RepairerEmployee> {
  protected endpoint = '/repairer_employees';

  async updateEmployeeAndUser(
    id: string,
    body: RequestBody = {},
    headers?: RequestHeaders
  ): Promise<any> {
    const url = this.getUrl(`/employee_and_user/${id}`);

    const doFetch = async () => {
      return await fetch(url, {
        headers: {
          ...this.getDefaultHeaders(),
          ...headers,
        },
        method: 'PUT',
        body: JSON.stringify(body),
      });
    };

    return await this.getResult(doFetch);
  }

  async setRepairerAdmin(
    id: string,
    body: RequestBody = {},
    headers?: RequestHeaders
  ): Promise<any> {
    const url = this.getUrl(`/repairer_change_boss/${id}`);

    const doFetch = async () => {
      return await fetch(url, {
        headers: {
          ...this.getDefaultHeaders(),
          ...headers,
        },
        method: 'PUT',
        body: JSON.stringify(body),
      });
    };

    return await this.getResult(doFetch);
  }
}

export const repairerEmployeesResource = new RepairerEmployeesResource();
