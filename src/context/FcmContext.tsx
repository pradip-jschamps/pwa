"use client";
import { createContext, useContext, useState } from "react";

type FcmContextType = {
  fcmToken: string | null;
  setFcmToken: (t: string | null) => void;
};

const FcmContext = createContext<FcmContextType>({
  fcmToken: null,
  setFcmToken: () => {},
});

export function FcmProvider({ children }: { children: React.ReactNode }) {
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  return (
    <FcmContext.Provider value={{ fcmToken, setFcmToken }}>
      {children}
    </FcmContext.Provider>
  );
}

export const useFcmContext = () => useContext(FcmContext);
