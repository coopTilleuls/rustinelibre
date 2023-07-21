import {AbstractResource} from '@resources/AbstractResource';
import {Intervention} from '@interfaces/Intervention';

class InterventionResource extends AbstractResource<Intervention> {
  protected endpoint = '/interventions';
}

export const interventionResource = new InterventionResource();
