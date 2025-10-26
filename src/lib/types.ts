export interface Message {
  text: string;
  user: "bot" | "user";
  audioData?: string;
}

export interface Conversations {
  name: string;
  messages: Message[];
}
[];
