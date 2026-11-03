import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, hasLocale, localeCookie } from "@/app/[lang]/locales";

// True if Greek appears anywhere in the browser's languages, whatever its rank: many
// Greek families use English-first browsers. "el;q=0" means Greek is refused, so it doesn't count.
function acceptsGreek(acceptLanguage: string | null) {
  return (acceptLanguage ?? "").split(",").some((entry) => {
    const [tag, ...params] = entry.split(";");
    const quality = params.find((param) => param.trim().startsWith("q="));
    const isGreek = tag.trim().split("-")[0].toLowerCase() === "el";
    return isGreek && (!quality || Number(quality.trim().slice(2)) > 0);
  });
}

export function proxy(request: NextRequest) {
  const saved = request.cookies.get(localeCookie)?.value;
  const detected = acceptsGreek(request.headers.get("accept-language")) ? "el" : defaultLocale;
  const locale = saved && hasLocale(saved) ? saved : detected;

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: "/",
};
