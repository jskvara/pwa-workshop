if ('serviceWorker' in navigator) {
    console.log('Service Worker is supported');
    navigator.serviceWorker.register('sw.js').then(function() {
        console.log(navigator.serviceWorker);
        return navigator.serviceWorker.ready;
    }).then(function(reg) {
        console.log('Service Worker is ready', reg);
    }).catch(function(error) {
        console.log('Service Worker error', error);
    });
}
