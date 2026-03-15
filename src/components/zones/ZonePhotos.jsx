import React from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, Box } from '@mui/material';
import { StatusChip } from '../common/StatusChip';
import { formatDate } from '../../utils/formatUtils';

export const ZonePhotos = ({ reports }) => {
  if (!reports || reports.length === 0) {
    return (
      <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 4 }}>
        No photos available for this zone
      </Typography>
    );
  }

  return (
    <Grid container spacing={2}>
      {reports.map((report) => (
        <Grid item xs={12} sm={6} md={4} key={report.id}>
          <Card>
            <CardMedia
              component="img"
              height={180}
              image={report.image}
              alt={`Report ${report.id}`}
              sx={{ objectFit: 'cover' }}
            />
            <CardContent sx={{ p: 1.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {report.reportedBy}
                </Typography>
                <StatusChip status={report.reviewStatus} />
              </Box>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {formatDate(report.timestamp)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ZonePhotos;
