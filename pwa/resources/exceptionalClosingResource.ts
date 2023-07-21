import {AbstractResource} from '@resources/AbstractResource';
import {RepairerExceptionalClosure} from '@interfaces/RepairerExceptionalClosure';

class ExceptionalClosureResource extends AbstractResource<RepairerExceptionalClosure> {
  protected endpoint = '/repairer_exceptional_closures';
}

export const exceptionalClosureResource = new ExceptionalClosureResource();
