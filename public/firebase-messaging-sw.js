// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/11.9.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.9.1/firebase-messaging-compat.js');

// This will be populated by the client when registering the service worker
// For now, we'll use a minimal config that will be overridden
let firebaseConfig = {};

// Listen for messages from the main thread to update config
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'FIREBASE_CONFIG') {
    firebaseConfig = event.data.config;
    
    // Initialize Firebase with the config
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
  }
});

// Fallback initialization - will be overridden by client config
try {
  if (!firebase.apps.length) {
    firebase.initializeApp({
      apiKey: "dummy",
      authDomain: "dummy.firebaseapp.com",
      projectId: "dummy",
      storageBucket: "dummy.appspot.com",
      messagingSenderId: "000000000000",
      appId: "1:000000000000:web:dummy"
    });
  }
} catch (err) {
  console.log('Firebase initialization error:', err);
}

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification?.title || 'New Message';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new notification',
    icon: payload.notification?.icon || '/icon-192x192.png',
    badge: '/badge-72x72.png',
    tag: payload.data?.tag || 'notification',
    requireInteraction: false,
    data: payload.data
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
