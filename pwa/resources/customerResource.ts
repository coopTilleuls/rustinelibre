import {AbstractResource} from '@resources/AbstractResource';
import {User} from '@interfaces/User';

class CustomerResource extends AbstractResource<User> {
    protected endpoint = '/customers';
}

export const customerResource = new CustomerResource();
