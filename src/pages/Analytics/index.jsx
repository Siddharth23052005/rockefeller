import React, { useState } from 'react';
import { Box, Typography, TextField, Grid } from '@mui/material';
import { DateRange as DateIcon } from '@mui/icons-material';
import { AnalyticsCharts } from '../../components/analytics/AnalyticsCharts';
import { DataTable } from '../../components/common/DataTable';
import { SectionCard } from '../../components/common/SectionCard';
import { RiskBadge } from '../../components/common/RiskBadge';
import { zones } from '../../data/zones';

const heatmapColumns = [
  { id: 'name', label: 'Zone' },
  { id: 'district', label: 'District' },
  { id: 'mineName', label: 'Mine' },
  { id: 'riskLevel', label: 'Risk Level', render: (v) => <RiskBadge level={v} /> },
  { id: 'riskScore', label: 'Score', render: (v) => (
    <Typography variant="body2" sx={{ fontWeight: 600 }}>{v}</Typography>
  )},
];

const AnalyticsPage = () => {
  const [dateFrom, setDateFrom] = useState('2026-01-01');
  const [dateTo, setDateTo] = useState('2026-03-13');

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>Analytics</Typography>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <DateIcon sx={{ color: 'text.secondary' }} />
          <TextField
            label="From"
            type="date"
            size="small"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ width: 160 }}
          />
          <TextField
            label="To"
            type="date"
            size="small"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ width: 160 }}
          />
        </Box>
      </Box>

      <AnalyticsCharts />

      <Box sx={{ mt: 3 }}>
        <SectionCard title="Zone Heatmap Summary">
          <DataTable
            columns={heatmapColumns}
            rows={[...zones].sort((a, b) => b.riskScore - a.riskScore)}
          />
        </SectionCard>
      </Box>
    </Box>
  );
};

export default AnalyticsPage;
