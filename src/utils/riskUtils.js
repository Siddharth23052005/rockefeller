import { brandTokens } from '../theme';

const RISK_COLORS = {
  green: brandTokens.risk.green,
  yellow: brandTokens.risk.yellow,
  orange: brandTokens.risk.orange,
  red: brandTokens.risk.red,
};

const RISK_LABELS = {
  green: 'Safe',
  yellow: 'Caution',
  orange: 'High',
  red: 'Critical',
};

const RISK_ORDER = ['green', 'yellow', 'orange', 'red'];

export const getRiskColor = (level) => RISK_COLORS[level] || RISK_COLORS.green;

export const getRiskLabel = (level) => RISK_LABELS[level] || 'Unknown';

export const getRiskBgColor = (level) => {
  const map = {
    green: '#E8F5E9',
    yellow: '#FFF8E1',
    orange: '#FFF3E0',
    red: '#FFEBEE',
  };
  return map[level] || map.green;
};

export const upgradeRiskLevel = (currentLevel) => {
  const idx = RISK_ORDER.indexOf(currentLevel);
  if (idx < 0 || idx >= RISK_ORDER.length - 1) return currentLevel;
  return RISK_ORDER[idx + 1];
};

export const getRiskScore = (level) => {
  const map = { green: 25, yellow: 50, orange: 75, red: 95 };
  return map[level] || 0;
};

export { RISK_COLORS, RISK_LABELS, RISK_ORDER };
