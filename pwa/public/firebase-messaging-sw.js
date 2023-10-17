importScripts(
  'https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js'
);
importScripts(
  'https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js'
);

/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

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
          nextDefineUri = uri;
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
      nextDefineUri ||
      ('document' in self ? document.currentScript.src : '') ||
      location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
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
define(['./workbox-3576cac3'], function (workbox) {
  'use strict';

  importScripts();
  self.skipWaiting();
  workbox.clientsClaim();
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
//# sourceMappingURL=sw.js.map

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
      url: payload.data.route ?? '/',
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
