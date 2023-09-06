importScripts('/sw.js');
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js");

firebase.initializeApp(JSON.parse(new URL(location).searchParams.get('firebaseConfig')));
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {

    const title = payload.data.title;
    const options = {
        title: title,
        body: payload.data.body,
        image: payload.data.image,
        icon: payload.data.image,
        // icon: payload.data.icon || 'https://cdn-icons-png.flaticon.com/512/565/565422.png',
        // image: payload.data.image || 'https://cdn-icons-png.flaticon.com/512/565/565422.png',
        data: {
            url: payload.data.route ?? '/'
        },
        vibrate: [200, 100, 200]
    };

    self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', function (event) {

    event.notification.close();
    const url = event.notification.data.url;
    if (clients.openWindow && url) {
        event.waitUntil(clients.openWindow(url));
    }
});

