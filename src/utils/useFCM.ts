import { useCallback } from 'react';
import { initFirebaseApp, getFirebaseMessaging } from '../app/lib/firebase';
import { getToken, onMessage } from 'firebase/messaging';

export function useFCM() {
  const subscribe = useCallback(async (backendUrl: string, jwt?: string) => {
    // init firebase
    initFirebaseApp();
    const messaging = await getFirebaseMessaging();
    if (!messaging) throw new Error('FCM not supported in this browser');

    // register SW (Next serves public/ files automatically)
    const swRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

    // Request notification permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') throw new Error('Notification permission denied');

    // getToken with VAPID key
    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
    if (!vapidKey) throw new Error('NEXT_PUBLIC_FIREBASE_VAPID_KEY not set');

    const fcmToken = await getToken(messaging, { vapidKey, serviceWorkerRegistration: swRegistration });
    // console.log("fcmtoken", fcmToken)
    if (!fcmToken) throw new Error('Failed to get FCM token');

    // Send token to backend to save
    const res = await fetch(`${backendUrl.replace(/\/$/, '')}/save-subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
      },
      body: JSON.stringify({ token: fcmToken, platform: 'web' }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || 'Failed to save FCM token');

    // optional: listen to foreground messages
    onMessage(messaging, (payload) => {
      // payload.notification contains title/body
      // You can show an in-app toast here
      console.log('FCM foreground message', payload);
    });

    return fcmToken;
  }, []);

  const unsubscribe = useCallback(async (backendUrl: string, token: string, jwt?: string) => {
    try {
      // delete token from backend
      await fetch(`${backendUrl}unsubscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
        },
        body: JSON.stringify({ token }),
      });
      // try to delete from browser (optional)
      // Note: firebase.messaging().deleteToken() can be called but needs messaging object and will remove local token
      const messaging = await getFirebaseMessaging();
      if (messaging) {
        
        const { deleteToken } = await import('firebase/messaging');
        await deleteToken(messaging).catch(() => {});
      }
    } catch (err) {
      console.error('Unsubscribe error', err);
    }
  }, []);

  return { subscribe, unsubscribe };
}
