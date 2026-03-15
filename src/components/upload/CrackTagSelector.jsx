import React from 'react';
import { Box, Chip } from '@mui/material';

const CRACK_TYPES = [
  'Parallel Crack', 'Perpendicular Crack', 'Surface Fracture',
  'Tension Crack', 'Rockfall Sign', 'Other',
];

export const CrackTagSelector = ({ selected = [], onToggle }) => {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {CRACK_TYPES.map((tag) => (
        <Chip
          key={tag}
          label={tag}
          size="small"
          onClick={() => onToggle?.(tag)}
          variant={selected.includes(tag) ? 'filled' : 'outlined'}
          color={selected.includes(tag) ? 'primary' : 'default'}
          sx={{ fontWeight: 500 }}
        />
      ))}
    </Box>
  );
};

export default CrackTagSelector;
