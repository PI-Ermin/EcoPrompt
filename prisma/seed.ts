import { PrismaClient } from "@prisma/client";
import { aiModels } from "../src/data/ecoprompt";

const prisma = new PrismaClient();

async function main() {
  for (const model of aiModels) {
    await prisma.modeloIA.upsert({
      where: { nome: model.name },
      update: { provedor: model.provider, cor: model.color, peso: model.weight },
      create: { nome: model.name, provedor: model.provider, cor: model.color, peso: model.weight },
    });
  }
  console.log(`Seed concluído: ${aiModels.length} modelos inseridos/atualizados.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
