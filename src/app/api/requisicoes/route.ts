import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const perPage = Math.min(100, Math.max(1, parseInt(searchParams.get("per_page") ?? "20", 10)));
  const skip = (page - 1) * perPage;

  const [dados, total] = await prisma.$transaction([
    prisma.requisicaoIA.findMany({
      skip,
      take: perPage,
      orderBy: { criadoEm: "desc" },
      include: { modelo: { select: { nome: true, provedor: true } } },
    }),
    prisma.requisicaoIA.count(),
  ]);

  return Response.json({ dados, total, pagina: page, porPagina: perPage });
}
