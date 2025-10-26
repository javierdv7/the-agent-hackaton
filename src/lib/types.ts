export interface Message {
  text: string;
  user: "bot" | "user";
  type?: "text" | "graph";
  audioData?: string;
  chartData?: { name: string; value: number }[];
}

export interface Conversations {
  name: string;
  messages: Message[];
}
[];
