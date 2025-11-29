import { urlBase64ToUint8Array } from "@/utils/pwa";


export async function subscribeUser() {
  const permission = await Notification.requestPermission();
  if (permission !== "granted") return;

  const reg = await navigator.serviceWorker.ready;

  // ⛔ VERY IMPORTANT — check existing subscription
  const existing = await reg.pushManager.getSubscription();
  if (existing) {
    console.log("Already subscribed");
    return existing;
  }

  const sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
    ),
  });

  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_API}save-subscription`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sub),
  });

  alert("Push Notification Enabled!");

  return sub;
}
