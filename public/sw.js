// public/sw.js

self.addEventListener('push', (event) => {
  const data = event.data.json(); // Our notification data from the server

  const title = data.title || 'SkillSwap';
  const options = {
    body: data.body,
    icon: '/icon-192x192.png', // You can add an icon for your app here
    badge: '/badge-72x72.png', // And a badge
  };

  event.waitUntil(self.registration.showNotification(title, options));
});