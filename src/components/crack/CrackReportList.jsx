import React from 'react';
import { Grid } from '@mui/material';
import { CrackReportCard } from './CrackReportCard';

export const CrackReportList = ({ reports, onConfirmCritical, onConfirmSafe, onFalseAlarm }) => {
  return (
    <Grid container spacing={2}>
      {reports.map((report) => (
        <Grid item xs={12} sm={6} md={4} key={report.id}>
          <CrackReportCard
            report={report}
            onConfirmCritical={onConfirmCritical}
            onConfirmSafe={onConfirmSafe}
            onFalseAlarm={onFalseAlarm}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default CrackReportList;
