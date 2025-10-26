"use client";
import { ChatBubbles } from "./chat-bubbles";
import { ChatButtons } from "./chat-buttons";
import { useState } from "react";
import { Message } from "@/lib/types";
import { useRef } from "react";

export const Chat = ({}) => {
  const [waiting, setWaiting] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const currentAudioSrcRef = useRef<string | null>(null);
  const currentAudioIsDataUrlRef = useRef<boolean>(false);

  const pauseCurrentAudio = () => {
    const a = currentAudio;
    if (!a) return;
    try {
      a.pause();
    } catch {}
    const src = currentAudioSrcRef.current;
    const isDataUrl = currentAudioIsDataUrlRef.current;
    if (src && !isDataUrl && src.startsWith("blob:")) {
      URL.revokeObjectURL(src);
    }
    setCurrentAudio(null);
    currentAudioSrcRef.current = null;
    setWaiting(false);
  };

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
        body: JSON.stringify({ message: userMessage, chatId: "1", userId: "1" }),
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

          currentAudioIsDataUrlRef.current = isDataUrl;
          currentAudioSrcRef.current = src;
          setCurrentAudio(audio);

          audio.onended = () => {
            if (!isDataUrl) URL.revokeObjectURL(src);
            setWaiting(false);
            setCurrentAudio(null);
            currentAudioSrcRef.current = null;
          };
          audio.onerror = () => {
            if (!isDataUrl) URL.revokeObjectURL(src);
            setWaiting(false);
            setCurrentAudio(null);
            currentAudioSrcRef.current = null;
          };

          audio.play().catch(() => {
            setMessages((prev) => [...prev, { text: "Reproducción automática bloqueada. Usa el botón para escuchar.", user: "bot" }]);
            if (!isDataUrl) URL.revokeObjectURL(src);
            setWaiting(false);
            setCurrentAudio(null);
            currentAudioSrcRef.current = null;
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
      <ChatBubbles messages={messages} pauseCurrentAudio={pauseCurrentAudio} isAudioPlaying={!!currentAudio} />
      <ChatButtons waiting={waiting} input={input} setInput={setInput} handleSubmit={handleSubmit} messages={messages} />
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
