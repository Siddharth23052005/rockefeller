import React from 'react';
import { Grid, Box } from '@mui/material';
import { KpiCard } from '../../components/common/KpiCard';
import {
  Terrain as ZoneIcon,
  ErrorOutline as CriticalIcon,
  NotificationsActive as AlertIcon,
  Description as ReportIcon,
} from '@mui/icons-material';
import { brandTokens } from '../../theme';

export const KpiRow = ({ kpis }) => {
  const cards = [
    { title: 'Total Zones', value: kpis.totalZones, icon: <ZoneIcon />, color: brandTokens.brand.accent },
    { title: 'Critical Zones', value: kpis.criticalZones, icon: <CriticalIcon />, color: brandTokens.risk.red },
    { title: 'Active Alerts', value: kpis.activeAlerts, icon: <AlertIcon />, color: brandTokens.risk.orange },
    { title: 'Reports Today', value: kpis.reportsToday, icon: <ReportIcon />, color: brandTokens.risk.green },
  ];

  return (
    <Grid container spacing={2}>
      {cards.map((card) => (
        <Grid item xs={6} sm={3} key={card.title}>
          <KpiCard {...card} />
        </Grid>
      ))}
    </Grid>
  );
};

export default KpiRow;
