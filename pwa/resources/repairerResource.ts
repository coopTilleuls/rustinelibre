import {AbstractResource} from '@resources/AbstractResource';
import {Repairer} from '@interfaces/Repairer';

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
}

export const repairerResource = new RepairerResource();
