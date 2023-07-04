import {FirebaseApp, initializeApp} from 'firebase/app';
import {getMessaging as getFirebaseMessaging, getToken, Messaging, onMessage} from 'firebase/messaging';

const VAPID_KEY = "BAjQQI2sY8y9UfSafMoUQE4-dm9M_-IRRxg2bobx2AMcU__3x8zaR-v1Ccpx_4kuDKdEN0u7-amwp32WKhFJAkM";

export const firebaseConfig = {
    apiKey: "AIzaSyB9p5PbQf3PVyTOCFwubAS3dpTsQyDnf90",
    authDomain: "rustinelibre.firebaseapp.com",
    projectId: "rustinelibre",
    storageBucket: "rustinelibre.appspot.com",
    messagingSenderId: "629351779518",
    appId: "1:629351779518:web:5ea1042d5f378e100aa2ef"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export function getFirebaseApp(): FirebaseApp {
    return initializeApp(firebaseConfig);
}

export function getMessaging(firebaseApp: FirebaseApp): Messaging {
    return getFirebaseMessaging(firebaseApp);
}

export async function getFCMToken(messaging: Messaging): Promise<string> {
    const config = encodeURIComponent(JSON.stringify(firebaseConfig));
    const sw = await navigator.serviceWorker.register(`/firebase-messaging-sw.js?firebaseConfig=${config}`);

    return await getToken(messaging, {
        // vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: sw,
    });
}

export const requestPermission = () => {

    console.log("Requesting User Permission......");
    Notification.requestPermission().then((permission) => {

        if (permission === "granted") {

            console.log("Notification User Permission Granted.");
            return getFCMToken(messaging)
                .then((currentToken) => {

                    if (currentToken) {

                        console.log('Firebase token: ', currentToken);
                    } else {

                        console.log('Failed to generate the app registration token.');
                    }
                })
                .catch((err) => {

                    console.log('An error occurred when requesting to receive the token.', err);
                });
        } else {

            console.log("User Permission Denied.");
        }
    });

}

requestPermission();


export const onMessageListener = () =>
    new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            resolve(payload);
        });
    });