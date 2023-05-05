import {AbstractResource} from '@resources/AbstractResource';
import {Repairer} from '@interfaces/Repairer';
import {RequestBody, RequestHeaders} from "@interfaces/Resource";

class RepairerResource extends AbstractResource<Repairer> {
    protected endpoint = '/repairers';

    async getSlotsAvailable(id: string, filters: {[key: string]: string}): Promise<any> {
        const url = this.getUrl('/repairer_get_slots_available/')+id+(new URLSearchParams(filters).toString());
        const response = await fetch(url, {
            headers: {
                ...this.getDefaultHeaders(),
            },
        });

        if (!response.ok) {
            throw new Error(`API call failed with status ${response.status}`);
        }

        return response.json();
    }

    async postRepairerAndUser(body: RequestBody = {}, headers?: RequestHeaders): Promise<Repairer> {
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
