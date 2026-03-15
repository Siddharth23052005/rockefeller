import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { brandTokens } from '../../theme';

export const RiskTrendChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E0E4EA" />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} interval={4} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip
          contentStyle={{
            borderRadius: 8,
            border: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            fontSize: 12,
          }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line type="monotone" dataKey="critical" stroke={brandTokens.risk.red} strokeWidth={2} dot={false} name="Critical" />
        <Line type="monotone" dataKey="high" stroke={brandTokens.risk.orange} strokeWidth={2} dot={false} name="High" />
        <Line type="monotone" dataKey="caution" stroke={brandTokens.risk.yellow} strokeWidth={2} dot={false} name="Caution" />
        <Line type="monotone" dataKey="safe" stroke={brandTokens.risk.green} strokeWidth={2} dot={false} name="Safe" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default RiskTrendChart;
