import {AbstractResource} from 'resources/AbstractResource';
import {Appointment} from 'interfaces/Appointment';

class AppointmentResource extends AbstractResource<Appointment> {
    protected endpoint = '/appointments';
}

export const appointmentResource = new AppointmentResource();
