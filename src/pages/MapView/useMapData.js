import { useMemo, useState, useCallback } from 'react';
import { zones as allZones } from '../../data/zones';

export const useMapData = () => {
  const [filters, setFilters] = useState({
    districts: [],
    mineNames: [],
    riskLevels: [],
    soilTypes: [],
  });
  const [selectedZone, setSelectedZone] = useState(null);

  const districts = useMemo(() => [...new Set(allZones.map((z) => z.district))], []);
  const mineNames = useMemo(() => [...new Set(allZones.map((z) => z.mineName))], []);
  const soilTypes = useMemo(() => [...new Set(allZones.map((z) => z.soilType))], []);
  const riskLevels = ['green', 'yellow', 'orange', 'red'];

  const filteredZones = useMemo(() => {
    return allZones.filter((z) => {
      if (filters.districts.length && !filters.districts.includes(z.district)) return false;
      if (filters.mineNames.length && !filters.mineNames.includes(z.mineName)) return false;
      if (filters.riskLevels.length && !filters.riskLevels.includes(z.riskLevel)) return false;
      if (filters.soilTypes.length && !filters.soilTypes.includes(z.soilType)) return false;
      return true;
    });
  }, [filters]);

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ districts: [], mineNames: [], riskLevels: [], soilTypes: [] });
  }, []);

  return {
    zones: filteredZones,
    allZones,
    filters,
    updateFilter,
    clearFilters,
    selectedZone,
    setSelectedZone,
    filterOptions: { districts, mineNames, soilTypes, riskLevels },
  };
};

export default useMapData;
