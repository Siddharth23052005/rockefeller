import { useMemo } from 'react';
import { getRiskColor, getRiskLabel, getRiskBgColor } from '../utils/riskUtils';

export const useRiskColor = (level) => {
  return useMemo(() => ({
    color: getRiskColor(level),
    label: getRiskLabel(level),
    bgColor: getRiskBgColor(level),
  }), [level]);
};

export default useRiskColor;
