"use client";

import type { CSSProperties } from "react";
import { usePromptTraffic } from "@/hooks/usePromptTraffic";
import { BrazilMapSvg } from "./BrazilMapSvg";
import { brNumber } from "./formatters";

export function TrafficMap() {
  const traffic = usePromptTraffic();

  return (
    <div className="map-card relative overflow-hidden rounded-[34px] border border-white/45 bg-white/4.5 shadow-[0_30px_90px_rgba(0,0,0,0.42)] max-lg:min-h-195">
      <div className="flex bg-black p-4 justify-between items-center gap-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#030914]/85 px-3 py-2 text-xs font-extrabold text-[#dff9ff]">
          <span className="live-dot h-2.5 w-2.5 rounded-full bg-[#ff6b6b]" />
          monitoramento em tempo real
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#030914]/85 px-3 py-2 text-xs font-extrabold text-[#dff9ff]">
          ultima atualizacao: {traffic.lastUpdate}
        </div>
      </div>
      <div className="flex px-52">
        <BrazilMapSvg/>
      </div>
      <div className="flex flex-col gap-2 min-h-56 bg-black p-5">
        {traffic.feed.map((item) => (
          <div
            className={`feed-item grid grid-cols-[1fr_auto] gap-3 rounded-xl  bg-zinc-800 px-3 py-2.5 text-xs text-[#9fb4c8] border-l-2! border-l-[${item.model.color}]!`}
            key={item.id}
          >
            <span>
              <strong className="text-white">
                {item.city.state}
              </strong>
              <em>
                - {item.model.name} / {item.model.provider}
              </em>
              <br />
              <em className="font-black not-LOCALIDADEitalic text-[#20e3b2]">
                {item.tokens.toLocaleString("pt-BR")} tokens
              </em>
            </span>
            <span>
              {brNumber(item.energy, 3)} kWh
              <br />
              {brNumber(item.water, 2)} L
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MapStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[20px] border border-white/15 bg-[#030914]/85 p-4">
      <small className="mb-1.5 block text-xs text-[#9fb4c8]">{label}</small>
      <strong className="text-xl text-white">{value}</strong>
    </div>
  );
}
