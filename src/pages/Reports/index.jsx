import React, { useState, useMemo } from 'react';
import {
  Box, Typography, ToggleButton, ToggleButtonGroup, Grid, Chip,
  FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';
import { ViewList, ViewModule } from '@mui/icons-material';
import { reports as reportData } from '../../data/reports';
import { zones } from '../../data/zones';
import { ReportCard } from '../../components/reports/ReportCard';
import { KpiCard } from '../../components/common/KpiCard';
import { brandTokens } from '../../theme';
import { Description, HourglassEmpty, ErrorOutline } from '@mui/icons-material';

const ReportsPage = () => {
  const [view, setView] = useState('list');
  const [filters, setFilters] = useState({ zone: '', severity: '', status: '' });

  const filteredReports = useMemo(() => {
    return reportData.filter((r) => {
      if (filters.zone && r.zoneId !== filters.zone) return false;
      if (filters.severity && r.severity !== filters.severity) return false;
      if (filters.status && r.reviewStatus !== filters.status) return false;
      return true;
    });
  }, [filters]);

  const summary = useMemo(() => ({
    total: reportData.length,
    pending: reportData.filter((r) => r.reviewStatus === 'pending').length,
    critical: reportData.filter((r) => r.severity === 'critical').length,
  }), []);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>Field Reports</Typography>
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={(_, v) => v && setView(v)}
          size="small"
        >
          <ToggleButton value="list"><ViewList fontSize="small" /></ToggleButton>
          <ToggleButton value="gallery"><ViewModule fontSize="small" /></ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Summary Strip */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={4}>
          <KpiCard title="Total" value={summary.total} icon={<Description />} color={brandTokens.brand.accent} />
        </Grid>
        <Grid item xs={4}>
          <KpiCard title="Pending" value={summary.pending} icon={<HourglassEmpty />} color={brandTokens.risk.yellow} />
        </Grid>
        <Grid item xs={4}>
          <KpiCard title="Critical" value={summary.critical} icon={<ErrorOutline />} color={brandTokens.risk.red} />
        </Grid>
      </Grid>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 1.5, mb: 3, flexWrap: 'wrap' }}>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Zone</InputLabel>
          <Select value={filters.zone} label="Zone" onChange={(e) => setFilters((p) => ({ ...p, zone: e.target.value }))}>
            <MenuItem value="">All Zones</MenuItem>
            {zones.map((z) => <MenuItem key={z.id} value={z.id}>{z.name}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Severity</InputLabel>
          <Select value={filters.severity} label="Severity" onChange={(e) => setFilters((p) => ({ ...p, severity: e.target.value }))}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="critical">Critical</MenuItem>
            <MenuItem value="high">High</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="low">Low</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select value={filters.status} label="Status" onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="reviewed">Reviewed</MenuItem>
            <MenuItem value="dismissed">Dismissed</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Reports */}
      {view === 'list' ? (
        <Box>
          {filteredReports.map((r) => (
            <ReportCard key={r.id} report={r} variant="list" />
          ))}
        </Box>
      ) : (
        <Grid container spacing={2}>
          {filteredReports.map((r) => (
            <Grid item xs={12} sm={6} md={4} key={r.id}>
              <ReportCard report={r} variant="gallery" />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default ReportsPage;
