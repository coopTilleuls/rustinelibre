const AUTH_TOKEN = 'bikelib_token';
const AUTH_REFRESH_TOKEN = 'bikelib_refresh_token';

export const setToken = (token: string): void => {
  sessionStorage?.setItem(AUTH_TOKEN, token);
};

export const getToken = (): string | null => {
    return sessionStorage?.getItem(AUTH_TOKEN) || null;
};

export const removeToken = (): void => {
  sessionStorage?.removeItem(AUTH_TOKEN);
};

export const setRefreshToken = (token: string): void => {
  sessionStorage?.setItem(AUTH_REFRESH_TOKEN, token);
};

export const getRefreshToken = (): string | null => {
  return sessionStorage?.getItem(AUTH_REFRESH_TOKEN) || null;
};
export const removeRefreshToken = (): void => {
  sessionStorage?.removeItem(AUTH_REFRESH_TOKEN);
};
