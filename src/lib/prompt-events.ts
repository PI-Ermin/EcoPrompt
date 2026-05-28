import {
  aiModels,
  categories,
  cities,
  ENERGY_PER_TOKEN,
  WATER_FACTOR,
} from "@/data/ecoprompt";
import type { AiModel, City } from "@/data/ecoprompt";
import { prisma } from "@/lib/prisma";

export type PromptEvent = {
  id: string;
  city: City;
  category: string;
  model: AiModel;
  tokens: number;
  energy: number;
  water: number;
  createdAt: number;
};

export type PromptEventInput = {
  city?: string;
  state?: string;
  category?: string;
  model?: string;
  tokens?: number;
};

const MAX_EVENTS = 80;

const store = globalThis as typeof globalThis & {
  __ecoPromptEvents?: PromptEvent[];
};

function getStore() {
  store.__ecoPromptEvents ??= [];
  return store.__ecoPromptEvents;
}

function makeId() {
  return `prompt-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function findCity(input: PromptEventInput) {
  if (!input.city) return cities[0];

  return (
    cities.find((city) => {
      const sameCity = city.name.toLowerCase() === input.city?.toLowerCase();
      const sameState = input.state
        ? city.state.toLowerCase() === input.state.toLowerCase()
        : true;

      return sameCity && sameState;
    }) ?? cities[0]
  );
}

function findModel(input: PromptEventInput) {
  if (!input.model) return aiModels[0];

  return (
    aiModels.find(
      (model) => model.name.toLowerCase() === input.model?.toLowerCase(),
    ) ?? aiModels[0]
  );
}

function findCategory(input: PromptEventInput) {
  if (!input.category) return categories[0];

  return (
    categories.find(
      (category) => category.toLowerCase() === input.category?.toLowerCase(),
    ) ?? categories[0]
  );
}

export async function createPromptEvent(
  input: PromptEventInput,
  userId?: string,
): Promise<PromptEvent> {
  const tokens = Math.min(Math.max(Math.round(input.tokens ?? 600), 1), 100000);
  const energy = tokens * ENERGY_PER_TOKEN;

  const event: PromptEvent = {
    id: makeId(),
    city: findCity(input),
    category: findCategory(input),
    model: findModel(input),
    tokens,
    energy,
    water: energy * WATER_FACTOR,
    createdAt: Date.now(),
  };

  const events = getStore();
  events.unshift(event);
  events.splice(MAX_EVENTS);

  if (userId) {
    persistToDb(event, userId).catch((err) =>
      console.error("[EcoPrompt] Falha ao persistir no banco:", err),
    );
  }

  return event;
}

async function persistToDb(event: PromptEvent, userId: string): Promise<void> {
  const modelo = await prisma.modeloIA.findFirst({
    where: { nome: event.model.name },
  });

  if (!modelo) return;

  await prisma.requisicaoIA.create({
    data: {
      usuarioId: userId,
      localizacao: `${event.city.name}/${event.city.state}`,
      totalTokens: event.tokens,
      modeloIaId: modelo.id,
      aguaGasto: event.water,
      energiaGasto: event.energy,
    },
  });
}

export function listPromptEvents() {
  return getStore();
}
