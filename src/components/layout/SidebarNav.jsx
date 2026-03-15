import React from 'react';
import {
  Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Box, Typography, Divider, IconButton, useTheme,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Map as MapIcon,
  Assessment as AnalyticsIcon,
  Warning as AlertsIcon,
  CloudUpload as UploadIcon,
  BugReport as CrackIcon,
  Description as ReportsIcon,
  AdminPanelSettings as AdminIcon,
  Person as ProfileIcon,
  ChevronLeft as CollapseIcon,
  ChevronRight as ExpandIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { brandTokens } from '../../theme';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { label: 'Map', icon: <MapIcon />, path: '/map' },
  { label: 'Alerts', icon: <AlertsIcon />, path: '/alerts' },
  { label: 'Crack Reports', icon: <CrackIcon />, path: '/crack-reports' },
  { label: 'Reports', icon: <ReportsIcon />, path: '/reports' },
  { label: 'Upload', icon: <UploadIcon />, path: '/upload' },
  { label: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
  { label: 'Admin', icon: <AdminIcon />, path: '/admin' },
  { label: 'Profile', icon: <ProfileIcon />, path: '/profile' },
];

export const SidebarNav = ({ open, onToggle, isMobile, width, collapsedWidth }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const currentWidth = open ? width : collapsedWidth;

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: brandTokens.brand.dark,
        color: '#fff',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'space-between' : 'center',
          px: open ? 2 : 0,
          py: 2,
          minHeight: 64,
        }}
      >
        {open && (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem', lineHeight: 1.2 }}>
              GeoAlert
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.65rem' }}>
              by JM Solutions
            </Typography>
          </Box>
        )}
        {!isMobile && (
          <IconButton onClick={onToggle} sx={{ color: '#fff' }} size="small">
            {open ? <CollapseIcon /> : <ExpandIcon />}
          </IconButton>
        )}
      </Box>

      <Divider sx={{ borderColor: brandTokens.brand.slate }} />

      <List sx={{ flexGrow: 1, pt: 1 }}>
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <ListItemButton
              key={item.path}
              onClick={() => {
                navigate(item.path);
                if (isMobile) onToggle();
              }}
              sx={{
                mx: 1,
                mb: 0.5,
                borderRadius: '8px',
                minHeight: 44,
                justifyContent: open ? 'initial' : 'center',
                bgcolor: isActive ? brandTokens.brand.accent : 'transparent',
                '&:hover': {
                  bgcolor: isActive
                    ? brandTokens.brand.accent
                    : 'rgba(255,255,255,0.08)',
                },
                transition: 'background-color 0.2s',
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 2 : 0,
                  justifyContent: 'center',
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
                }}
              >
                {item.icon}
              </ListItemIcon>
              {open && (
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.85rem',
                    fontWeight: isActive ? 600 : 400,
                  }}
                />
              )}
            </ListItemButton>
          );
        })}
      </List>

      <Divider sx={{ borderColor: brandTokens.brand.slate }} />
      <Box sx={{ p: 1.5, textAlign: 'center' }}>
        {open && (
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
            Phase 1 — Mock Data
          </Typography>
        )}
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={open}
        onClose={onToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            width: width,
            border: 'none',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: currentWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: currentWidth,
          border: 'none',
          transition: 'width 0.3s ease',
          overflowX: 'hidden',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default SidebarNav;
