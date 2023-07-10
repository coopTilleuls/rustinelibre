importScripts('/sw.js');
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js");

firebase.initializeApp(JSON.parse(new URL(location).searchParams.get('firebaseConfig')));
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {

    const { title, body } = payload.notification;

    console.log(payload);

    const options = {
        title,
        body,
        icon: payload.data.icon || 'https://cdn-icons-png.flaticon.com/512/565/565422.png',
        image: payload.data.image || 'https://cdn-icons-png.flaticon.com/512/565/565422.png',
        data: {
            url: payload.data.route
        },
        vibrate: [200, 100, 200]
    };

    console.log(options);

    self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', function (event) {

    console.log(event.notification);

    // const url = event.notification.data?.url || event.currentTarget.registration.scope;

    event.notification.close();

    const urlToOpen = event.notification.data.url;

    if (clients.openWindow && urlToOpen) {
        event.waitUntil(clients.openWindow(urlToOpen));
    }

    // event.waitUntil(
    //     clients.matchAll({includeUncontrolled: true, type: 'window'}).then((windowClients) => {
    //         // Check if there is already a window/tab open with the target URL
    //         for (let i = 0; i < windowClients.length; i++) {
    //             const client = windowClients[i];
    //             // If so, just focus it.
    //             if (client.url.includes(url) && 'focus' in client) {
    //                 return client.focus();
    //             }
    //         }
    //         // If not, then open the target URL in a new window/tab.
    //         if (clients.openWindow) {
    //             return clients.openWindow(url);
    //         }
    //
    //         return clients.openWindow(url);
    //     })
    // );
});

