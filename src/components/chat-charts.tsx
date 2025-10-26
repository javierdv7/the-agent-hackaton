"use client";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRef } from "react";
import { Download } from "lucide-react";

export function Chart({ data }: { data: { name: string; value: number }[] }) {
  const isMobile = useIsMobile();
  const captureRef = useRef<HTMLDivElement>(null);
  const handleDownload = async () => {
    if (!captureRef.current) return;
    const mod = await import("html2canvas-pro").catch(() => import("html2canvas"));
    const html2canvas = (mod as any).default || mod;
    const canvas = await html2canvas(captureRef.current, { backgroundColor: "#ffffff", scale: 2 });
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "chart.png";
    a.click();
  };
  return (
    <div ref={captureRef} className="relative inline-block">
      <button
        type="button"
        onClick={handleDownload}
        className="absolute top-2 right-2 z-10 flex items-center justify-center rounded-md border border-foreground/30 bg-white/80 px-2 py-1 text-xs backdrop-blur-[10px]"
      >
        <Download className="w-3 h-3 text-zinc-700" />
      </button>
      <ResponsiveContainer width={isMobile ? 300 : 600} height={300}>
        <AreaChart data={data} margin={{ left: -30, right: 20, top: 10, bottom: -10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e16e0930" />
          <XAxis dataKey="name" hide />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="value" stroke="#e16e09" fill="#e16e09" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
