// lib\utils.ts

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function truncateHtml(html: string, maxLength: number): string {
  const stripped = html.replace(/(<([^>]+)>)/gi, "");
  if (stripped.length <= maxLength) return html;
  
  let truncated = stripped.substr(0, maxLength);
  truncated = truncated.substr(0, Math.min(truncated.length, truncated.lastIndexOf(" ")));
  return `${truncated}...`;
}
