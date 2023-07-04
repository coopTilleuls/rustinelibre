importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js");

//the Firebase config object
const firebaseConfig = {
    apiKey: "AIzaSyB9p5PbQf3PVyTOCFwubAS3dpTsQyDnf90",
    authDomain: "rustinelibre.firebaseapp.com",
    projectId: "rustinelibre",
    storageBucket: "rustinelibre.appspot.com",
    messagingSenderId: "629351779518",
    appId: "1:629351779518:web:5ea1042d5f378e100aa2ef"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {

    const { title, body, icon, image, actions } = payload.notification;

    const options = {
        title,
        body,
        icon: icon || 'https://cdn-icons-png.flaticon.com/512/565/565422.png',
        image: image || 'https://cdn-icons-png.flaticon.com/512/565/565422.png',
        actions : [
                { action: 'action1', title: 'Action 1', icon: 'action1.png' },
                { action: 'action2', title: 'Action 2', icon: 'action2.png' }
            ],
        vibrate: [200, 100, 200]
    };

    console.log(options);

    self.registration.showNotification(title, options);
});


// self.addEventListener('push', (event) => {
//     let payload = {};
//     if (event.data) {
//         payload = event.data.json();
//     }
//
//     console.log('here 2');
//
//
//     if (payload.notification) {
//         const { title, body, icon, image, actions } = payload.notification;
//
//         const options = {
//             body,
//             icon: icon || 'https://cdn-icons-png.flaticon.com/512/565/565422.png',
//             image,
//             actions,
//             vibrate: [200, 100, 200],
//         };
//
//         console.log(options);
//
//         event.waitUntil(
//             self.registration.showNotification(title, options)
//         );
//     } else {
//
//         console.log('here 3');
//
//         // Gérer les messages de données
//         // ...
//     }
// });

self.addEventListener('notificationclick', function (event) {
    const url = event.notification.data?.url || event.currentTarget.registration.scope;

    event.notification.close();
    event.waitUntil(
        clients.matchAll({includeUncontrolled: true, type: 'window'}).then((windowClients) => {
            // Check if there is already a window/tab open with the target URL
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                // If so, just focus it.
                if (client.url.includes(url) && 'focus' in client) {
                    return client.focus();
                }
            }
            // If not, then open the target URL in a new window/tab.
            if (clients.openWindow) {
                return clients.openWindow(url);
            }

            return clients.openWindow(url);
        })
    );
});

