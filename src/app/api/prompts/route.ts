import { createPromptEvent, listPromptEvents } from "@/lib/prompt-events";
import type { PromptEventInput } from "@/lib/prompt-events";

export const dynamic = "force-dynamic";

function isPromptEventInput(value: unknown): value is PromptEventInput {
  if (!value || typeof value !== "object") return false;

  const input = value as Record<string, unknown>;
  const validText = (key: string) =>
    input[key] === undefined || typeof input[key] === "string";
  const validTokens =
    input.tokens === undefined ||
    (typeof input.tokens === "number" && Number.isFinite(input.tokens));

  return (
    validText("city") &&
    validText("state") &&
    validText("category") &&
    validText("model") &&
    validTokens
  );
}

export async function GET() {
  return Response.json({
    events: listPromptEvents(),
  });
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "JSON invalido" }, { status: 400 });
  }

  if (!isPromptEventInput(body)) {
    return Response.json({ error: "Payload invalido" }, { status: 400 });
  }

  const event = createPromptEvent(body);

  return Response.json({ event }, { status: 201 });
}
