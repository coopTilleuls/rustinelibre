const TARTE_AU_CITRON = 'tarteaucitron';

const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') {
    return null;
  }

  const cookies: Record<string, string> =
    document.cookie?.split(';').reduce((old, current) => {
      const [key, ...values] = current.split('=');

      return {
        ...old,
        [key.trim()]: values.join('='),
      };
    }, {}) || {};

  return cookies[name] || null;
};

export const hasConsent = (key: string): boolean => {
  const cookie = getCookie(TARTE_AU_CITRON);

  return !!cookie && !!cookie.includes(`!${key}=true`);
};
