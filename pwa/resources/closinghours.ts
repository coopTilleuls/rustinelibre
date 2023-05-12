import {AbstractResource} from '@resources/AbstractResource';
import {RepairerExceptionalClosure} from "@interfaces/RepairerExceptionalClosure";

class ClosinghoursResource extends AbstractResource<RepairerExceptionalClosure> {
    protected endpoint = '/repairer_opening_hours';
}

export const closinghoursResource = new ClosinghoursResource();
