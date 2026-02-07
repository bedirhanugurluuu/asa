"use client";

import { usePathname } from "next/navigation";
import type { Language } from "./translations";

export function useLanguage(): Language {
  const pathname = usePathname();
  
  // usePathname always returns the current pathname, works on both server and client
  return pathname.startsWith("/en") ? "en" : "tr";
}
