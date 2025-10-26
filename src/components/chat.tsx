"use client";
import { ChatBubbles } from "./chat-bubbles";
import { ChatButtons } from "./chat-buttons";
import { useState } from "react";
import { Conversations, Message } from "@/lib/types";

export const Chat = ({}) => {
  const [waiting, setWaiting] = useState(false);
  const [conversations, setConversations] = useState<Conversations>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const handleSubmit = async () => {
    const userMessage = input.trim();
    if (!userMessage) return;

    setWaiting(true);
    setMessages((prev) => [...prev, { text: userMessage, user: "user" }]);
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!res.ok) {
        const errText = await res.text();
        setMessages((prev) => [...prev, { text: `Error ${res.status}: ${errText || "Solicitud fallida"}`, user: "bot" }]);
        setWaiting(false);
        return;
      }

      let data: { aiMessage?: string; audioData?: string };
      try {
        data = await res.json();
      } catch {
        const text = await res.text();
        data = { aiMessage: text };
      }

      const botText = data?.aiMessage ?? "Sin respuesta del servidor";
      setMessages((prev) => [...prev, { text: botText, user: "bot", audioData: data?.audioData }]);

      // Control de espera ligado al audio
      if (data?.audioData) {
        try {
          const isDataUrl = data.audioData.startsWith("data:audio");
          const src = isDataUrl ? data.audioData : URL.createObjectURL(base64ToBlob(data.audioData, "audio/mpeg"));
          const audio = new Audio(src);

          audio.onended = () => {
            if (!isDataUrl) URL.revokeObjectURL(src);
            setWaiting(false);
          };
          audio.onerror = () => {
            if (!isDataUrl) URL.revokeObjectURL(src);
            setWaiting(false);
          };

          audio.play().catch(() => {
            setMessages((prev) => [...prev, { text: "Reproducción automática bloqueada. Usa el botón para escuchar.", user: "bot" }]);
            if (!isDataUrl) URL.revokeObjectURL(src);
            setWaiting(false);
          });
        } catch {
          setMessages((prev) => [...prev, { text: "Error al preparar el audio recibido.", user: "bot" }]);
          setWaiting(false);
        }
      } else {
        // No hay audio, terminamos la espera ya
        setWaiting(false);
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      setMessages((prev) => [...prev, { text: `Error de red: ${msg}`, user: "bot" }]);
      setWaiting(false);
    }
  };
  return (
    <>
      <ChatBubbles messages={messages} />
      <ChatButtons waiting={waiting} input={input} setInput={setInput} handleSubmit={handleSubmit} />
    </>
  );
};

// Convierte base64 a Blob (ajusta el tipo si tu backend usa wav/ogg)
function base64ToBlob(base64: string, contentType = "audio/mpeg") {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: contentType });
}
