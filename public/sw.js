// [CURRENT SUBDIRECTORY/CYCLE] | [4_Produce]

self.addEventListener('push', function(event) {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'Nytt larm', body: event.data.text(), id: '' };
    }
  }

  // Handle Silent Cancel Push
  if (data.type === 'CANCEL' && data.id) {
    event.waitUntil(
      self.registration.getNotifications({ tag: 'larm-' + data.id }).then(function(notifications) {
        notifications.forEach(function(notification) {
          notification.close();
        });
      })
    );
    return;
  }

  const alertId = data.id || '';
  const options = {
    body: data.body || 'Ett nytt larm har inkommit',
    icon: '/assets/icon.png',
    badge: '/assets/badge.png',
    data: {
      url: alertId ? '/larm/' + alertId : '/'
    },
    tag: alertId ? 'larm-' + alertId : 'mission-larm',
    renotify: true
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Nytt larm', options)
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
