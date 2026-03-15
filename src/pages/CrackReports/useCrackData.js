import { useMemo, useState, useCallback } from 'react';
import { crackReports as initialReports } from '../../data/crackReports';
import { zones as zoneData } from '../../data/zones';
import { alerts as alertData } from '../../data/alerts';
import { upgradeRiskLevel, getRiskLabel } from '../../utils/riskUtils';

export const useCrackData = () => {
  const [reports, setReports] = useState(initialReports);
  const [zones, setZones] = useState(zoneData);
  const [alerts, setAlerts] = useState(alertData);
  const [toast, setToast] = useState(null);

  const [filters, setFilters] = useState({
    zone: '',
    severity: '',
    crackType: '',
    status: '',
  });

  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      if (filters.zone && r.zoneId !== filters.zone) return false;
      if (filters.severity && r.severity !== filters.severity) return false;
      if (filters.crackType && r.crackType !== filters.crackType) return false;
      if (filters.status && r.status !== filters.status) return false;
      return true;
    });
  }, [reports, filters]);

  const summary = useMemo(() => ({
    total: reports.length,
    pending: reports.filter((r) => r.status === 'pending').length,
    aiScored: reports.filter((r) => r.status === 'ai_scored').length,
    confirmedCritical: reports.filter((r) => r.status === 'confirmed_critical').length,
  }), [reports]);

  const handleConfirmCritical = useCallback((reportId) => {
    setReports((prev) => prev.map((r) => {
      if (r.id !== reportId) return r;
      const zone = zones.find((z) => z.id === r.zoneId);
      if (!zone) return r;
      const newLevel = upgradeRiskLevel(zone.riskLevel);
      return {
        ...r,
        status: 'confirmed_critical',
        engineerAction: 'confirmed_critical',
        reviewedBy: 'Dr. Anil Kulkarni',
        zoneColorBefore: zone.riskLevel,
        zoneColorAfter: newLevel,
      };
    }));

    const report = reports.find((r) => r.id === reportId);
    if (report) {
      const zone = zones.find((z) => z.id === report.zoneId);
      if (zone) {
        const newLevel = upgradeRiskLevel(zone.riskLevel);
        setZones((prev) => prev.map((z) =>
          z.id === zone.id ? { ...z, riskLevel: newLevel, status: newLevel === 'red' ? 'Critical' : 'Warning' } : z
        ));

        const newAlert = {
          id: `a-new-${Date.now()}`,
          zoneId: zone.id,
          zoneName: zone.name,
          district: zone.district,
          riskLevel: newLevel,
          triggerReason: `Crack report confirmed critical — zone risk upgraded to ${getRiskLabel(newLevel)}`,
          timestamp: new Date().toISOString(),
          recommendedAction: newLevel === 'red' ? 'Evacuate all personnel immediately' : 'Restrict access and deploy monitoring',
          status: 'active',
        };
        setAlerts((prev) => [newAlert, ...prev]);
        setToast(`Zone ${zone.name} upgraded to ${getRiskLabel(newLevel)}`);
        setTimeout(() => setToast(null), 4000);
      }
    }
  }, [reports, zones]);

  const handleConfirmSafe = useCallback((reportId) => {
    setReports((prev) => prev.map((r) =>
      r.id === reportId ? { ...r, status: 'safe', engineerAction: 'confirmed_safe', reviewedBy: 'Dr. Anil Kulkarni' } : r
    ));
  }, []);

  const handleFalseAlarm = useCallback((reportId) => {
    setReports((prev) => prev.map((r) =>
      r.id === reportId ? { ...r, status: 'false_alarm', engineerAction: 'false_alarm', reviewedBy: 'Dr. Anil Kulkarni' } : r
    ));
  }, []);

  return {
    reports: filteredReports,
    summary,
    filters,
    setFilters,
    handleConfirmCritical,
    handleConfirmSafe,
    handleFalseAlarm,
    toast,
    zones,
  };
};

export default useCrackData;
