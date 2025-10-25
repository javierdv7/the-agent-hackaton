"use client";
import { ChatBubbles } from "./chat-bubbles";
import { ChatButtons } from "./chat-buttons";
import { useState } from "react";
import { Message } from "@/lib/types";

export const Chat = ({}) => {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello, I am EnergIA. How can I help you?", user: "bot" },
    { text: "I want to know the price of the energy", user: "user" },
  ]);
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    setMessages([...messages, { text: input, user: "user" }]);
    setInput("");
  };
  return (
    <>
      <ChatBubbles messages={messages} />
      <ChatButtons input={input} setInput={setInput} handleSubmit={handleSubmit} />
    </>
  );
};
