import {AbstractResource} from '@resources/AbstractResource';
import {MediaObject} from '@interfaces/MediaObject';

class MediaObjectResource extends AbstractResource<MediaObject> {
  protected endpoint = '/media_objects';
}

export const mediaObjectResource = new MediaObjectResource();
