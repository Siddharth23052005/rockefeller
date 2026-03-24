import React from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
  AreaChart, Area, ScatterChart, Scatter, ZAxis,
  LineChart, Line, PieChart, Pie, Cell,
} from 'recharts';
import { Box, Grid, Typography } from '@mui/material';
import { brandTokens } from '../../theme';
import { SectionCard } from '../common/SectionCard';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const genMonthlyIncidents = () => MONTHS.map((m) => ({
  month: m, incidents: Math.floor(Math.random() * 8) + 1
}));

const genRiskOverTime = () => MONTHS.map((m) => ({
  month: m,
  safe: 4 + Math.floor(Math.random() * 3),
  caution: 3 + Math.floor(Math.random() * 2),
  high: 2 + Math.floor(Math.random() * 3),
  critical: 1 + Math.floor(Math.random() * 2),
}));

const genBlastVsRisk = () => Array.from({ length: 20 }, () => ({
  blasts: Math.floor(Math.random() * 12) + 1,
  riskScore: Math.floor(Math.random() * 80) + 20,
}));

const genRainfallVsIncidents = () => MONTHS.map((m) => ({
  month: m,
  rainfall: Math.floor(Math.random() * 200) + 20,
  incidents: Math.floor(Math.random() * 6) + 1,
}));

const DISTRICT_DATA = [
  { district: 'Pune', risk: 78 },
  { district: 'Satara', risk: 85 },
  { district: 'Ratnagiri', risk: 45 },
  { district: 'Raigad', risk: 62 },
  { district: 'Nagpur', risk: 70 },
  { district: 'Kolhapur', risk: 35 },
];

const SOIL_DATA = [
  { name: 'Laterite', value: 35 },
  { name: 'Black Cotton', value: 20 },
  { name: 'Alluvial', value: 15 },
  { name: 'Sandy Loam', value: 15 },
  { name: 'Rocky', value: 15 },
];

const SOIL_COLORS = ['#B71C1C', '#E65100', '#F9A825', '#0288D1', '#2E7D32'];

const tooltipStyle = { borderRadius: 8, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', fontSize: 12 };

export const AnalyticsCharts = () => {
  const monthly = genMonthlyIncidents();
  const riskTime = genRiskOverTime();
  const blastRisk = genBlastVsRisk();
  const rainfallInc = genRainfallVsIncidents();

  return (
    <Grid container spacing={2.5}>
      {/* Incidents by Month */}
      <Grid item xs={12} md={6}>
        <SectionCard title="Incidents by Month">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E4EA" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="incidents" fill={brandTokens.brand.accent} radius={[4, 4, 0, 0]} name="Incidents"
                isAnimationActive animationDuration={900} animationEasing="ease-out" />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      </Grid>

      {/* Risk Over Time */}
      <Grid item xs={12} md={6}>
        <SectionCard title="Risk Distribution Over Time">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={riskTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E4EA" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="critical" stackId="1" fill={brandTokens.risk.red} stroke={brandTokens.risk.red} name="Critical"
                isAnimationActive animationDuration={900} animationEasing="ease-out" />
              <Area type="monotone" dataKey="high" stackId="1" fill={brandTokens.risk.orange} stroke={brandTokens.risk.orange} name="High"
                isAnimationActive animationDuration={940} animationBegin={60} animationEasing="ease-out" />
              <Area type="monotone" dataKey="caution" stackId="1" fill={brandTokens.risk.yellow} stroke={brandTokens.risk.yellow} name="Caution"
                isAnimationActive animationDuration={980} animationBegin={100} animationEasing="ease-out" />
              <Area type="monotone" dataKey="safe" stackId="1" fill={brandTokens.risk.green} stroke={brandTokens.risk.green} name="Safe"
                isAnimationActive animationDuration={1020} animationBegin={140} animationEasing="ease-out" />
            </AreaChart>
          </ResponsiveContainer>
        </SectionCard>
      </Grid>

      {/* Blast vs Risk */}
      <Grid item xs={12} md={6}>
        <SectionCard title="Blast Events vs Risk Score">
          <ResponsiveContainer width="100%" height={280}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E4EA" />
              <XAxis dataKey="blasts" name="Blasts" tick={{ fontSize: 11 }} />
              <YAxis dataKey="riskScore" name="Risk Score" tick={{ fontSize: 11 }} />
              <ZAxis range={[40, 200]} />
              <Tooltip contentStyle={tooltipStyle} />
              <Scatter data={blastRisk} fill={brandTokens.risk.orange}
                isAnimationActive animationDuration={900} animationEasing="ease-out" />
            </ScatterChart>
          </ResponsiveContainer>
        </SectionCard>
      </Grid>

      {/* Rainfall vs Incidents */}
      <Grid item xs={12} md={6}>
        <SectionCard title="Rainfall vs Incidents">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={rainfallInc}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E4EA" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line yAxisId="left" type="monotone" dataKey="rainfall" stroke={brandTokens.brand.accentAlt} strokeWidth={2} dot={false} name="Rainfall (mm)"
                isAnimationActive animationDuration={900} animationEasing="ease-out" />
              <Line yAxisId="right" type="monotone" dataKey="incidents" stroke={brandTokens.risk.red} strokeWidth={2} dot={false} name="Incidents"
                isAnimationActive animationDuration={980} animationBegin={100} animationEasing="ease-out" />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>
      </Grid>

      {/* District Comparison */}
      <Grid item xs={12} md={6}>
        <SectionCard title="District-wise Risk Comparison">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={DISTRICT_DATA} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E4EA" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="district" tick={{ fontSize: 11 }} width={80} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="risk" fill={brandTokens.brand.accent} radius={[0, 4, 4, 0]} name="Avg Risk Score"
                isAnimationActive animationDuration={920} animationEasing="ease-out" />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      </Grid>

      {/* Soil Type Contribution */}
      <Grid item xs={12} md={6}>
        <SectionCard title="Soil Type Risk Contribution">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={SOIL_DATA} cx="50%" cy="50%" innerRadius={55} outerRadius={100} paddingAngle={3} dataKey="value"
                isAnimationActive animationDuration={920} animationEasing="ease-out">
                {SOIL_DATA.map((entry, i) => (
                  <Cell key={entry.name} fill={SOIL_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </SectionCard>
      </Grid>
    </Grid>
  );
};

export default AnalyticsCharts;
