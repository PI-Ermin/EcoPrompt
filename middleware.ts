import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

const PUBLIC_ROUTES = [
  "/api/auth/login",
  "/api/auth/logout",
  "/api/auth/session",
];

export const config = {
  matcher: ["/api/:path*"],
};

export async function middleware(request: NextRequest): Promise<NextResponse | Response> {
  const { pathname } = request.nextUrl;

  // Rotas públicas e GET /api/prompts (leitura do mapa em tempo real)
  if (
    PUBLIC_ROUTES.some((route) => pathname.startsWith(route)) ||
    (pathname.startsWith("/api/prompts") && request.method === "GET")
  ) {
    return NextResponse.next();
  }

  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return Response.json({ error: "Token de autenticação ausente" }, { status: 401 });
  }

  let sessionId: string;
  let userId: string;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    sessionId = payload.sessionId as string;
    userId = payload.sub as string;
  } catch {
    return Response.json({ error: "Token inválido ou expirado" }, { status: 401 });
  }

  // Valida existência da sessão no Redis via rota interna (Node.js runtime)
  const sessionUrl = new URL("/api/auth/session", request.url);
  const sessionResponse = await fetch(sessionUrl.toString(), {
    headers: {
      "x-session-id": sessionId,
      "x-internal-key": process.env.INTERNAL_API_KEY ?? "",
    },
  });

  if (!sessionResponse.ok) {
    return Response.json({ error: "Sessão não encontrada ou expirada" }, { status: 401 });
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-user-id", userId);

  return NextResponse.next({ request: { headers: requestHeaders } });
}
