import { Header, extensionUrl } from "./Header";
import { TrafficMap } from "./TrafficMap";

const metrics = [
  ["Status", "Ao vivo"],
  ["Coleta", "Anonima"],
  ["Escopo", "Brasil"],
];

const infoCards = [
  {
    title: "Extensao do navegador",
    description:
      "A extensao envia metadados anonimizados para /api/prompts, uma rota API do proprio Next.js.",
  },
  {
    title: "Consumo de energia",
    description:
      "O sistema calcula uma estimativa de kWh com base no tamanho do prompt e na complexidade da requisicao.",
  },
  {
    title: "Consumo de agua",
    description:
      "A agua e estimada a partir do consumo energetico e de um fator ajustavel de resfriamento e infraestrutura.",
  },
];

export function EcoPromptPage() {
  return (
    <div className="min-h-screen text-[#eef7ff]">
      <Header />
      <main className="mx-auto w-[min(1300px,calc(100%-32px))] py-11">
        <section className="grid grid-cols-[0.8fr_1.2fr] items-center gap-8 max-lg:grid-cols-1">
          <div>
            <span className="mb-5 inline-flex w-fit rounded-full border border-[#20e3b2]/35 bg-[#20e3b2]/10 px-3 py-2 text-[13px] font-extrabold text-[#a7ffeb]">
              Mapa do Brasil - IA - agua e energia
            </span>
            <h1 className="m-0 max-w-[760px] text-[clamp(40px,6vw,78px)] font-black leading-[0.95] tracking-normal text-white">
              Trafego de prompts de IA no Brasil
            </h1>
            <p className="my-6 max-w-2xl text-lg leading-8 text-[#9fb4c8]">
              Visualize requisicoes de IA piscando por cidade no mapa do Brasil,
              com estimativa educativa de energia e agua consumida a cada prompt
              recebido pela rota API do Next.js.
            </p>
            <a
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-gradient-to-br from-[#20e3b2] to-[#3aa7ff] px-5 font-extrabold text-[#03131f] shadow-[0_14px_40px_rgba(32,227,178,0.22)]"
              href={extensionUrl}
            >
              Ver endpoint da coleta
            </a>

            <div className="mt-7 grid grid-cols-3 gap-3 max-sm:grid-cols-1">
              {metrics.map(([label, value]) => (
                <div
                  className="rounded-[22px] border border-white/15 bg-white/[0.08] p-4"
                  key={label}
                >
                  <small className="mb-2 block text-xs text-[#9fb4c8]">{label}</small>
                  <strong className="block text-[22px] tracking-normal text-white">
                    {value}
                  </strong>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="pt-8 bg-black/10">
          <TrafficMap />
        </section>
        <section className="mt-8 grid grid-cols-3 gap-4 max-lg:grid-cols-1">
          {infoCards.map((card) => (
            <article
              className="rounded-3xl border border-white/15 bg-white/[0.08] p-6"
              key={card.title}
            >
              <h3 className="mb-2 text-xl font-bold text-white">{card.title}</h3>
              <p className="m-0 leading-7 text-[#9fb4c8]">{card.description}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
