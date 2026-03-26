import React from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const RISK_COLORS = {
  red: '#ff5451',
  orange: '#ffb95f',
  yellow: '#ffeb3b',
  green: '#4edea3',
};

export const RiskTrendChart = ({ trends = [] }) => {
  if (!trends.length) {
    return (
      <div style={{ color: '#9f9a99', fontSize: 12 }}>No forecast trend data available</div>
    );
  }

  const chartData = (trends[0]?.points || []).map((point, idx) => {
    const row = { day: point.day || `D${idx + 1}` };
    trends.slice(0, 4).forEach((zone) => {
      row[zone.zoneName] = zone.points?.[idx]?.score ?? null;
    });
    return row;
  });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14 }}>
      <div style={{
        background: 'rgba(28,27,27,0.78)',
        border: '1px solid rgba(91,64,62,0.15)',
        borderRadius: 4,
        padding: '12px 14px',
      }}>
        <div style={{ width: '100%', height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid stroke="rgba(91,64,62,0.22)" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fill: '#9f9a99', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: '#9f9a99', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={28}
              />
              <Tooltip
                contentStyle={{
                  background: '#171717',
                  border: '1px solid rgba(91,64,62,0.25)',
                  borderRadius: 4,
                  color: '#e5e2e1',
                  fontSize: 11,
                }}
                formatter={(value) => [`${Math.round(value)}%`, 'Predicted Risk']}
              />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              {trends.slice(0, 4).map((zone, idx) => (
                <Line
                  key={zone.zoneId}
                  type="monotone"
                  dataKey={zone.zoneName}
                  stroke={RISK_COLORS[zone.riskLabel] || '#ffb3ad'}
                  strokeWidth={2.2}
                  dot={false}
                  activeDot={{ r: 4 }}
                  isAnimationActive
                  animationDuration={900}
                  animationBegin={idx * 100}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {trends.slice(0, 4).map((zone) => {
          const points = zone.points || [];
          const start = points[0]?.score ?? 0;
          const end = points[points.length - 1]?.score ?? 0;
          const delta = end - start;
          const zoneColor = RISK_COLORS[zone.riskLabel] || '#e4beba';
          return (
            <div key={zone.zoneId} style={{
              background: 'rgba(28,27,27,0.8)',
              border: '1px solid rgba(91,64,62,0.15)',
              borderRadius: 4,
              padding: '10px 12px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: '#e5e2e1', fontSize: 11, fontWeight: 700 }}>
                  {zone.zoneName}
                </span>
                <span style={{
                  color: zoneColor,
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}>
                  {zone.riskLabel}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#9f9a99', fontSize: 10 }}>Latest: {Math.round(end)}%</span>
                <span style={{
                  color: delta >= 0 ? '#ffb95f' : '#4edea3',
                  fontSize: 10,
                  fontWeight: 700,
                }}>
                  {delta >= 0 ? '+' : ''}{Math.round(delta)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RiskTrendChart;
