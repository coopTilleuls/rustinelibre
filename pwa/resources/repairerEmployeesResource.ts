import {AbstractResource} from '@resources/AbstractResource';
import {RepairerEmployee} from "@interfaces/RepairerEmployee";

class RepairerEmployeesResource extends AbstractResource<RepairerEmployee> {
    protected endpoint = '/repairer_employees';
}

export const repairerEmployeesResource = new RepairerEmployeesResource();
