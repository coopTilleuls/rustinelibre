const AUTH_TOKEN = 'ffs_token';
const AUTH_REFRESH_TOKEN = 'ffs_refresh_token';
const WELCOME_READ = 'ffs_welcome_read';

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

export const hasWelcomeRead = (): boolean => {
  return !!localStorage?.getItem(WELCOME_READ) || false;
};
export const setWelcomeRead = (): void => {
  localStorage?.setItem(WELCOME_READ, 'true');
};
