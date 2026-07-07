import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { createServerClient } from "@supabase/ssr";

const ADMIN_HOST =
  process.env.NEXT_PUBLIC_ADMIN_HOST ?? "admin.bohubbard.xyz";
const PUBLIC_HOST = process.env.NEXT_PUBLIC_PUBLIC_HOST ?? "bohubbard.xyz";

function getHostname(request: NextRequest) {
  return request.headers.get("host")?.split(":")[0] ?? "";
}

function isAdminPath(pathname: string) {
  return pathname.startsWith("/admin");
}

function isPublicAsset(pathname: string) {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/images") ||
    pathname === "/favicon.ico" ||
    pathname.endsWith(".pdf")
  );
}

async function getUser(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {},
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function middleware(request: NextRequest) {
  const supabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

  const hostname = getHostname(request);
  const { pathname } = request.nextUrl;
  const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1";
  const isAdminHost =
    hostname === ADMIN_HOST ||
    hostname === `www.${ADMIN_HOST}` ||
    (isLocalhost && isAdminPath(pathname));

  if (isPublicAsset(pathname)) {
    return updateSession(request);
  }

  if (
    !isLocalhost &&
    (hostname === PUBLIC_HOST || hostname === `www.${PUBLIC_HOST}`) &&
    isAdminPath(pathname)
  ) {
    const url = request.nextUrl.clone();
    url.hostname = ADMIN_HOST;
    url.protocol = "https:";
    return NextResponse.redirect(url);
  }

  if (isAdminHost) {
    if (!isAdminPath(pathname) && pathname !== "/") {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.rewrite(url);
    }

    if (pathname === "/") {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.rewrite(url);
    }

    if (pathname === "/admin/login") {
      if (supabaseConfigured) {
        const user = await getUser(request);
        if (user) {
          const url = request.nextUrl.clone();
          url.pathname = "/admin";
          return NextResponse.redirect(url);
        }
      }
      return updateSession(request);
    }

    if (isAdminPath(pathname) && supabaseConfigured) {
      const user = await getUser(request);
      if (!user) {
        const url = request.nextUrl.clone();
        url.pathname = "/admin/login";
        url.searchParams.set("next", pathname);
        return NextResponse.redirect(url);
      }
    }
  }

  if (!supabaseConfigured) {
    return NextResponse.next();
  }

  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
