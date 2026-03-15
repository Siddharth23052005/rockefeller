import React from 'react';
import {
  Box, Typography, Grid, Chip, FormControl, InputLabel, Select, MenuItem,
  Snackbar, Alert,
} from '@mui/material';
import {
  Assignment, HourglassEmpty, SmartToy, ErrorOutline,
} from '@mui/icons-material';
import { useCrackData } from './useCrackData';
import { CrackReportList } from '../../components/crack/CrackReportList';
import { KpiCard } from '../../components/common/KpiCard';
import { zones } from '../../data/zones';
import { brandTokens } from '../../theme';

const CRACK_TYPES = ['Parallel Crack', 'Perpendicular Crack', 'Surface Fracture', 'Tension Crack', 'Rockfall Sign', 'Other'];
const SEVERITIES = ['low', 'medium', 'high', 'critical'];
const STATUSES = ['pending', 'safe', 'false_alarm', 'confirmed_critical', 'ai_scored'];

const CrackReportsPage = () => {
  const {
    reports, summary, filters, setFilters,
    handleConfirmCritical, handleConfirmSafe, handleFalseAlarm, toast,
  } = useCrackData();

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>Crack Reports</Typography>

      {/* Summary Strip */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <KpiCard title="Total Submitted" value={summary.total} icon={<Assignment />} color={brandTokens.brand.accent} />
        </Grid>
        <Grid item xs={6} sm={3}>
          <KpiCard title="Pending Review" value={summary.pending} icon={<HourglassEmpty />} color={brandTokens.risk.yellow} />
        </Grid>
        <Grid item xs={6} sm={3}>
          <KpiCard title="AI Scored" value={summary.aiScored} icon={<SmartToy />} color={brandTokens.brand.accentAlt} />
        </Grid>
        <Grid item xs={6} sm={3}>
          <KpiCard title="Confirmed Critical" value={summary.confirmedCritical} icon={<ErrorOutline />} color={brandTokens.risk.red} />
        </Grid>
      </Grid>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 1.5, mb: 3, flexWrap: 'wrap' }}>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Zone</InputLabel>
          <Select value={filters.zone} label="Zone" onChange={(e) => updateFilter('zone', e.target.value)}>
            <MenuItem value="">All Zones</MenuItem>
            {zones.map((z) => <MenuItem key={z.id} value={z.id}>{z.name}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Severity</InputLabel>
          <Select value={filters.severity} label="Severity" onChange={(e) => updateFilter('severity', e.target.value)}>
            <MenuItem value="">All</MenuItem>
            {SEVERITIES.map((s) => <MenuItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Crack Type</InputLabel>
          <Select value={filters.crackType} label="Crack Type" onChange={(e) => updateFilter('crackType', e.target.value)}>
            <MenuItem value="">All Types</MenuItem>
            {CRACK_TYPES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Status</InputLabel>
          <Select value={filters.status} label="Status" onChange={(e) => updateFilter('status', e.target.value)}>
            <MenuItem value="">All</MenuItem>
            {STATUSES.map((s) => <MenuItem key={s} value={s}>{s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</MenuItem>)}
          </Select>
        </FormControl>
      </Box>

      {/* Report Cards */}
      <CrackReportList
        reports={reports}
        onConfirmCritical={handleConfirmCritical}
        onConfirmSafe={handleConfirmSafe}
        onFalseAlarm={handleFalseAlarm}
      />

      {/* Success Toast */}
      <Snackbar open={!!toast} autoHideDuration={4000} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" variant="filled" sx={{ borderRadius: '8px' }}>
          {toast}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CrackReportsPage;
