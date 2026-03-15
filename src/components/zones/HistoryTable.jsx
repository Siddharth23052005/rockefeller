import React from 'react';
import { DataTable } from '../common/DataTable';
import { Chip } from '@mui/material';
import { formatDate } from '../../utils/formatUtils';

const COLUMNS = [
  { id: 'type', label: 'Type', render: (v) => (
    <Chip
      label={v.charAt(0).toUpperCase() + v.slice(1)}
      size="small"
      sx={{
        fontWeight: 500,
        fontSize: '0.7rem',
        bgcolor: v === 'landslide' ? '#FFEBEE' : '#E3F2FD',
        color: v === 'landslide' ? '#B71C1C' : '#1565C0',
      }}
    />
  )},
  { id: 'date', label: 'Date', render: (v) => formatDate(v) },
  { id: 'magnitude', label: 'Magnitude' },
  { id: 'damageLevel', label: 'Damage' },
  { id: 'notes', label: 'Notes' },
];

export const HistoryTable = ({ historyData }) => {
  return (
    <DataTable
      columns={COLUMNS}
      rows={historyData}
      emptyMessage="No historical events recorded for this zone"
    />
  );
};

export default HistoryTable;
