import {AbstractResource} from '@resources/AbstractResource';
import {BikeType} from '@interfaces/BikeType';

class BikeTypeResource extends AbstractResource<BikeType> {
  protected endpoint = '/bike_types';
}

export const bikeTypeResource = new BikeTypeResource();
