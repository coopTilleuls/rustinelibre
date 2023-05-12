import {AbstractResource} from '@resources/AbstractResource';
import {RepairerOpeningHours} from "@interfaces/RepairerOpeningHours";
import {RequestBody, RequestHeaders} from "@interfaces/Resource";

class OpeningHoursResource extends AbstractResource<RepairerOpeningHours> {
    protected endpoint = '/repairer_opening_hours';

    async getRepairerSlotsAvailable(id: string, headers?: RequestHeaders): Promise<any> {
        const url = this.getUrl(`/repairer_get_slots_available/${id}`);

        const doFetch = async () => {
            return await fetch(url, {
                headers: {
                    ...this.getDefaultHeaders(),
                    ...headers,
                },
                method: 'GET',
            });
        };

        return await this.getResult(doFetch);
    }

}

export const openingHoursResource = new OpeningHoursResource();
