export type City = {
  name: string;
  state: string;
  x: number;
  y: number;
  svgX: number;
  svgY: number;
  weight: number;
};

export type FeedItem = {
  id: string;
  city: City;
  category: string;
  model: AiModel;
  tokens: number;
  energy: number;
  water: number;
};

export type AiModel = {
  name: string;
  provider: string;
  color: string;
  weight: number;
};

export type FlashEvent = {
  id: string;
  city: City;
  tokens: number;
  modelColor: string;
};

export type LineEvent = {
  id: string;
  from: City;
  to: City;
};

export const WATER_FACTOR = 6.44;
export const ENERGY_PER_TOKEN = 0.0000018;

export const cities: City[] = [
  { name: "Manaus",          state: "AM", x: 24, y: 26, svgX: 215, svgY: 233, weight: 5  },
  { name: "Boa Vista",       state: "RR", x: 33, y: 11, svgX: 300, svgY: 101, weight: 2  },
  { name: "Macapa",          state: "AP", x: 55, y: 14, svgX: 493, svgY: 124, weight: 2  },
  { name: "Belem",           state: "PA", x: 51, y: 26, svgX: 461, svgY: 260, weight: 5  },
  { name: "Sao Luis",        state: "MA", x: 69, y: 28, svgX: 623, svgY: 254, weight: 4  },
  { name: "Fortaleza",       state: "CE", x: 82, y: 27, svgX: 741, svgY: 247, weight: 8  },
  { name: "Natal",           state: "RN", x: 89, y: 29, svgX: 798, svgY: 264, weight: 4  },
  { name: "Joao Pessoa",     state: "PB", x: 90, y: 32, svgX: 811, svgY: 292, weight: 4  },
  { name: "Recife",          state: "PE", x: 84, y: 35, svgX: 760, svgY: 315, weight: 7  },
  { name: "Teresina",        state: "PI", x: 75, y: 34, svgX: 671, svgY: 311, weight: 3  },
  { name: "Maceio",          state: "AL", x: 89, y: 38, svgX: 801, svgY: 345, weight: 4  },
  { name: "Aracaju",         state: "SE", x: 87, y: 40, svgX: 785, svgY: 360, weight: 3  },
  { name: "Salvador",        state: "BA", x: 78, y: 44, svgX: 698, svgY: 398, weight: 7  },
  { name: "Rio Branco",      state: "AC", x: 15, y: 38, svgX: 137, svgY: 346, weight: 2  },
  { name: "Porto Velho",     state: "RO", x: 29, y: 40, svgX: 260, svgY: 364, weight: 3  },
  { name: "Palmas",          state: "TO", x: 62, y: 40, svgX: 562, svgY: 362, weight: 3  },
  { name: "Cuiaba",          state: "MT", x: 46, y: 47, svgX: 410, svgY: 420, weight: 4  },
  { name: "Goiania",         state: "GO", x: 59, y: 54, svgX: 527, svgY: 488, weight: 6  },
  { name: "Brasilia",        state: "DF", x: 64, y: 52, svgX: 574, svgY: 469, weight: 8  },
  { name: "Belo Horizonte",  state: "MG", x: 72, y: 58, svgX: 644, svgY: 527, weight: 8  },
  { name: "Vitoria",         state: "ES", x: 81, y: 60, svgX: 724, svgY: 543, weight: 5  },
  { name: "Rio de Janeiro",  state: "RJ", x: 76, y: 68, svgX: 680, svgY: 610, weight: 9  },
  { name: "Sao Paulo",       state: "SP", x: 62, y: 67, svgX: 561, svgY: 605, weight: 14 },
  { name: "Campo Grande",    state: "MS", x: 48, y: 63, svgX: 430, svgY: 563, weight: 4  },
  { name: "Curitiba",        state: "PR", x: 55, y: 73, svgX: 490, svgY: 659, weight: 7  },
  { name: "Florianopolis",   state: "SC", x: 59, y: 80, svgX: 528, svgY: 719, weight: 6  },
  { name: "Porto Alegre",    state: "RS", x: 51, y: 86, svgX: 461, svgY: 773, weight: 6  },
];

export const categories = [
  "Estudo",
  "Codigo",
  "Pesquisa",
  "Produtividade",
  "Texto",
  "Trabalho",
];

export const aiModels: AiModel[] = [
  { name: "ChatGPT",  provider: "OpenAI",    color: "#3b82f6", weight: 14 },
  { name: "Claude",   provider: "Anthropic", color: "#f97316", weight: 8  },
  { name: "Gemini",   provider: "Google",    color: "#facc15", weight: 9  },
  { name: "DeepSeek", provider: "DeepSeek",  color: "#22d3ee", weight: 6  },
  { name: "Grok",     provider: "xAI",       color: "#a855f7", weight: 5  },
  { name: "Copilot",  provider: "Microsoft", color: "#4ade80", weight: 7  },
];
