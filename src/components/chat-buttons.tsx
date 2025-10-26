"use client";
import { Input } from "@/components/ui/input";
import { Mic, Plus, Send, Paperclip, File } from "lucide-react";
import { motion } from "framer-motion";
import { Spinner } from "@/components/ui/spinner";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRef, useState, useEffect } from "react";
import { Message } from "@/lib/types";
import { Conversation } from "@/components/call";

interface ChatButtonsProps {
  input: string;
  setInput: (input: string) => void;
  handleSubmit: () => void;
  waiting: boolean;
  messages: Message[];
  setImage: (image: string | undefined) => void;
}

const chatButtons = ["Información de tarifa eléctrica", "Cuáles son mis datos actuales?", "Grafica mi corriente de hoy"];

export function ChatButtons({ input, setInput, handleSubmit, waiting, messages, setImage }: ChatButtonsProps) {
  const isMobile = useIsMobile();
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  const startVoiceInput = () => {
    if (waiting) return;
    if (typeof window === "undefined") return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Tu navegador no soporta reconocimiento de voz.");
      return;
    }
    if (isRecording && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "es-ES";
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => setIsRecording(true);
    recognition.onresult = (event: any) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setInput(transcript);
    };
    recognition.onerror = () => {
      setIsRecording(false);
      recognitionRef.current = null;
    };
    recognition.onend = () => {
      setIsRecording(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setAttachment(undefined);
    e.preventDefault();
    if (!input.trim()) return;
    handleSubmit();
  };

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
        recognitionRef.current = null;
      }
    };
  }, []);

  // Adjuntos: estado, menú y ref del input de archivos
  const [attachment, setAttachment] = useState<{ name: string; type: string; size: number; base64: string; previewUrl?: string } | undefined>(undefined);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.includes("base64,") ? result.split("base64,")[1] : result;
        const previewUrl = file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined;

        setAttachment({ name: file.name, type: file.type, size: file.size, base64, previewUrl });
        setImage(base64);
      };
      reader.readAsDataURL(file);
    });

    // limpiar el input para permitir re-selección del mismo archivo
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handlePickFile = () => {
    fileInputRef.current?.click();
  };

  // Puedes acceder a los base64 así:
  // const attachmentsBase64 = attachments.map((a) => a.base64);
  return (
    <motion.div
      className={`flex-col w-full  ${messages.length === 0 ? "h-45" : "h-20"} z-[200] absolute bottom-5 p-2 gap-2 flex justify-end items-center`}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: isMobile ? 0 : 2, when: "beforeChildren", staggerChildren: 0.3 }}
    >
      {messages.length === 0 && (
        <motion.div className={`h-15 ${isMobile ? "w-full flex-col justify-end" : " w-[50%]"} flex gap-2 flex items-center justify-center`}>
          {chatButtons.map((button, index) => (
            <motion.button
              onClick={() => setInput(button)}
              key={index}
              variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
              className={`h-full hover:bg-[#e16e09]/30 hover:border-[#e16e09]/70 transition-all duration-100 ${isMobile ? "w-full h-5" : "w-[33.33%]"} flex items-center justify-center border rounded-md cursor-pointer bg-white/50 backdrop-blur-[10px]`}
            >
              &quot;{button}&quot;
            </motion.button>
          ))}
        </motion.div>
      )}
      {attachment != undefined && (
        <motion.div className="h-10 w-[50%] flex gap-2 flex items-center justify-start">
          <motion.button
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
            className="h-full hover:bg-[#e16e09]/30 hover:border-[#e16e09]/70 transition-all duration-100 gap-2 w-[33.33%] flex items-center justify-start px-2 border rounded-md cursor-pointer bg-white/30 backdrop-blur-[10px]"
          >
            <File className="w-5 h-5 text-[#e16e09]" />
            &quot;{attachment.name}&quot;
          </motion.button>
        </motion.div>
      )}
      <motion.form
        className={`w-[60%] min-h-15 flex items-center justify-center gap-2 ${isMobile ? "w-full" : ""} relative`}
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { delay: isMobile ? 0 : 2, when: "beforeChildren", staggerChildren: 0.3 },
          },
        }}
        onSubmit={onSubmit}
      >
        {/* Botón + con menú de adjuntos */}
        <motion.button
          type="button"
          onClick={handlePickFile}
          className={`h-full w-20 flex items-center justify-center rounded-md border cursor-pointer backdrop-blur-[10px] ${
            isRecording ? "bg-[#e16e09]/30 border-[#e16e09]/70 focus:border-[#e16e09] active:border-[#e16e09]" : "bg-foreground/5 border-foreground/70 focus:border-foreground active:border-foreground"
          }`}
          variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
        >
          <Plus className={`w-5 h-5 ${isRecording ? "text-[#e16e09]" : "text-zinc-500"}`} />
        </motion.button>

        {/* Input de archivos oculto */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
          // Opcional: limitar tipos
          // accept="image/*,.pdf,.csv,.xlsx,.txt"
        />

        <motion.div className="w-full h-full" variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
          <Input
            disabled={waiting}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pregunta lo que quieras..."
            className="w-full h-full rounded-md bg-foreground/5 border border-foreground/70 px-10 focus:border-foreground active:border-foreground  
      backdrop-blur-[10px]"
          />
        </motion.div>

        {/* ... resto de botones (Enviar y Micro) */}
        <motion.button
          type="submit"
          disabled={!input.trim() || waiting}
          aria-disabled={!input.trim() || waiting}
          className={`h-full w-20 flex items-center justify-center rounded-md  border border-[#e16e09]/50 cursor-pointer focus:border-foreground active:border-foreground disabled:opacity-50 disabled:cursor-not-allowed 
      backdrop-blur-[10px] ${!input.trim() ? "opacity-50 cursor-not-allowed bg-foreground/5 border-foreground/70" : "bg-[#e16e09]/30 border-[#e16e09]/70"} transition-all duration-200`}
          variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
        >
          {waiting ? <Spinner /> : <Send className={`w-5 h-5  transition-all duration-200 ${!input.trim() && !waiting ? "text-foreground/70" : "text-[#e16e09]"}`} />}
        </motion.button>
        <Conversation />
      </motion.form>
    </motion.div>
  );
}
