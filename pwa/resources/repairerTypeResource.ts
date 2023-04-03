import {AbstractResource} from 'resources/AbstractResource';
import {RepairerType} from 'interfaces/RepairerType';

class RepairerTypeResource extends AbstractResource<RepairerType> {
    protected endpoint = '/repairer_types';
}

export const repairerTypeResource = new RepairerTypeResource();
