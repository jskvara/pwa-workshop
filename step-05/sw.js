var cacheName = 'pwa-ws';
var filesToCache = [
    '/',
    '/index.html',
    '/index.html?homescreen=1', // you have to add exact url with query parameters
    '/js/main.js'
];

self.addEventListener('install', function(e) {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('fetch', function(event) {
    console.log(event.request.url);
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});

self.addEventListener('push', function(event) {
    console.log('Push message', event);

    var title = 'Push message';

    event.waitUntil(
        self.registration.showNotification(title, {
            body: 'The Message',
            icon: 'images/icon.png',
            tag: 'my-tag'
        })
    );
});

self.addEventListener('notificationclick', function(event) {
    console.log('Notification click: tag', event.notification.tag);
    event.notification.close();
    var url = 'https://www.youtube.com/watch?v=DfMnJAzOFng';
    // Check if there's already a tab open with this URL.
    // If yes: focus on the tab.
    // If no: open a tab with the URL.
    event.waitUntil(
        clients.matchAll({
            type: 'window'
        })
            .then(function(windowClients) {
                console.log('WindowClients', windowClients);
                for (var i = 0; i < windowClients.length; i++) {
                    var client = windowClients[i];
                    console.log('WindowClient', client);
                    if (client.url === url && 'focus' in client) {
                        return client.focus();
                    }
                }
                if (clients.openWindow) {
                    return clients.openWindow(url);
                }
            })
    );
});
