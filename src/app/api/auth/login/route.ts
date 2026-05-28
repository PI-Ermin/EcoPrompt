import { NextRequest } from "next/server";
import { SignJWT } from "jose";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";

export const dynamic = "force-dynamic";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
const SESSION_TTL = Number(process.env.SESSION_TTL_SECONDS ?? 3600);

type LoginBody = { email: string; senha: string };

function isLoginBody(v: unknown): v is LoginBody {
  if (!v || typeof v !== "object") return false;
  const b = v as Record<string, unknown>;
  return typeof b.email === "string" && typeof b.senha === "string";
}

export async function POST(request: NextRequest): Promise<Response> {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    console.error("[EcoPrompt] JWT_SECRET inválido ou muito curto");
    return Response.json({ error: "Erro de configuração do servidor" }, { status: 500 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "JSON inválido" }, { status: 400 });
  }

  if (!isLoginBody(body)) {
    return Response.json({ error: "Email e senha são obrigatórios" }, { status: 400 });
  }

  const usuario = await prisma.usuario.findUnique({ where: { email: body.email } });

  if (!usuario || !(await bcrypt.compare(body.senha, usuario.senhaHash))) {
    return Response.json({ error: "Credenciais inválidas" }, { status: 401 });
  }

  const sessionId = randomUUID();
  await redis.set(
    `session:${sessionId}`,
    JSON.stringify({ userId: usuario.id, email: usuario.email }),
    "EX",
    SESSION_TTL,
  );

  const token = await new SignJWT({ sub: usuario.id, sessionId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL}s`)
    .sign(JWT_SECRET);

  return Response.json({ token });
}
