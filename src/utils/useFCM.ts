import { useCallback } from "react";
import { initFirebaseApp, getFirebaseMessaging } from "../app/lib/firebase";
import { getToken, onMessage } from "firebase/messaging";

export function useFCM() {
  // -------------------- SUBSCRIBE --------------------
  const subscribe = useCallback(async () => {
    // 1. Init Firebase
    initFirebaseApp();
    const messaging = await getFirebaseMessaging();
    if (!messaging) throw new Error("FCM not supported in this browser");

    // 2. Register service worker
    const swRegistration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );

    // 3. Ask notification permission
    const permission = await Notification.requestPermission();
    if (permission !== "granted")
      throw new Error("Notification permission denied");

    // 4. Get VAPID key
    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
    if (!vapidKey) throw new Error("VAPID KEY missing");

    // 5. Get FCM Token
    const fcmToken = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: swRegistration,
    });

    if (!fcmToken) throw new Error("Failed to get FCM token");

    // 6. Save Token → Next.js API route
    const res = await fetch("/api/save-subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: fcmToken,
        platform: "web",
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to save token");

    // 7. Foreground notification
    onMessage(messaging, (payload) => {
      console.log("FCM foreground message:", payload);
    });

    return fcmToken;
  }, []);

  // -------------------- UNSUBSCRIBE --------------------
  const unsubscribe = useCallback(async (token: string) => {
    try {
      // 1. Remove on server
      await fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      // 2. Remove from browser
      const messaging = await getFirebaseMessaging();
      if (messaging) {
        const { deleteToken } = await import("firebase/messaging");
        await deleteToken(messaging).catch(() => {});
      }
    } catch (err) {
      console.error("Unsubscribe error:", err);
    }
  }, []);

  return { subscribe, unsubscribe };
}
