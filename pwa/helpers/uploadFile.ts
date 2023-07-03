import {ENTRYPOINT} from '@config/entrypoint';
import {getToken} from '@helpers/localHelper';

export const uploadImage = async (image: File): Promise<Response | undefined> => {
  return await upload(image, true)
};

export const uploadFile = async (file: File): Promise<Response | undefined> => {
  return await upload(file, false)
};

const upload = async (file: File, isImage: boolean) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(ENTRYPOINT + (isImage ? '/media_objects/images' : '/media_objects/files'), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: formData,
  });

  if (response.ok) {
    return response;
  }

  if (!response.ok) {
    throw new Error(`Failed to upload file: ${response.statusText}`);
  }
}
