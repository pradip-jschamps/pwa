"use client";

import React, { useState } from "react";
import { useFCM } from "@/utils/useFCM";
import { useFcmContext } from "../../context/FcmContext";

export default function PushToggle() {
  const { subscribe, unsubscribe } = useFCM();
  const { fcmToken, setFcmToken } = useFcmContext();

  const [status, setStatus] = useState<"idle" | "subscribed" | "unsubscribed">("idle");

  const handleSubscribe = async () => {
    try {
      const token = await subscribe();

      if (!token) {
        alert("No token generated");
        return;
      }

      setFcmToken(token);
      setStatus("subscribed");
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnsubscribe = async () => {
    if (!fcmToken) {
      alert("No token stored");
      return;
    }

    await unsubscribe(fcmToken);
    setFcmToken(null);
    setStatus("unsubscribed");
  };

  return (
    <div className="mt-16 flex flex-col justify-center items-center">
      <p className=" mb-4">FCM Token: <span className="text-gray-600">{fcmToken ?? "Not generated"}</span></p>

      {status !== "subscribed" ? (
        <button onClick={handleSubscribe} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-1 rounded cursor-pointer">Enable Push</button>
      ) : (
        <button onClick={handleUnsubscribe} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-1 rounded cursor-pointer">Disable Push</button>
      )}
    </div>
  );
}
