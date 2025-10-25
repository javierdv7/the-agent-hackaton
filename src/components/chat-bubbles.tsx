"use client";
import { Message } from "@/lib/types";
import { motion } from "framer-motion";

function ChatBubble({ message }: { message: Message }) {
  return (
    <div
      className={`
      relative p-4 rounded-[20px] max-w-[70%] break-words
      backdrop-blur-[10px]
      border
      ${message.user === "user" ? "self-end text-white bg-[#e16e09]/30 border-[#e16e09]/50 shadow-[0_8px_32px_rgba(225,110,9,0.25)]" : "self-start text-foreground-900 bg-white/15 border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.15)]"}
    `}
    >
      {message.text}
    </div>
  );
}

export function ChatBubbles({ messages }: { messages: Message[] }) {
  return (
    <motion.div className="flex w-full h-full absolute pb-44 pt-20 flex justify-center align-center user-select-none pointer-events-none" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: "easeOut" }}>
      <div className="h-full w-[50%] flex flex-col gap-4 justify-end">
        {messages.slice(-10).map((message, index) => (
          <ChatBubble key={index} message={message} />
        ))}
      </div>
    </motion.div>
  );
}
