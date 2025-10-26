"use client";
import { Message } from "@/lib/types";
import { motion } from "framer-motion";
import React, { ReactNode, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { useIsMobile } from "@/hooks/use-mobile";

function base64ToBlob(base64: string, contentType = "audio/mpeg") {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: contentType });
}

function BubbleContent({ message, pauseCurrentAudio, isAudioPlaying }: { message: Message; pauseCurrentAudio?: () => void; isAudioPlaying?: boolean }) {
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
      <div className="flex-1">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkBreaks]}
          components={{
            a: (props) => <a {...props} className="underline" target="_blank" rel="noopener noreferrer" />,
            code: ({ inline, className, children, ...props }: { inline?: boolean; className?: string; children?: ReactNode }) => {
              const isInline = Boolean(inline);
              if (isInline) {
                return (
                  <code className="px-1 rounded bg-white/10" {...props}>
                    {children}
                  </code>
                );
              }
              const content = String(children).replace(/\n$/, "");
              return (
                <pre className="p-3 rounded bg-black/30 overflow-x-auto" {...props}>
                  <code className={className}>{content}</code>
                </pre>
              );
            },
            ul: (props) => <ul {...props} className="list-disc pl-4" />,
            ol: (props) => <ol {...props} className="list-decimal pl-4" />,
            blockquote: (props) => <blockquote {...props} className="border-l pl-4 opacity-80" />,
            strong: (props) => <strong {...props} className="text-[#e16e09]" />,
          }}
        >
          {message.text}
        </ReactMarkdown>
      </div>
      {message.user === "bot" && message.audioData && (
        <button
          type="button"
          onClick={() => {
            if (isAudioPlaying && pauseCurrentAudio) {
              pauseCurrentAudio();
              return;
            }
            if (isPlaying) {
              stopAudio();
            } else {
              playAudio();
            }
          }}
          className="size-7 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 border border-white/30 text-white"
        >
          {isAudioPlaying || isPlaying ? <Pause className="size-4" /> : <Play className="size-4" />}
        </button>
      )}
    </div>
  );
}

function Bubble({ message, pauseCurrentAudio, isAudioPlaying }: { message: Message; pauseCurrentAudio?: () => void; isAudioPlaying?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={` user-select-auto pointer-events-auto
      relative p-4 rounded-[20px] max-w-[80%] break-words
      backdrop-blur-[2px]
      border
      ${message.user === "user" ? "self-end text-white bg-[#e16e09]/30 border-[#e16e09]/50 shadow-[0_8px_32px_rgba(225,110,9,0.25)]" : "self-start text-foreground-900 bg-white/15 border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.15)]"}
    `}
    >
      <BubbleContent message={message} pauseCurrentAudio={pauseCurrentAudio} isAudioPlaying={isAudioPlaying} />
    </motion.div>
  );
}

export function ChatBubbles({ messages, pauseCurrentAudio, isAudioPlaying }: { messages: Message[]; pauseCurrentAudio?: () => void; isAudioPlaying?: boolean }) {
  const isMobile = useIsMobile();
  return (
    <motion.div className={`flex w-full h-full z-[200] absolute pb-28 pt-20 flex ${isMobile ? "justify-end" : "justify-center"} align-center user-select-none pointer-events-none`} initial="hidden" animate="show">
      <motion.div
        className={`h-full w-[${isMobile ? "100%" : "50%"}] flex flex-col gap-4 px-4 justify-end`}
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { delay: 3, when: "beforeChildren", staggerChildren: 0.5 },
          },
        }}
      >
        {messages.map((message, index) => (
          <Bubble key={index} message={message} pauseCurrentAudio={pauseCurrentAudio} isAudioPlaying={isAudioPlaying} />
        ))}
      </motion.div>
    </motion.div>
  );
}
