import { NextRequest } from "next/server";
import { redis } from "@/lib/redis";

export const dynamic = "force-dynamic";

// Rota interna — chamada apenas pelo middleware para validar sessões no Redis.
// Protegida por INTERNAL_API_KEY para evitar uso externo.
export async function GET(request: NextRequest): Promise<Response> {
  const internalKey = request.headers.get("x-internal-key");
  if (!internalKey || internalKey !== process.env.INTERNAL_API_KEY) {
    return Response.json({ error: "Não autorizado" }, { status: 401 });
  }

  const sessionId = request.headers.get("x-session-id");
  if (!sessionId) {
    return Response.json({ error: "session_id ausente" }, { status: 400 });
  }

  const session = await redis.get(`session:${sessionId}`);
  if (!session) {
    return Response.json({ error: "Sessão não encontrada" }, { status: 404 });
  }

  return Response.json({ valida: true });
}
