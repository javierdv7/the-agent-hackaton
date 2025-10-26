"use client";
import { Input } from "@/components/ui/input";
import { Mic, Send } from "lucide-react";
import { motion } from "framer-motion";
import { Spinner } from "@/components/ui/spinner";

interface ChatButtonsProps {
  input: string;
  setInput: (input: string) => void;
  handleSubmit: () => void;
  waiting: boolean;
}

export function ChatButtons({ input, setInput, handleSubmit, waiting }: ChatButtonsProps) {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleSubmit();
  };

  return (
    <motion.div className="w-full h-20 z-100 absolute bottom-20 p-2 gap-2 flex justify-center align-center" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: "easeOut" }}>
      <motion.form
        className="w-[60%] h-full flex items-center justify-center gap-2"
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { delay: 2, when: "beforeChildren", staggerChildren: 0.3 },
          },
        }}
        onSubmit={onSubmit}
      >
        <motion.button
          type="button"
          className="h-full w-20 flex items-center justify-center rounded-md bg-foreground/5 border border-foreground/70 cursor-pointer focus:border-foreground active:border-foreground 
      backdrop-blur-[10px]"
          variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
        >
          <Mic className="w-5 h-5 text-zinc-500" />
        </motion.button>
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
      </motion.form>
    </motion.div>
  );
}
