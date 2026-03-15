import React from 'react';
import { Box } from '@mui/material';
import { CrackReportCard } from './CrackReportCard';

export const CrackReviewPanel = ({ report, onConfirmCritical, onConfirmSafe, onFalseAlarm }) => {
  if (!report) return null;

  return (
    <Box sx={{ maxWidth: 420 }}>
      <CrackReportCard
        report={report}
        onConfirmCritical={onConfirmCritical}
        onConfirmSafe={onConfirmSafe}
        onFalseAlarm={onFalseAlarm}
      />
    </Box>
  );
};

export default CrackReviewPanel;
