import {AbstractResource} from '@resources/AbstractResource';
import {Bike} from '@interfaces/Bike';

class BikeResource extends AbstractResource<Bike> {
  protected endpoint = '/bikes';
}

export const bikeResource = new BikeResource();
