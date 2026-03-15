import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Typography, Box } from '@mui/material';
import {
  Description as ReportIcon,
  Explore as BlastIcon,
  NotificationsActive as AlertIcon,
  SwapVert as ZoneIcon,
} from '@mui/icons-material';
import { brandTokens } from '../../theme';

const ICON_MAP = {
  report: { icon: <ReportIcon fontSize="small" />, color: brandTokens.brand.accent },
  blast: { icon: <BlastIcon fontSize="small" />, color: brandTokens.risk.orange },
  alert: { icon: <AlertIcon fontSize="small" />, color: brandTokens.risk.yellow },
  zone: { icon: <ZoneIcon fontSize="small" />, color: brandTokens.risk.red },
};

export const ActivityFeed = ({ items }) => {
  return (
    <List disablePadding>
      {items.map((item) => {
        const config = ICON_MAP[item.type] || ICON_MAP.report;
        return (
          <ListItem
            key={item.id}
            sx={{
              px: 0,
              py: 1,
              borderBottom: '1px solid',
              borderColor: 'divider',
              '&:last-child': { borderBottom: 0 },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: `${config.color}14`,
                  color: config.color,
                }}
              >
                {config.icon}
              </Box>
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              secondary={item.time}
              primaryTypographyProps={{ fontSize: '0.8rem', fontWeight: 400 }}
              secondaryTypographyProps={{ fontSize: '0.7rem' }}
            />
          </ListItem>
        );
      })}
    </List>
  );
};

export default ActivityFeed;
