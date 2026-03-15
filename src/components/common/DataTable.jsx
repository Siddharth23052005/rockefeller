import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Typography,
} from '@mui/material';

export const DataTable = ({ columns, rows, onRowClick, emptyMessage = 'No data available' }) => {
  if (!rows || rows.length === 0) {
    return (
      <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 4 }}>
        {emptyMessage}
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '8px' }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell
                key={col.id}
                sx={{
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  color: 'text.secondary',
                  bgcolor: '#F8F9FA',
                  borderBottom: '2px solid',
                  borderColor: 'divider',
                  whiteSpace: 'nowrap',
                }}
              >
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, idx) => (
            <TableRow
              key={row.id || idx}
              hover
              onClick={() => onRowClick?.(row)}
              sx={{
                cursor: onRowClick ? 'pointer' : 'default',
                '&:last-child td': { borderBottom: 0 },
              }}
            >
              {columns.map((col) => (
                <TableCell key={col.id} sx={{ fontSize: '0.8rem' }}>
                  {col.render ? col.render(row[col.id], row) : row[col.id]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataTable;
