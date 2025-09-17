"use client";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function RevenueChart({ data, stroke }: { data: any[]; stroke: string }) {
  return (
    <div className="h-[260px] mt-3">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
          <CartesianGrid stroke="rgba(120,120,120,0.15)" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fill: "currentColor" }}
            stroke="rgba(120,120,120,0.25)"
          />
          <YAxis tick={{ fill: "currentColor" }} stroke="rgba(120,120,120,0.25)" />
          <Tooltip
            contentStyle={{
              background: "var(--tooltip-bg)",
              border: "1px solid var(--tooltip-border)",
              borderRadius: 8,
            }}
            labelStyle={{ color: "var(--tooltip-text)" }}
            itemStyle={{ color: "var(--tooltip-value)" }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={stroke}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
