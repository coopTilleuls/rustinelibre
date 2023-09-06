import {User} from '@interfaces/User';
import {userResource} from '@resources/userResource';

export const removeFirebaseToken = async (user: User) => {
  await userResource.patchById(user.id, {
    firebaseToken: null,
  });
};
