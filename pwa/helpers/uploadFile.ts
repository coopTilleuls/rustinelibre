import {ENTRYPOINT} from '@config/entrypoint';
import {getToken} from '@helpers/localHelper';

export const uploadFile = async (file: File): Promise<Response | undefined> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(ENTRYPOINT + '/media_objects', {
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
};
