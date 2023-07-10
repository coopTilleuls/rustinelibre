import {useCallback, useEffect, useState, JSX} from 'react';
import * as React from 'react';
import {FirebaseApp} from 'firebase/app';
import {onMessage, Messaging, NotificationPayload} from 'firebase/messaging';
import {useAccount} from "@contexts/AuthContext";
import {
    firebaseConfig,
    getFCMToken,
    getFirebaseApp,
    getMessaging,
} from "@config/firebase";
import {userResource} from "@resources/userResource";
import {User} from "@interfaces/User";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Link from 'next/link';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const Notifications = (): JSX.Element => {
    const {user} = useAccount({});
    const [urlRedirect, setUrlRedirect] = useState<string|null>(null);
    const [notification, setNotification] = useState<NotificationPayload | undefined>(undefined);
    const [open, setOpen] = useState<boolean>(false);

    const checkPermission = async() => {
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
    }

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        setOpen(false);
    };

    useEffect(() => {
        const firebaseConfigEncoded = encodeURIComponent(JSON.stringify(firebaseConfig));
        navigator.serviceWorker
            .register(`/firebase-messaging-sw.js?firebaseConfig=${firebaseConfigEncoded}`)
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const updateFirebaseToken = async(user: User, firebaseApp: FirebaseApp, messaging: Messaging) => {
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
            firebaseToken: firebaseToken
        });
    }

    useEffect(() => {
        if (!user) {
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

    }, [user]);


    const handleIncomingFcmMessages = useCallback((messaging: Messaging): void => {

            onMessage(messaging, (payload) => {
                const { title, body, icon, image } = payload.notification ?? {};
                setNotification({
                    title: title,
                    body: body,
                    icon: payload.data ? payload.data.icon : 'https://cdn-icons-png.flaticon.com/512/565/565422.png',
                    image: payload.data ? payload.data.image : 'https://cdn-icons-png.flaticon.com/512/565/565422.png',
                });
                setOpen(true);
                setUrlRedirect(payload.data ? payload.data.route : null);
                setTimeout(() => {
                    setOpen(false);
                    setUrlRedirect(null)
                }, 7000);
            });
        },
        []
    );

    return (
        <>
            <Snackbar open={open} autoHideDuration={6000}>
                <Link href={urlRedirect ?? '/'} style={{textDecoration: 'none'}}>
                    <Alert severity="success" sx={{ width: '100%' }} onClose={handleClose}>
                        {notification?.title}
                    </Alert>
                </Link>
            </Snackbar>
        </>
    );
};

export default Notifications;
