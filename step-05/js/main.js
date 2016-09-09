var serviceWorkerRegistration;
var sub;
var isSubscribed = false;
var subscribeButton = document.getElementById('subscribe');
var sendButton = document.getElementById('send');

if ('serviceWorker' in navigator) {
    console.log('Service Worker is supported');
    navigator.serviceWorker.register('sw.js').then(function() {
        console.log(navigator.serviceWorker);
        return navigator.serviceWorker.ready;
    }).then(function(reg) {
        serviceWorkerRegistration = reg;
        subscribeButton.disabled = false;
        console.log('Service Worker is ready', reg);
    }).catch(function(error) {
        console.log('Service Worker error', error);
    });
}

subscribeButton.addEventListener('click', function() {
    if (isSubscribed) {
        unsubscribe();
    } else {
        subscribe();
    }
});

sendButton.addEventListener('click', function() {
    if (isSubscribed && sub.endpoint.startsWith('https://android.googleapis.com/gcm/send')) {
        var endpointParts = sub.endpoint.split('/');
        var registrationId = endpointParts[endpointParts.length - 1];
        fetch('https://android.googleapis.com/gcm/send', {
            method: 'POST',
            headers: new Headers({
                'Authorization': 'key=AIzaSyAMzp4LO9CiODdPEpfe7eQtdKHlB3foxcs',
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                registration_ids: [registrationId]
            })
        }).then(function(response) {
            console.log(response);
        }).catch(function(err) {
            // Error :(
        });
    } else {
        console.error('You need to subscribe');
    }
});

function subscribe() {
    serviceWorkerRegistration.pushManager.subscribe({userVisibleOnly: true}).
    then(function(pushSubscription){
        sub = pushSubscription;
        console.log('Subscribed! Endpoint:', sub.endpoint);
        subscribeButton.textContent = 'Unsubscribe';
        isSubscribed = true;
    });
}

function unsubscribe() {
    sub.unsubscribe().then(function(event) {
        subscribeButton.textContent = 'Subscribe';
        console.log('Unsubscribed!', event);
        isSubscribed = false;
    }).catch(function(error) {
        console.log('Error unsubscribing', error);
        subscribeButton.textContent = 'Subscribe';
    });
}
