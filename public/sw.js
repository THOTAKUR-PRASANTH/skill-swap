/**
 * Service Worker for Push Notifications
 * This file runs in the background in the browser.
 */

// 1. 'self' refers to the Service Worker itself.
// This listener fires when the worker is first installed.
self.addEventListener("install", (event) => {
  console.log("Service Worker: Install event");
  // We can pre-cache assets here if needed, but for push, we just activate.
  self.skipWaiting();
});

// This listener fires when the worker becomes active.
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activate event");
  // This line ensures the service worker takes control immediately.
  event.waitUntil(clients.claim());
});

// --- THIS IS THE MOST IMPORTANT PART ---
// 2. This listener fires when a push notification is received from the server.
self.addEventListener("push", (event) => {
  console.log("Service Worker: Push received.");

  // We need to parse the data from the server.
  // We'll send it as JSON: { title: "...", body: "...", url: "..." }
  let data;
  try {
    data = event.data.json();
  } catch (e) {
    console.error("Service Worker: Push data not valid JSON", e);
    data = {
      title: "New Message",
      body: "You have a new message from SkillSwap.",
      url: "/",
    };
  }

  const title = data.title || "New Message";
  const options = {
    body: data.body || "You have a new message.",
    icon: "/logo.png", // Make sure you have an icon in /public
    badge: "/logo.png", // An icon for the notification bar
    tag: "skillswap", // Groups notifications
    renotify: true, // Re-notify even if tag is the same
    data: {
      url: data.url || "/", // The URL to open on click
    },
  };

  // 3. This is the command that actually shows the notification.
  event.waitUntil(self.registration.showNotification(title, options));
});

// 4. This listener fires when the user CLICKS the notification.
self.addEventListener("notificationclick", (event) => {
  console.log("Service Worker: Notification click received.");

  // Close the notification pop-up
  event.notification.close();

  const urlToOpen = event.notification.data.url || "/";

  // 5. This block finds an open tab for your app and focuses it.
  // If it can't find one, it opens a new tab.
  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then((clientList) => {
        // Check if a window is already open
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          // If we find an open window, focus it
          if (client.url === urlToOpen && "focus" in client) {
            return client.focus();
          }
        }
        // If no window is found, open a new one
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

