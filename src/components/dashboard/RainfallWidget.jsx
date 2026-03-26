import React from "react";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const MONSOON_THRESHOLD_MM = 80;

export const RainfallWidget = ({ data = {}, forecast = [] }) => {
  const bars = (forecast || []).slice(0, 7).map((item) => {
    const mm = Number(item?.rainfall_mm || 0);
    const day = item?.date
      ? new Date(item.date).toLocaleDateString("en-US", { weekday: "short" })
      : "—";
    return {
      day,
      mm,
      monsoon: mm >= MONSOON_THRESHOLD_MM,
    };
  });

  const warning = (data?.warningLevel || "none").toLowerCase();
  const warningColor = warning === "extreme"
    ? "#ff5451"
    : warning === "high" || warning === "warning"
      ? "#ffb95f"
      : "#4edea3";

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div>
          <div style={{ color: "#e5e2e1", fontSize: 18, fontWeight: 700 }}>
            {data?.district || "N/A"}
          </div>
          <div style={{ color: "#e4beba", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Prophet 7-Day Rainfall Forecast
          </div>
        </div>
        <div style={{
          fontSize: 10,
          fontWeight: 700,
          padding: "4px 8px",
          borderRadius: 2,
          color: warningColor,
          background: `${warningColor}20`,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}>
          {warning || "none"}
        </div>
      </div>

      <div style={{ display: "flex", gap: 14, marginBottom: 8 }}>
        <div>
          <div style={{ color: "#9f9a99", fontSize: 10 }}>Last 24h</div>
          <div style={{ color: "#e5e2e1", fontSize: 18, fontWeight: 700 }}>
            {data?.rainfallLast24h || 0} mm
          </div>
        </div>
        <div>
          <div style={{ color: "#9f9a99", fontSize: 10 }}>Last 7 days</div>
          <div style={{ color: "#e5e2e1", fontSize: 18, fontWeight: 700 }}>
            {data?.rainfallLast7d || 0} mm
          </div>
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 160 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={bars}>
            <XAxis dataKey="day" tick={{ fill: "#9f9a99", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#9f9a99", fontSize: 10 }} axisLine={false} tickLine={false} width={26} />
            <Tooltip
              cursor={{ fill: "rgba(255,179,173,0.08)" }}
              contentStyle={{
                background: "#171717",
                border: "1px solid rgba(91,64,62,0.25)",
                borderRadius: 4,
                color: "#e5e2e1",
                fontSize: 11,
              }}
              formatter={(v, _, payload) => {
                const tag = payload?.payload?.monsoon ? " (Monsoon)" : "";
                return [`${v} mm${tag}`, "Rainfall"];
              }}
            />
            <Bar dataKey="mm" radius={[3, 3, 0, 0]} isAnimationActive animationDuration={900} animationEasing="ease-out">
              {bars.map((entry, idx) => (
                <Cell key={idx} fill={entry.monsoon ? "#ff5451" : "#4edea3"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ marginTop: 8, color: "#9f9a99", fontSize: 10 }}>
        Monsoon days highlighted at {MONSOON_THRESHOLD_MM}+ mm
      </div>
    </div>
  );
};

export default RainfallWidget;
