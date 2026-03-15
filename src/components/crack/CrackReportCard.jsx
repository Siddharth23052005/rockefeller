import React from 'react';
import { Card, CardContent, CardMedia, Box, Typography, Button, Chip, Grid } from '@mui/material';
import { Check, Shield, Close as FalseIcon } from '@mui/icons-material';
import { RiskBadge } from '../common/RiskBadge';
import { StatusChip } from '../common/StatusChip';
import { formatDateTime } from '../../utils/formatUtils';
import { getRiskColor } from '../../utils/riskUtils';

export const CrackReportCard = ({ report, onConfirmCritical, onConfirmSafe, onFalseAlarm }) => {
  const isPending = report.status === 'pending';

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Photo */}
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height={180}
          image={report.photo}
          alt={`Crack report ${report.id}`}
          sx={{ objectFit: 'cover' }}
        />
        {/* AI Annotated overlay slot */}
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'rgba(0,0,0,0.55)',
            color: '#fff',
            px: 1,
            py: 0.3,
            borderRadius: '4px',
            fontSize: '0.65rem',
            fontWeight: 500,
          }}
        >
          {report.annotatedPhoto ? 'AI Annotated' : 'No AI Annotation'}
        </Box>
      </Box>

      <CardContent sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* AI Risk Score slot */}
        <Chip
          label={report.aiRiskScore !== null ? `AI Risk: ${report.aiRiskScore}` : 'AI Risk Score: Pending'}
          size="small"
          sx={{
            mb: 1.5,
            bgcolor: report.aiRiskScore !== null ? '#E3F2FD' : '#F5F5F5',
            color: report.aiRiskScore !== null ? '#1565C0' : '#9E9E9E',
            fontWeight: 500,
            fontSize: '0.7rem',
            alignSelf: 'flex-start',
          }}
        />

        {/* Zone + severity row */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {report.zoneName}
          </Typography>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: getRiskColor(
                report.zoneColorAfter ||
                (report.status === 'confirmed_critical' ? report.zoneColorAfter : undefined) ||
                'green'
              ),
            }}
          />
        </Box>

        {/* Severity + crack type */}
        <Box sx={{ display: 'flex', gap: 0.5, mb: 1, flexWrap: 'wrap' }}>
          <RiskBadge
            level={
              report.severity === 'critical' ? 'red' :
              report.severity === 'high' ? 'orange' :
              report.severity === 'medium' ? 'yellow' : 'green'
            }
          />
          <Chip
            label={report.crackType}
            size="small"
            variant="outlined"
            sx={{ fontSize: '0.7rem', fontWeight: 500 }}
          />
        </Box>

        {/* Reporter + time */}
        <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5 }}>
          {report.reportedBy}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1.5 }}>
          {formatDateTime(report.timestamp)}
        </Typography>

        {/* Status chip */}
        <Box sx={{ mb: 1.5 }}>
          <StatusChip status={report.status} />
        </Box>

        {/* Action buttons */}
        {isPending && (
          <Box sx={{ display: 'flex', gap: 0.5, mt: 'auto' }}>
            <Button
              size="small"
              variant="contained"
              color="error"
              startIcon={<Check />}
              onClick={() => onConfirmCritical?.(report.id)}
              sx={{ fontSize: '0.7rem', flex: 1 }}
            >
              Confirm Critical
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="success"
              startIcon={<Shield />}
              onClick={() => onConfirmSafe?.(report.id)}
              sx={{ fontSize: '0.7rem', flex: 1 }}
            >
              Safe
            </Button>
            <Button
              size="small"
              variant="outlined"
              startIcon={<FalseIcon />}
              onClick={() => onFalseAlarm?.(report.id)}
              sx={{ fontSize: '0.7rem', flex: 1, color: 'text.secondary', borderColor: 'divider' }}
            >
              False
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default CrackReportCard;
