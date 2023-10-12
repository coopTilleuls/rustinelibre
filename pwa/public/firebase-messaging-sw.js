// importScripts('/sw.js');
// importScripts(
//   'https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js'
// );
// importScripts(
//   'https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js'
// );

// firebase.initializeApp(
//   JSON.parse(new URL(location).searchParams.get('firebaseConfig'))
// );
// const messaging = firebase.messaging();

// messaging.onBackgroundMessage((payload) => {
//   console.log(
//     '[firebase-messaging-sw.js] Received background message ',
//     payload
//   );
//   const title = payload.data.title;
//   const options = {
//     title: title,
//     body: payload.data.body,
//     image:
//       payload.data.image ||
//       'https://cdn-icons-png.flaticon.com/512/565/565422.png',
//     icon:
//       payload.data.image ||
//       'https://cdn-icons-png.flaticon.com/512/565/565422.png',
//     data: {
//       url: payload.data.route ?? '/',
//     },
//     vibrate: [200, 100, 200],
//   };

//   self.registration.showNotification(title, options);
// });

// self.addEventListener('notificationclick', function (event) {
//   event.notification.close();
//   const url = event.notification.data.url;
//   if (clients.openWindow && url) {
//     event.waitUntil(clients.openWindow(url));
//   }
// });

// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/8.8.0/firebase-app.js');
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/8.8.0/firebase-messaging.js');

const firebaseConfig = {
  //   apiKey: 'your_keys',
  //   authDomain: 'your_keys',
  //   projectId: 'your_keys',
  //   storageBucket: 'your_keys',
  //   messagingSenderId: 'your_keys',
  //   appId: 'your_keys',
  //   measurementId: 'your_keys',
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
// eslint-disable-next-line no-undef
firebase.initializeApp(firebaseConfig);
// eslint-disable-next-line no-undef
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: './logo.png',
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
