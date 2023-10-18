importScripts(
  'https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js'
);
importScripts(
  'https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js'
);

firebase.initializeApp(
  JSON.parse(new URL(location).searchParams.get('firebaseConfig'))
);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  const title = payload.data.title;
  const options = {
    title: title,
    body: payload.data.body,
    image:
      payload.data.image ||
      'https://cdn-icons-png.flaticon.com/512/565/565422.png',
    icon:
      payload.data.image ||
      'https://cdn-icons-png.flaticon.com/512/565/565422.png',
    data: {
      url: payload.data.route || '/',
    },
    vibrate: [200, 100, 200],
  };

  self.registration.showNotification(title, options);
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('error', function (event) {
  console.warn('Error in service worker registration');
  console.log(event);
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  const url = event.notification.data.url;
  if (clients.openWindow && url) {
    event.waitUntil(clients.openWindow(url));
  }
});

// Définition de "define" pour l'import de Workbox
if (!self.define) {
  let registry = {};

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + '.js', parentUri).href;
    return (
      registry[uri] ||
      new Promise((resolve) => {
        if ('document' in self) {
          const script = document.createElement('script');
          script.src = uri;
          script.onload = resolve;
          document.head.appendChild(script);
        } else {
          importScripts(uri);
          resolve();
        }
      }).then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri =
      ('document' in self ? document.currentScript.src : '') || location.href;
    if (registry[uri]) {
      return;
    }
    let exports = {};
    const require = (depUri) => singleRequire(depUri, uri);
    const specialDeps = {
      module: {uri},
      exports,
      require,
    };
    registry[uri] = Promise.all(
      depsNames.map((depName) => specialDeps[depName] || require(depName))
    ).then((deps) => {
      factory(...deps);
      return exports;
    });
  };
}

// Import de Workbox
define(['./workbox-3576cac3'], function (workbox) {
  'use strict';

  workbox.clientsClaim();
  workbox.skipWaiting();

  // ...

  // Stratégies de mise en cache avec Workbox
  workbox.registerRoute(
    '/',
    new workbox.NetworkFirst({
      cacheName: 'start-url',
      plugins: [
        {
          cacheWillUpdate: async ({request, response, event, state}) => {
            if (response && response.type === 'opaqueredirect') {
              return new Response(response.body, {
                status: 200,
                statusText: 'OK',
                headers: response.headers,
              });
            }
            return response;
          },
        },
      ],
    }),
    'GET'
  );

  workbox.registerRoute(
    /.*/i,
    new workbox.NetworkOnly({
      cacheName: 'dev',
      plugins: [],
    }),
    'GET'
  );
});
