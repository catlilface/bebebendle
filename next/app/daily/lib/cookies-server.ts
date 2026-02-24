import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

const DAILY_RESULT_COOKIE = "daily_result";

export function hasPlayedTodayServer(cookieStore: ReadonlyRequestCookies): boolean {
  const resultCookie = cookieStore.get(DAILY_RESULT_COOKIE);

  if (!resultCookie) {
    return false;
  }

  try {
    const result = JSON.parse(resultCookie.value);
    const today = new Date().toISOString().split("T")[0];
    return result.date === today;
  } catch {
    return false;
  }
}
