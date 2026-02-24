"use client";

const FINGERPRINT_KEY = "bebendle_fp";
const FINGERPRINT_COOKIE = "bebendle_fp";

async function generateFingerprintHash(components: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(components);

  if (typeof crypto !== "undefined" && crypto.subtle) {
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  let hash = 0;
  for (let i = 0; i < components.length; i++) {
    const char = components.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

function getCanvasFingerprint(): Promise<string> {
  return new Promise((resolve) => {
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve("");
        return;
      }

      canvas.width = 200;
      canvas.height = 50;

      ctx.textBaseline = "top";
      ctx.font = "14px Arial";
      ctx.fillStyle = "#f60";
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = "#069";
      ctx.fillText("bebendle", 2, 15);
      ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
      ctx.fillText("bebendle", 4, 17);

      const dataUrl = canvas.toDataURL();
      resolve(dataUrl);
    } catch {
      resolve("");
    }
  });
}

export async function getFingerprint(): Promise<string> {
  if (typeof window === "undefined" || typeof crypto === "undefined") return "";

  const stored = localStorage.getItem(FINGERPRINT_KEY);
  if (stored) return stored;

  try {
    const components = [
      navigator.userAgent,
      navigator.language,
      screen.width.toString(),
      screen.height.toString(),
      screen.colorDepth.toString(),
      Intl.DateTimeFormat().resolvedOptions().timeZone,
      new Date().getTimezoneOffset().toString(),
      navigator.hardwareConcurrency?.toString() || "",
      (navigator as { deviceMemory?: number }).deviceMemory?.toString() || "",
    ];

    const canvasFp = await getCanvasFingerprint();
    components.push(canvasFp);

    const fingerprint = await generateFingerprintHash(components.join("|"));

    localStorage.setItem(FINGERPRINT_KEY, fingerprint);

    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    document.cookie = `${FINGERPRINT_COOKIE}=${fingerprint}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;

    return fingerprint;
  } catch {
    return "";
  }
}

export function getFingerprintFromCookie(): string {
  if (typeof document === "undefined") return "";

  const cookies = document.cookie.split(";");
  const cookie = cookies.find((c) => c.trim().startsWith(`${FINGERPRINT_COOKIE}=`));

  if (!cookie) return "";

  return cookie.split("=")[1].trim();
}

export function clearFingerprint(): void {
  localStorage.removeItem(FINGERPRINT_KEY);
  document.cookie = `${FINGERPRINT_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}
