import {FirebaseApp, initializeApp} from 'firebase/app';
import {getMessaging as getFirebaseMessaging, getToken, Messaging} from 'firebase/messaging';

export const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

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
        vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
        serviceWorkerRegistration: sw,
    });
}
