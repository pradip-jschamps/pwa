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
      
    </div>
  );
}
