export type City = {
  name: string;
  state: string;
  x: number;
  y: number;
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
};

export type LineEvent = {
  id: string;
  from: City;
  to: City;
};

export const WATER_FACTOR = 6.44;
export const ENERGY_PER_TOKEN = 0.0000018;

export const cities: City[] = [
  { name: "Manaus", state: "AM", x: 31, y: 35, weight: 5 },
  { name: "Belem", state: "PA", x: 54, y: 25, weight: 5 },
  { name: "Fortaleza", state: "CE", x: 72, y: 26, weight: 8 },
  { name: "Recife", state: "PE", x: 79, y: 33, weight: 7 },
  { name: "Salvador", state: "BA", x: 72, y: 45, weight: 7 },
  { name: "Brasilia", state: "DF", x: 56, y: 53, weight: 8 },
  { name: "Belo Horizonte", state: "MG", x: 64, y: 60, weight: 8 },
  { name: "Rio de Janeiro", state: "RJ", x: 66, y: 67, weight: 9 },
  { name: "Sao Paulo", state: "SP", x: 59, y: 69, weight: 14 },
  { name: "Curitiba", state: "PR", x: 55, y: 74, weight: 7 },
  { name: "Porto Alegre", state: "RS", x: 51, y: 84, weight: 6 },
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
  { name: "ChatGPT", provider: "OpenAI", color: "#20e3b2", weight: 14 },
  { name: "Claude", provider: "Anthropic", color: "#ffb86b", weight: 8 },
  { name: "Gemini", provider: "Google", color: "#8ab4ff", weight: 9 },
  { name: "DeepSeek", provider: "DeepSeek", color: "#7dd3fc", weight: 6 },
  { name: "Grok", provider: "xAI", color: "#d8b4fe", weight: 5 },
  { name: "Copilot", provider: "Microsoft", color: "#a7f3d0", weight: 7 },
];
