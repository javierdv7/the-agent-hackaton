"use client";

import { useConversation } from "@elevenlabs/react";
import { useCallback } from "react";
import { Phone, PhoneOff } from "lucide-react";
import { motion } from "framer-motion";

export function Conversation() {
  const conversation = useConversation({
    onConnect: () => console.log("Connected"),
    onDisconnect: () => console.log("Disconnected"),
    onMessage: (message) => console.log("Message:", message),
    onError: (error) => console.error("Error:", error),
  });

  const startConversation = useCallback(async () => {
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Start the conversation with your agent
      await conversation.startSession({
        agentId: "agent_5101k82d9fjzekv8089ha57yytfe", // Replace with your agent ID
        userId: "1", // Optional field for tracking your end user IDs
        connectionType: "webrtc", // either "webrtc" or "websocket"
      });
    } catch (error) {
      console.error("Failed to start conversation:", error);
    }
  }, [conversation]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  return (
    <motion.button
      type="button"
      onClick={conversation.status === "connected" ? stopConversation : startConversation}
      className={`h-full w-20 flex items-center justify-center rounded-md border cursor-pointer backdrop-blur-[10px] ${conversation.status == "connected" ? "bg-[#e16e09]/50 border-[#e16e09]/70" : "bg-foreground/5 border-foreground/70"} `}
      variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
    >
      {conversation.status === "connected" ? <PhoneOff /> : <Phone />}
    </motion.button>
  );
}
