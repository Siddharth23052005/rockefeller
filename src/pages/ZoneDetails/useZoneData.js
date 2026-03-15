import { useMemo } from 'react';
import { zones } from '../../data/zones';
import { history } from '../../data/history';
import { reports } from '../../data/reports';
import { weather } from '../../data/weather';

export const useZoneData = (zoneId) => {
  return useMemo(() => {
    const zone = zones.find((z) => z.id === zoneId);
    if (!zone) return { zone: null, zoneHistory: [], zoneReports: [], zoneWeather: null };

    const zoneHistory = history.filter((h) => h.zoneId === zoneId);
    const zoneReports = reports.filter((r) => r.zoneId === zoneId);
    const zoneWeather = weather.find((w) => w.district === zone.district);

    const recommendations = [];
    if (zone.riskLevel === 'red') {
      recommendations.push({ type: 'Evacuate', desc: 'Evacuate all personnel immediately. Zone is at critical risk.', severity: 'critical' });
      recommendations.push({ type: 'Restrict', desc: 'Restrict all blasting operations until geotechnical review is complete.', severity: 'critical' });
    } else if (zone.riskLevel === 'orange') {
      recommendations.push({ type: 'Restrict', desc: 'Limit access to essential personnel only. Deploy monitoring sensors.', severity: 'high' });
      recommendations.push({ type: 'Monitor', desc: 'Increase monitoring frequency to every 2 hours.', severity: 'high' });
    } else if (zone.riskLevel === 'yellow') {
      recommendations.push({ type: 'Monitor', desc: 'Continue routine monitoring. Schedule detailed inspection within 48 hours.', severity: 'medium' });
    } else {
      recommendations.push({ type: 'Safe', desc: 'Zone is stable. Maintain standard monitoring schedule.', severity: 'low' });
    }

    const rainfallTrend = Array.from({ length: 14 }, (_, i) => ({
      day: `Day ${i + 1}`,
      rainfall: Math.floor(Math.random() * 40) + (zone.recentRainfall > 100 ? 20 : 5),
    }));

    return { zone, zoneHistory, zoneReports, zoneWeather, recommendations, rainfallTrend };
  }, [zoneId]);
};

export default useZoneData;
