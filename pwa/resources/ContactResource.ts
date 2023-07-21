import {AbstractResource} from '@resources/AbstractResource';
import {Contact} from '@interfaces/Contact';

class ContactResource extends AbstractResource<Contact> {
  protected endpoint = '/contacts';
}

export const contactResource = new ContactResource();
