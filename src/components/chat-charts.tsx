"use client";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";

export function Chart({ data }: { data: { name: string; value: number }[] }) {
  const isMobile = useIsMobile();
  return (
    <ResponsiveContainer width={isMobile ? 300 : 600} height={300}>
      <AreaChart data={data} margin={{ left: -30, right: 20, top: 10, bottom: -10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e16e0930" />
        <XAxis dataKey="name" hide />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="value" stroke="#e16e09" fill="#e16e09" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
