"use client";
import { ChatBubbles } from "./chat-bubbles";
import { ChatButtons } from "./chat-buttons";
import { useState, useEffect } from "react";
import { Message } from "@/lib/types";
import { useRef } from "react";

export const Chat = ({}) => {
  const [waiting, setWaiting] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const [name, setName] = useState("");
  const [userId, setUserId] = useState<string>("");

  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const currentAudioSrcRef = useRef<string | null>(null);
  const currentAudioIsDataUrlRef = useRef<boolean>(false);

  // Generar userId único basado en características del navegador
  useEffect(() => {
    const generateUserId = () => {
      // Intentar obtener un ID existente del localStorage
      const existingId = localStorage.getItem("chat_user_id");
      if (existingId) {
        setUserId(existingId);
        return;
      }

      // Generar un ID único basado en características del navegador
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      ctx!.textBaseline = "top";
      ctx!.font = "14px Arial";
      ctx!.fillText("User fingerprint", 2, 2);

      const fingerprint = [navigator.userAgent, navigator.language, screen.width + "x" + screen.height, new Date().getTimezoneOffset(), canvas.toDataURL()].join("|");

      // Crear hash simple del fingerprint
      let hash = 0;
      for (let i = 0; i < fingerprint.length; i++) {
        const char = fingerprint.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convertir a 32bit integer
      }

      const uniqueId = Math.abs(hash).toString();
      setUserId(uniqueId);
      localStorage.setItem("chat_user_id", uniqueId);
    };

    generateUserId();
  }, []);

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
  const [image, setImage] = useState<string | undefined>(undefined);

  const handleSubmit = async () => {
    const userMessage = input.trim();
    if (!userMessage) return;

    setWaiting(true);
    setMessages((prev) => [...prev, { text: userMessage, user: "user", type: "text" }]);
    setInput("");

    console.log(image);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, chatId: "40", userId: "6", imageBase64: image }),
      });

      if (!res.ok) {
        const errText = await res.text();
        setMessages((prev) => [...prev, { text: `Error ${res.status}: ${errText || "Solicitud fallida"}`, user: "bot", type: "text" }]);
        setWaiting(false);
        return;
      }

      let data: { aiMessage?: string; audioData?: string; chartData?: { topic: string; data: { name: string; value: number }[] } };
      try {
        data = await res.json();
      } catch {
        const text = await res.text();
        data = { aiMessage: text };
      }

      const type = data?.chartData ? "graph" : "text";

      setMessages((prev) => [...prev, { text: data?.aiMessage ?? "No hay respuesta", user: "bot", type: "text", audioData: data?.audioData }]);

      if (type === "graph" && data?.chartData) {
        try {
          setMessages((prev) => [...prev, { text: data?.aiMessage ?? "No hay respuesta", user: "bot", type, chartData: data?.chartData?.data }]);
        } catch {}
      }

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
      } else if (data.chartData != null) {
        setWaiting(false);
      } else {
        setWaiting(false);
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      setMessages((prev) => [...prev, { text: `Error de red: ${msg}`, user: "bot", type: "text" }]);
      setWaiting(false);
    }

    setImage(undefined);
  };
  return (
    <>
      <ChatBubbles messages={messages} pauseCurrentAudio={pauseCurrentAudio} isAudioPlaying={!!currentAudio} />
      <ChatButtons waiting={waiting} input={input} setInput={setInput} handleSubmit={handleSubmit} messages={messages} setImage={setImage} />
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
