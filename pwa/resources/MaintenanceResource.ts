import {AbstractResource} from '@resources/AbstractResource';
import {Maintenance} from "@interfaces/Maintenance";

class MaintenanceResource extends AbstractResource<Maintenance> {
    protected endpoint = '/maintenances';
}

export const maintenanceResource = new MaintenanceResource();
