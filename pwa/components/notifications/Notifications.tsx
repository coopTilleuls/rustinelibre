import {useCallback, useEffect, useState} from 'react';
import * as React from 'react';
import {FirebaseApp} from 'firebase/app';
import {onMessage, Messaging, NotificationPayload} from 'firebase/messaging';
import {useAccount} from '@contexts/AuthContext';
import {
  firebaseConfig,
  getFCMToken,
  getFirebaseApp,
  getMessaging,
} from '@config/firebase';
import {userResource} from '@resources/userResource';
import {User} from '@interfaces/User';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, {AlertProps} from '@mui/material/Alert';
import Link from 'next/link';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const Notifications = (): JSX.Element => {
  const {user} = useAccount({});
  const [urlRedirect, setUrlRedirect] = useState<string | null>(null);
  const [notification, setNotification] = useState<
    NotificationPayload | undefined
  >(undefined);
  const [open, setOpen] = useState<boolean>(false);
  const [serviceWorkerStatus, setServiceWorkerStatus] = useState<boolean>(false);

  const checkPermission = async () => {
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
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    setOpen(false);
  };

  const updateFirebaseToken = async (
    user: User,
    firebaseApp: FirebaseApp,
    messaging: Messaging
  ) => {
    const firebaseToken = await getFCMToken(messaging).catch((e) =>
      console.error('An error occurred while retrieving firebase token. ', e)
    );

    if (!firebaseToken) {
      throw new Error('No firebase token.');
    }

    if (firebaseToken === user.firebaseToken) {
      return;
    }

    await userResource.patchById(user.id, {
      firebaseToken: firebaseToken,
    });
  };

  const handleIncomingFcmMessages = useCallback(
    (messaging: Messaging): void => {
      onMessage(messaging, (payload) => {
        const {title, body} = payload.data ?? {};
        setNotification({
          title: title,
          body: body,
        });
        setOpen(true);
        setUrlRedirect(payload.data ? payload.data.route : null);
        setTimeout(() => {
          setOpen(false);
          setUrlRedirect(null);
        }, 7000);
      });
    },
    []
  );

  useEffect(() => {
    if (!user || !('serviceWorker' in navigator) || !serviceWorkerStatus) {
      return;
    }

    const permission = checkPermission();
    if (!permission) {
      return;
    }

    const firebaseApp = getFirebaseApp();
    const messaging = getMessaging(firebaseApp);

    updateFirebaseToken(user, firebaseApp, messaging)
      .then(() => handleIncomingFcmMessages(messaging))
      .catch((e) => console.error('firebase token error', e));
  }, [user, serviceWorkerStatus, handleIncomingFcmMessages]);


  const registerServiceWorker = async() => {
    const firebaseConfigEncoded = encodeURIComponent(
        JSON.stringify(firebaseConfig)
    );
    
    navigator.serviceWorker
        .register(
            `/firebase-messaging-sw.js?firebaseConfig=${firebaseConfigEncoded}`,
            { scope: './' }
        )
        .then((registration) => {
          console.log('Service worker registered')
          if (registration.installing) {
            console.log('Service worker installing');
          } else if (registration.waiting) {
            console.log('Service worker installed & waiting');
          } else if (registration.active) {
            console.log('Service worker active');
          }
        })
        .catch((error) => {
          console.log('Service worker not registered : '+error)
        });

    navigator.serviceWorker.ready.then(registration => {
      console.log('Service worker ready');
      setServiceWorkerStatus(true);
    })

    await navigator.serviceWorker.ready;
    console.log('Service worker ready 2')
  }

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      console.log('Service worker available on this browser');
      registerServiceWorker();
    } else {
      console.warn('Service Worker is not supported in this browser');
    }
  }, []);

  return (
    <>
      <Snackbar open={open} autoHideDuration={6000}>
        <Link href={urlRedirect ?? '/'} style={{textDecoration: 'none'}}>
          <Alert severity="success" sx={{width: '100%'}} onClose={handleClose}>
            {notification?.title}
          </Alert>
        </Link>
      </Snackbar>
    </>
  );
};

export default Notifications;
