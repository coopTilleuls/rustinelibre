import {jwtDecode} from '@helpers/JWTDecoder';

const AUTH_TOKEN = 'rustinelibre_token';
const AUTH_REFRESH_TOKEN = 'rustinelibre_refresh_token';

export const setToken = (token: string): void => {
  localStorage?.setItem(AUTH_TOKEN, token);
};

export const getToken = (): string | null => {
  return localStorage?.getItem(AUTH_TOKEN) || null;
};

export const getRoles = (): string[] | null => {
  const parseJwt = jwtDecode(getToken());
  return 'roles' in parseJwt ? parseJwt.roles : null;
};

export const removeToken = (): void => {
  localStorage?.removeItem(AUTH_TOKEN);
};

export const setRefreshToken = (token: string): void => {
  localStorage?.setItem(AUTH_REFRESH_TOKEN, token);
};

export const getRefreshToken = (): string | null => {
  return localStorage?.getItem(AUTH_REFRESH_TOKEN) || null;
};

export const removeRefreshToken = (): void => {
  localStorage?.removeItem(AUTH_REFRESH_TOKEN);
};
