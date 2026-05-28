import { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { redis } from "@/lib/redis";

export const dynamic = "force-dynamic";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function POST(request: NextRequest): Promise<Response> {
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return Response.json({ error: "Token ausente" }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const sessionId = payload.sessionId as string | undefined;
    if (sessionId) {
      await redis.del(`session:${sessionId}`);
    }
  } catch {
    // Logout é idempotente — token inválido ainda retorna 200
  }

  return Response.json({ mensagem: "Sessão encerrada com sucesso" });
}
