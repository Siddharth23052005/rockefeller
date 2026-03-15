import React from 'react';
import {
  Drawer, Box, Typography, IconButton, FormControl, InputLabel,
  Select, MenuItem, Chip, Button, Divider, OutlinedInput, Checkbox, ListItemText,
} from '@mui/material';
import { Close as CloseIcon, FilterAlt, Clear } from '@mui/icons-material';

export const FilterDrawer = ({ open, onClose, filters, updateFilter, clearFilters, options }) => {
  const handleChange = (key) => (event) => {
    const value = event.target.value;
    updateFilter(key, typeof value === 'string' ? value.split(',') : value);
  };

  const hasFilters = Object.values(filters).some((v) => v.length > 0);

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      variant="persistent"
      sx={{
        '& .MuiDrawer-paper': {
          width: 300,
          p: 2.5,
          pt: 2,
          bgcolor: '#fff',
          borderRight: '1px solid',
          borderColor: 'divider',
          position: 'absolute',
          height: '100%',
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterAlt fontSize="small" color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>Filters</Typography>
        </Box>
        <IconButton size="small" onClick={onClose}><CloseIcon fontSize="small" /></IconButton>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel>District</InputLabel>
        <Select
          multiple
          value={filters.districts}
          onChange={handleChange('districts')}
          input={<OutlinedInput label="District" />}
          renderValue={(sel) => sel.join(', ')}
        >
          {options.districts.map((d) => (
            <MenuItem key={d} value={d}>
              <Checkbox checked={filters.districts.includes(d)} size="small" />
              <ListItemText primary={d} primaryTypographyProps={{ fontSize: '0.85rem' }} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel>Mine Name</InputLabel>
        <Select
          multiple
          value={filters.mineNames}
          onChange={handleChange('mineNames')}
          input={<OutlinedInput label="Mine Name" />}
          renderValue={(sel) => sel.join(', ')}
        >
          {options.mineNames.map((m) => (
            <MenuItem key={m} value={m}>
              <Checkbox checked={filters.mineNames.includes(m)} size="small" />
              <ListItemText primary={m} primaryTypographyProps={{ fontSize: '0.85rem' }} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel>Risk Level</InputLabel>
        <Select
          multiple
          value={filters.riskLevels}
          onChange={handleChange('riskLevels')}
          input={<OutlinedInput label="Risk Level" />}
          renderValue={(sel) => sel.map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')}
        >
          {options.riskLevels.map((r) => (
            <MenuItem key={r} value={r}>
              <Checkbox checked={filters.riskLevels.includes(r)} size="small" />
              <ListItemText primary={r.charAt(0).toUpperCase() + r.slice(1)} primaryTypographyProps={{ fontSize: '0.85rem' }} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel>Soil Type</InputLabel>
        <Select
          multiple
          value={filters.soilTypes}
          onChange={handleChange('soilTypes')}
          input={<OutlinedInput label="Soil Type" />}
          renderValue={(sel) => sel.join(', ')}
        >
          {options.soilTypes.map((s) => (
            <MenuItem key={s} value={s}>
              <Checkbox checked={filters.soilTypes.includes(s)} size="small" />
              <ListItemText primary={s} primaryTypographyProps={{ fontSize: '0.85rem' }} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {hasFilters && (
        <Button
          startIcon={<Clear />}
          onClick={clearFilters}
          size="small"
          sx={{ mt: 1 }}
        >
          Clear All Filters
        </Button>
      )}
    </Drawer>
  );
};

export default FilterDrawer;
