import { useMemo } from 'react';
import { zones } from '../../data/zones';
import { alerts } from '../../data/alerts';
import { reports } from '../../data/reports';
import { weather } from '../../data/weather';

export const useDashboardData = () => {
  return useMemo(() => {
    const totalZones = zones.length;
    const criticalZones = zones.filter((z) => z.riskLevel === 'red').length;
    const activeAlerts = alerts.filter((a) => a.status === 'active').length;
    const today = '2026-03-13';
    const reportsToday = reports.filter((r) => r.timestamp.startsWith(today)).length;

    const recentAlerts = alerts
      .filter((a) => a.status === 'active')
      .slice(0, 5);

    const distribution = {
      green: zones.filter((z) => z.riskLevel === 'green').length,
      yellow: zones.filter((z) => z.riskLevel === 'yellow').length,
      orange: zones.filter((z) => z.riskLevel === 'orange').length,
      red: zones.filter((z) => z.riskLevel === 'red').length,
    };

    const trendData = Array.from({ length: 30 }, (_, i) => {
      const day = 30 - i;
      const date = `Mar ${Math.max(1, 13 - day + 1)}`;
      return {
        date,
        safe: 5 + Math.floor(Math.random() * 2),
        caution: 3 + Math.floor(Math.random() * 2),
        high: 2 + Math.floor(Math.random() * 3),
        critical: 1 + Math.floor(Math.random() * 2),
      };
    });

    const activityFeed = [
      { id: 1, type: 'report', text: 'New crack report submitted for North Ridge A', time: '10 min ago' },
      { id: 2, type: 'blast', text: 'Blast event recorded at Central Pit E — 5.0 tons', time: '1h ago' },
      { id: 3, type: 'alert', text: 'Alert acknowledged for North Terrace I', time: '2h ago' },
      { id: 4, type: 'zone', text: 'Deep Cut N risk level upgraded to Orange', time: '4h ago' },
      { id: 5, type: 'report', text: 'Field inspection completed for Lower Bench G', time: '6h ago' },
    ];

    const rainfallSummary = weather.find((w) => w.warningLevel === 'red') || weather[0];

    return {
      kpis: { totalZones, criticalZones, activeAlerts, reportsToday },
      recentAlerts,
      distribution,
      trendData,
      activityFeed,
      rainfallSummary,
      zones,
    };
  }, []);
};

export default useDashboardData;
