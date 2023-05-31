import {AbstractResource} from '@resources/AbstractResource';
import {Appointment} from '@interfaces/Appointment';
import {RequestBody, RequestHeaders} from "@interfaces/Resource";

class AppointmentResource extends AbstractResource<Appointment> {
    protected endpoint = '/appointments';

    async updateAppointmentStatus(id: string, body: RequestBody = {}, headers?: RequestHeaders): Promise<any> {
        const url = this.getUrl(`/appointment_transition/${id}`);

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

export const appointmentResource = new AppointmentResource();
