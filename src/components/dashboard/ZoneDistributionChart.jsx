import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { brandTokens } from '../../theme';

const COLORS = [brandTokens.risk.green, brandTokens.risk.yellow, brandTokens.risk.orange, brandTokens.risk.red];

export const ZoneDistributionChart = ({ distribution }) => {
  const data = [
    { name: 'Safe', value: distribution.green },
    { name: 'Caution', value: distribution.yellow },
    { name: 'High', value: distribution.orange },
    { name: 'Critical', value: distribution.red },
  ];

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            borderRadius: 8,
            border: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            fontSize: 12,
          }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ZoneDistributionChart;
