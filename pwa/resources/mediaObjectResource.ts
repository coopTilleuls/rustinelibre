import {AbstractResource} from '@resources/AbstractResource';
import {MediaObject} from '@interfaces/MediaObject';
import {RequestHeaders} from '@interfaces/Resource';

class MediaObjectResource extends AbstractResource<MediaObject> {
  protected endpoint = '/media_objects';

  async uploadImage(
    image: File,
    visibility: string = 'private'
  ): Promise<MediaObject> {
    return await this.postMediaObject(image, visibility, true);
  }

  async uploadFile(
    file: File,
    visibility: string = 'private'
  ): Promise<MediaObject> {
    return await this.postMediaObject(file, visibility, false);
  }

  private async postMediaObject(
    file: File,
    visibility: string,
    isImage: boolean,
    headers?: RequestHeaders
  ): Promise<MediaObject> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('visibility', visibility);

    const doFetch = async () => {
      return await fetch(`${this.getUrl()}${isImage ? '/images' : '/files'}`, {
        headers: {
          ...this.getDefaultFormDataHeaders(),
          ...headers,
        },
        method: 'POST',
        body: formData,
      });
    };

    return await this.getResult(doFetch);
  }
}

export const mediaObjectResource = new MediaObjectResource();
