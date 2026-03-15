import React from 'react';
import {
  AppBar, Toolbar, IconButton, Typography, Box, Badge, Avatar, Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { currentUser } from '../../data/users';
import { alerts } from '../../data/alerts';

export const TopHeader = ({ onMenuClick, isMobile }) => {
  const activeAlertCount = alerts.filter((a) => a.status === 'active').length;

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: '#fff',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ minHeight: { xs: 56, md: 64 } }}>
        {isMobile && (
          <IconButton edge="start" onClick={onMenuClick} sx={{ mr: 1 }}>
            <MenuIcon />
          </IconButton>
        )}

        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem', flexGrow: 1 }}>
          Mine Safety Dashboard
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <IconButton size="small">
            <Badge badgeContent={activeAlertCount} color="error">
              <NotificationsIcon sx={{ color: 'text.secondary' }} />
            </Badge>
          </IconButton>

          <Chip
            avatar={<Avatar src={currentUser.avatar} sx={{ width: 28, height: 28 }} />}
            label={currentUser.name}
            variant="outlined"
            size="small"
            sx={{
              display: { xs: 'none', sm: 'flex' },
              borderColor: 'divider',
              fontWeight: 500,
              '& .MuiChip-label': { fontSize: '0.8rem' },
            }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopHeader;
