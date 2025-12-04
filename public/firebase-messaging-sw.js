importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

firebase.initializeApp({
  apiKey: "AIzaSyCopRliv5VdMIBGtom7i4OcUeBmAycZCX4",
  authDomain: "bpg-college-notifications.firebaseapp.com",
  projectId: "bpg-college-notifications",
  messagingSenderId: "929234084416",
  appId: "1:929234084416:web:81502c3deb8eaea9c0f5a5",
});

const messaging = firebase.messaging();

// Background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Background message received', payload);

  const title = payload.notification?.title || 'New Message';
  const options = {
    body: payload.notification?.body || '',
    icon: '/icons/icon-192.png',
  };

  self.registration.showNotification(title, options);
});
