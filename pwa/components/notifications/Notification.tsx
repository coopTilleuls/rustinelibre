import {useCallback, useContext, useEffect, useState, JSX} from 'react';
import * as React from 'react';
import {FirebaseApp} from 'firebase/app';
import {onMessage, Messaging, NotificationPayload, MessagePayload} from 'firebase/messaging';
import {useAccount} from "@contexts/AuthContext";
import {
    firebaseConfig,
    getFCMToken,
    getFirebaseApp,
    getMessaging,
    onMessageListener,
    requestPermission
} from "@config/firebase";
import {userResource} from "@resources/userResource";
import {User} from "@interfaces/User";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';


const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const Notification = (): JSX.Element => {
    const {user} = useAccount({});
    const [notification, setNotification] = useState<NotificationPayload | undefined>(undefined);
    const [open, setOpen] = useState<boolean>(false);
    const firebaseApp = getFirebaseApp();
    const messaging = getMessaging(firebaseApp);

    // useEffect(() => {
    //     requestPermission();
    //     const unsubscribe = onMessageListener().then((payload) => {
    //         setNotificationTitle('test');
    //     });
    //     return () => {
    //         unsubscribe.catch((err) => console.log('failed: ', err));
    //     };
    // }, []);

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        setOpen(false);
    };

    useEffect(() => {
        const firebaseConfigEncoded = encodeURIComponent(JSON.stringify(firebaseConfig));
        console.log('register service worker');
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
            console.log('firebase token does not change');
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

        const firebaseApp = getFirebaseApp();
        const messaging = getMessaging(firebaseApp);

        updateFirebaseToken(user, firebaseApp, messaging)
            .then(() => handleIncomingFcmMessages(messaging))
            .catch((e) => console.error('firebase token error', e));

    }, [user]);


    const handleIncomingFcmMessages = useCallback((messaging: Messaging): void => {

        console.log('handle messages callback');

            onMessage(messaging, (payload) => {

                console.log(payload);

                const { title, body, icon, image } = payload.notification ?? {};
                setNotification({
                    title: title,
                    body: body,
                    icon: icon || 'https://cdn-icons-png.flaticon.com/512/565/565422.png',
                    image: image,
                });
                setOpen(true);
            });
        },
        []
    );

    return (
        <>
            <Snackbar open={open} autoHideDuration={6000}>
                <Alert severity="success" sx={{ width: '100%' }} onClose={handleClose}>
                    {notification?.title}
                </Alert>
            </Snackbar>
        </>
    );
};

export default Notification;
