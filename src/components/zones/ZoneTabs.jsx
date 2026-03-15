import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';

export const ZoneTabs = ({ value, onChange, tabs }) => {
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2.5 }}>
      <Tabs
        value={value}
        onChange={onChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '0.85rem',
            minHeight: 44,
          },
        }}
      >
        {tabs.map((tab) => (
          <Tab key={tab.id} label={tab.label} icon={tab.icon} iconPosition="start" />
        ))}
      </Tabs>
    </Box>
  );
};

export default ZoneTabs;
