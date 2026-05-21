"use client";

import { usePromptTraffic } from "@/hooks/usePromptTraffic";
import { BrazilMapSvg } from "./BrazilMapSvg";
import { brNumber } from "./formatters";

export function TrafficMap() {
  const traffic = usePromptTraffic();

  return (
    <div className="map-card relative overflow-hidden rounded-[34px] border border-white/45 bg-white/4.5 shadow-[0_30px_90px_rgba(0,0,0,0.42)]">
      <div className="flex bg-black p-4 justify-between items-center gap-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#030914]/85 px-3 py-2 text-xs font-extrabold text-[#dff9ff]">
          <span className="live-dot h-2.5 w-2.5 rounded-full bg-[#ff6b6b]" />
          monitoramento em tempo real
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#030914]/85 px-3 py-2 text-xs font-extrabold text-[#dff9ff]">
          ultima atualizacao: {traffic.lastUpdate}
        </div>
      </div>
      <div className="relative flex px-52">
        <BrazilMapSvg flashes={traffic.flashes} />
        <div className="absolute bottom-4 left-4 flex flex-col gap-2 rounded-2xl border border-white/15 bg-[#030914]/80 p-3 backdrop-blur">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#9fb4c8]">Modelos</p>
          {traffic.aiModels.map((model) => (
            <div key={model.name} className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: model.color, boxShadow: `0 0 5px ${model.color}99` }}
              />
              <span className="text-xs font-semibold text-white">{model.name}</span>
            </div>
          ))}
        </div>
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

