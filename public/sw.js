self.addEventListener('push', function(event) {
  let data = { title: 'Nytt larm', body: 'Ett nytt larm har inkommit', id: '' };
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'Nytt larm', body: event.data.text(), id: '' };
    }
  }

  const options = {
    body: data.body,
    icon: '/assets/icon.png', // Fallback or standard icon
    badge: '/assets/badge.png',
    data: {
      url: data.id ? '/larm/' + data.id : '/'
    },
    // Set TTL/expiration for the notification directly using standard properties
    tag: data.id ? 'larm-' + data.id : 'mission-larm',
    renotify: true
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const urlToOpen = event.notification.data && event.notification.data.url 
    ? event.notification.data.url 
    : '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
