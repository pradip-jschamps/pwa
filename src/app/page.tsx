"use client";
import { useEffect } from "react";
import { subscribeUser } from "./lib/push";

export default function Home() {
  useEffect(() => {
    subscribeUser();
  }, []);

  return (
    <div>
      <p>Your PWA is Ready</p>
      {/* <button
        onClick={async () => {
          await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_API}send-notification`, { method: "POST" });
        }}
      >
        Send Push
      </button> */}
    </div>
  );
}
