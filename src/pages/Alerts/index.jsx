import React, { useState, useMemo } from 'react';
import {
  Box, Typography, Tabs, Tab, Grid, Chip, FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  ErrorOutline, NotificationsActive, History,
} from '@mui/icons-material';
import { alerts as alertData } from '../../data/alerts';
import { AlertList } from '../../components/alerts/AlertList';
import { KpiCard } from '../../components/common/KpiCard';
import { brandTokens } from '../../theme';
import { zones } from '../../data/zones';

const AlertsPage = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [allAlerts, setAllAlerts] = useState(alertData);
  const [filters, setFilters] = useState({ zone: '', riskLevel: '' });

  const TAB_STATUSES = ['active', 'acknowledged', 'resolved'];
  const currentStatus = TAB_STATUSES[tab];

  const filteredAlerts = useMemo(() => {
    return allAlerts.filter((a) => {
      if (a.status !== currentStatus) return false;
      if (filters.zone && a.zoneId !== filters.zone) return false;
      if (filters.riskLevel && a.riskLevel !== filters.riskLevel) return false;
      return true;
    });
  }, [allAlerts, currentStatus, filters]);

  const summary = useMemo(() => ({
    active: allAlerts.filter((a) => a.status === 'active').length,
    critical: allAlerts.filter((a) => a.status === 'active' && a.riskLevel === 'red').length,
    resolvedToday: allAlerts.filter((a) => a.status === 'resolved' && a.timestamp?.startsWith('2026-03-13')).length,
  }), [allAlerts]);

  const handleAcknowledge = (id) => {
    setAllAlerts((prev) => prev.map((a) => a.id === id ? { ...a, status: 'acknowledged' } : a));
  };

  const handleResolve = (id) => {
    setAllAlerts((prev) => prev.map((a) => a.id === id ? { ...a, status: 'resolved' } : a));
  };

  const handleViewMap = (alert) => {
    navigate('/map');
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>Alerts</Typography>

      {/* Summary KPIs */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={4}>
          <KpiCard title="Active" value={summary.active} icon={<NotificationsActive />} color={brandTokens.risk.orange} />
        </Grid>
        <Grid item xs={4}>
          <KpiCard title="Critical" value={summary.critical} icon={<ErrorOutline />} color={brandTokens.risk.red} />
        </Grid>
        <Grid item xs={4}>
          <KpiCard title="Resolved Today" value={summary.resolvedToday} icon={<History />} color={brandTokens.risk.green} />
        </Grid>
      </Grid>

      {/* Tabs */}
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
      >
        <Tab label="Active" sx={{ textTransform: 'none', fontWeight: 500 }} />
        <Tab label="Acknowledged" sx={{ textTransform: 'none', fontWeight: 500 }} />
        <Tab label="History" sx={{ textTransform: 'none', fontWeight: 500 }} />
      </Tabs>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 1.5, mb: 2, flexWrap: 'wrap' }}>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Zone</InputLabel>
          <Select value={filters.zone} label="Zone" onChange={(e) => setFilters((p) => ({ ...p, zone: e.target.value }))}>
            <MenuItem value="">All Zones</MenuItem>
            {zones.map((z) => <MenuItem key={z.id} value={z.id}>{z.name}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Risk Level</InputLabel>
          <Select value={filters.riskLevel} label="Risk Level" onChange={(e) => setFilters((p) => ({ ...p, riskLevel: e.target.value }))}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="red">Critical</MenuItem>
            <MenuItem value="orange">High</MenuItem>
            <MenuItem value="yellow">Caution</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Alert List */}
      <AlertList
        alerts={filteredAlerts}
        onAcknowledge={handleAcknowledge}
        onResolve={handleResolve}
        onViewMap={handleViewMap}
      />
    </Box>
  );
};

export default AlertsPage;
