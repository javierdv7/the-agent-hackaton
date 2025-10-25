"use client";
import { Input } from "@/components/ui/input";
import { Mic, Send } from "lucide-react";
import { motion } from "framer-motion";

interface ChatButtonsProps {
  input: string;
  setInput: (input: string) => void;
  handleSubmit: () => void;
}

export function ChatButtons({ input, setInput, handleSubmit }: ChatButtonsProps) {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleSubmit();
  };

  return (
    <motion.div className="w-full h-20 absolute bottom-20 p-2 gap-2 flex justify-center align-center" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: "easeOut" }}>
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
        <motion.button type="button" className="h-full w-20 flex items-center justify-center rounded-md bg-zinc-100/5 border border-zinc-100/70 cursor-pointer focus:border-zinc-100 active:border-zinc-100" variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
          <Mic className="w-5 h-5 text-zinc-500" />
        </motion.button>
        <motion.div className="w-full h-full" variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
          <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Pregunta lo que quieras..." className="w-full h-full rounded-md bg-zinc-100/5 border border-zinc-100/70 px-10 focus:border-zinc-100 active:border-zinc-100 " />
        </motion.div>
        <motion.button
          type="submit"
          disabled={!input.trim()}
          aria-disabled={!input.trim()}
          className="h-full w-20 flex items-center justify-center rounded-md bg-zinc-100/5 border border-zinc-100/70 cursor-pointer focus:border-zinc-100 active:border-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed"
          variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
        >
          <Send className="w-5 h-5 text-zinc-500" />
        </motion.button>
      </motion.form>
    </motion.div>
  );
}
