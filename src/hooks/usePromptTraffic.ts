"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  aiModels,
  categories,
  cities,
  ENERGY_PER_TOKEN,
  WATER_FACTOR,
} from "@/data/ecoprompt";
import type { AiModel, City, FeedItem, FlashEvent, LineEvent } from "@/data/ecoprompt";
import type { PromptEvent } from "@/lib/prompt-events";

const INITIAL_PROMPTS = 128420;
const INITIAL_ENERGY = 54;

function weightedCity() {
  const total = cities.reduce((sum, city) => sum + city.weight, 0);
  let random = Math.random() * total;

  for (const city of cities) {
    random -= city.weight;
    if (random <= 0) return city;
  }

  return cities[0];
}

function randomCategory() {
  return categories[Math.floor(Math.random() * categories.length)];
}

function weightedModel(): AiModel {
  const total = aiModels.reduce((sum, model) => sum + model.weight, 0);
  let random = Math.random() * total;

  for (const model of aiModels) {
    random -= model.weight;
    if (random <= 0) return model;
  }

  return aiModels[0];
}

function makeId(prefix: string) {
  return prefix + "-" + Date.now() + "-" + Math.random().toString(16).slice(2);
}

function buildFeedItem(city: City, tokens: number): FeedItem {
  const energy = tokens * ENERGY_PER_TOKEN;

  return {
    id: makeId("feed"),
    city,
    category: randomCategory(),
    model: weightedModel(),
    tokens,
    energy,
    water: energy * WATER_FACTOR,
  };
}

export function usePromptTraffic() {
  const [totalPrompts, setTotalPrompts] = useState(INITIAL_PROMPTS);
  const [totalEnergy, setTotalEnergy] = useState(INITIAL_ENERGY);
  const [lastUpdate, setLastUpdate] = useState("agora");
  const [requestsPerSecond, setRequestsPerSecond] = useState(0);
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [flashes, setFlashes] = useState<FlashEvent[]>([]);
  const [lines, setLines] = useState<LineEvent[]>([]);
  const currentSecondRequests = useRef(0);
  const seenEventIds = useRef(new Set<string>());

  const pushTrafficEvent = useCallback(
    (city: City, tokens: number, feedItem: FeedItem, eventId = makeId("event")) => {
      const to = weightedCity();
      const flashId = "flash-" + eventId;
      const lineId = "line-" + eventId;

      setFlashes((current) => [...current, { id: flashId, city, tokens }]);

      if (city.name !== to.name) {
        setLines((current) => [...current, { id: lineId, from: city, to }]);
        window.setTimeout(() => {
          setLines((current) => current.filter((line) => line.id !== lineId));
        }, 5500);
      }

      window.setTimeout(() => {
        setFlashes((current) => current.filter((flash) => flash.id !== flashId));
      }, 4300);

      setFeed((current) => [feedItem, ...current].slice(0, 5));
      setTotalPrompts((current) => current + 1);
      setTotalEnergy((current) => current + feedItem.energy);
      setLastUpdate(new Date().toLocaleTimeString("pt-BR"));
      currentSecondRequests.current += 1;
    },
    [],
  );

  const simulateRequest = useCallback(() => {
    const from = weightedCity();
    const tokens = Math.floor(200 + Math.random() * 2800);
    const feedItem = buildFeedItem(from, tokens);

    pushTrafficEvent(from, tokens, feedItem);
  }, [pushTrafficEvent]);

  const applyPromptEvent = useCallback(
    (event: PromptEvent) => {
      const feedItem: FeedItem = {
        id: "feed-" + event.id,
        city: event.city,
        category: event.category,
        model: event.model,
        tokens: event.tokens,
        energy: event.energy,
        water: event.water,
      };

      pushTrafficEvent(event.city, event.tokens, feedItem, event.id);
    },
    [pushTrafficEvent],
  );

  useEffect(() => {
    const startupTimeouts: number[] = [];

    for (let index = 0; index < 8; index += 1) {
      startupTimeouts.push(window.setTimeout(simulateRequest, index * 180));
    }

    const trafficInterval = window.setInterval(() => {
      const burst = Math.floor(1 + Math.random() * 4);

      for (let index = 0; index < burst; index += 1) {
        window.setTimeout(simulateRequest, index * 170);
      }
    }, 850);

    const requestsInterval = window.setInterval(() => {
      setRequestsPerSecond(currentSecondRequests.current);
      currentSecondRequests.current = 0;
    }, 10000);

    return () => {
      startupTimeouts.forEach((timeout) => window.clearTimeout(timeout));
      window.clearInterval(trafficInterval);
      window.clearInterval(requestsInterval);
    };
  }, [simulateRequest]);

  useEffect(() => {
    let active = true;

    async function loadEvents() {
      try {
        const response = await fetch("/api/prompts", { cache: "no-store" });
        if (!response.ok) return;

        const payload = (await response.json()) as { events?: PromptEvent[] };
        const events = payload.events ?? [];

        events
          .filter((event) => !seenEventIds.current.has(event.id))
          .reverse()
          .forEach((event) => {
            if (!active) return;

            seenEventIds.current.add(event.id);
            applyPromptEvent(event);
          });
      } catch {
        // The local visual simulation keeps the panel useful if the API is unavailable.
      }
    }

    void loadEvents();
    const eventsInterval = window.setInterval(loadEvents, 1200);

    return () => {
      active = false;
      window.clearInterval(eventsInterval);
    };
  }, [applyPromptEvent]);

  return useMemo(
    () => ({
      aiModels,
      cities,
      feed,
      flashes,
      lines,
      lastUpdate,
      requestsPerSecond,
      totalPrompts,
      totalEnergy,
      totalWater: totalEnergy * WATER_FACTOR,
    }),
    [
      feed,
      flashes,
      lines,
      lastUpdate,
      requestsPerSecond,
      totalEnergy,
      totalPrompts,
    ],
  );
}
