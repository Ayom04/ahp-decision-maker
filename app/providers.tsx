"use client";

import { AhpProvider } from "@/app/context/AhpContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return <AhpProvider>{children}</AhpProvider>;
}
