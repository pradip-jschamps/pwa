"use client"
import React, { useState } from 'react';
import { useFCM } from '../../utils/useFCM';

export default function PushToggle({ backendUrl, jwt }: { backendUrl: string; jwt?: string }) {
  const { subscribe, unsubscribe } = useFCM();
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle'|'subscribing'|'subscribed'|'error'>('idle');

  const handleSubscribe = async () => {
    try {
      setStatus('subscribing');
      const t = await subscribe(backendUrl, jwt);
      setToken(t as string);
      setStatus('subscribed');
      alert('Subscribed (FCM token saved)');
    } catch (err: unknown) {
      console.error(err);
      setStatus("error")
      const message =
        err instanceof Error ? err.message : JSON.stringify(err);

      alert("Subscribe failed: " + message);
    }
  };

  const handleUnsubscribe = async () => {
    if (!token) {
      alert('No token saved locally');
      return;
    }
    try {
      await unsubscribe(backendUrl, token, jwt);
      setToken(null);
      setStatus('idle');
      alert('Unsubscribed');
    } catch (err: unknown) {
      console.error(err);

      const message =
        err instanceof Error ? err.message : JSON.stringify(err);

      alert("Unsubscribe failed: " + message);
    }
  };

  return (
    <div className='py-16 px-4 flex flex-col items-center '>
      <p>Push status: <span className='text-gray-600'>{status}</span></p>
      {!token ? <button onClick={handleSubscribe} className='bg-gray-600 hover:bg-gray-700 px-4 py-1 rounded text-white cursor-pointer'>Subscribe (FCM)</button> : <button onClick={handleUnsubscribe} className='bg-gray-600 hover:bg-gray-700 px-4 py-1 rounded text-white cursor-pointer'>Unsubscribe</button>}
    </div>
  );
}
