import {createContext, Dispatch, ReactNode, SetStateAction, useCallback, useEffect, useState} from 'react';
import {useAccount} from "@contexts/AuthContext";

interface NotificationContext {
  areNotificationsAuthorized: boolean | undefined;
  setShouldRequestUnreadCountMessages: Dispatch<SetStateAction<boolean>>;
  notificationNumber: number;
}

interface ProviderProps {
  children: ReactNode;
}

const initialValue = {
  areNotificationsAuthorized: undefined,
  setShouldRequestUnreadCountMessages: () => undefined,
  notificationNumber: 0,
};

export const NotificationContext = createContext<NotificationContext>(initialValue);

export const NotificationProvider = ({children}: ProviderProps): JSX.Element => {
  const {user} = useAccount({});
  const [notificationNumber, setNotificationNumber] = useState<number>(0);
  const [areNotificationsAuthorized, setAreNotificationsAuthorized] = useState<boolean | undefined>(undefined);
  const [shouldRequestUnreadCountMessages, setShouldRequestUnreadCountMessages] = useState<boolean>(true);

  const checkPermission = useCallback(async (): Promise<boolean> => {
    if (!Object.hasOwn(window, 'Notification')) {
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();

      return permission === 'granted';
    }

    return false;
  }, []);

  const handleVisibilityChange = (): void => {
    if (document.visibilityState !== 'visible') {
      return;
    }

    setShouldRequestUnreadCountMessages(true);
  };

  useEffect(() => {
    if (!user) {
      return;
    }

    checkPermission().then(setAreNotificationsAuthorized);

    if (!shouldRequestUnreadCountMessages) {
      return;
    }
    //
    // messagesUnreadCountResource
    //   .get()
    //   .then((result: NotificationNumber): void => {
    //     setNotificationNumber(result.number);
    //     setShouldRequestUnreadCountMessages(false);
    //   })
    //   .catch(() => console.error('An error occurred trying to fetch number of notifications'));
  }, [user, checkPermission, shouldRequestUnreadCountMessages]);

  /**
   * To keep always the badges with the good values in a non installed application (app run in browser tab):
   *  - it handles the case where a notification is received in the background (user is on a different tab) for refreshing the unread count messages badges:
   *      either he clicks on the notification and the e-espace tab has focus and this event is triggered,
   *      either he sees the notification but not click on it and navigate on the e-espace tab, so this event is triggered,
   */
  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  });

  return (
    <NotificationContext.Provider
      value={{
        notificationNumber,
        areNotificationsAuthorized,
        setShouldRequestUnreadCountMessages,
      }}>
      {children}
    </NotificationContext.Provider>
  );
};
