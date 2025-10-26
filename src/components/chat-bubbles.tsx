"use client";
import { Message } from "@/lib/types";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

function base64ToBlob(base64: string, contentType = "audio/mpeg") {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: contentType });
}

function BubbleContent({ message }: { message: Message }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = () => {
    if (!message.audioData) return;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    const isDataUrl = message.audioData.startsWith("data:audio");
    const src = isDataUrl ? message.audioData : URL.createObjectURL(base64ToBlob(message.audioData, "audio/mpeg"));
    const audio = new Audio(src);
    audioRef.current = audio;
    audio.onended = () => {
      setIsPlaying(false);
      if (!isDataUrl && src.startsWith("blob:")) URL.revokeObjectURL(src);
      audioRef.current = null;
    };
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  };

  const stopAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    const src = audio.src;
    if (src.startsWith("blob:")) URL.revokeObjectURL(src);
    audioRef.current = null;
    setIsPlaying(false);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="flex-1">{message.text}</span>
      {message.user === "bot" && message.audioData && (
        <button type="button" onClick={isPlaying ? stopAudio : playAudio} className="size-7 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 border border-white/30 text-white">
          {isPlaying ? <Pause className="size-4" /> : <Play className="size-4" />}
        </button>
      )}
    </div>
  );
}

function ChatBubble({ message }: { message: Message }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={` user-select-auto pointer-events-auto
      relative p-4 rounded-[20px] max-w-[70%] break-words
      backdrop-blur-[2px]
      border
      ${message.user === "user" ? "self-end text-white bg-[#e16e09]/30 border-[#e16e09]/50 shadow-[0_8px_32px_rgba(225,110,9,0.25)]" : "self-start text-foreground-900 bg-white/15 border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.15)]"}
    `}
    >
      <BubbleContent message={message} />
    </motion.div>
  );
}

export function ChatBubbles({ messages }: { messages: Message[] }) {
  return (
    <motion.div className="flex w-full h-full z-100 absolute pb-44 pt-20 flex justify-center align-center user-select-none pointer-events-none" initial="hidden" animate="show">
      <motion.div
        className="h-full w-[50%] flex flex-col gap-4 justify-end"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { delay: 3, when: "beforeChildren", staggerChildren: 0.5 },
          },
        }}
      >
        {messages.map((message, index) => (
          <ChatBubble key={index} message={message} />
        ))}
      </motion.div>
    </motion.div>
  );
}
