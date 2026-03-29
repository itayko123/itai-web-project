import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// חובה שיהיה כתוב export לפני הפונקציה
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const isIframe = typeof window !== "undefined" && window.self !== window.top;