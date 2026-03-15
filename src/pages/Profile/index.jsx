import React, { useState } from 'react';
import {
  Box, Typography, Card, CardContent, Avatar, Grid,
  TextField, Button, Switch, FormControlLabel, Divider, Chip,
} from '@mui/material';
import {
  Notifications, Warning, Description, Schedule, LocationOn, Lock,
} from '@mui/icons-material';
import { currentUser } from '../../data/users';
import { SectionCard } from '../../components/common/SectionCard';

const NOTIF_PREFS = [
  { key: 'activeAlerts', label: 'Active Alerts', icon: <Notifications />, desc: 'Receive notifications for new active alerts' },
  { key: 'redZoneWarning', label: 'Red Zone Entry Warning', icon: <Warning />, desc: 'Alert when entering a critical red zone' },
  { key: 'newReport', label: 'New Report', icon: <Description />, desc: 'Notify when a new field report is submitted' },
  { key: 'dailySummary', label: 'Daily Summary', icon: <Schedule />, desc: 'Receive a daily digest of all activity' },
];

const ProfilePage = () => {
  const [prefs, setPrefs] = useState({ activeAlerts: true, redZoneWarning: true, newReport: false, dailySummary: true });

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>Profile</Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Avatar src={currentUser.avatar} sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>{currentUser.name}</Typography>
              <Chip label={currentUser.role} size="small" sx={{ mt: 1, fontWeight: 500 }} />
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                {currentUser.district} District
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <SectionCard title="Edit Profile" sx={{ mb: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField label="Full Name" defaultValue={currentUser.name} size="small" fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Role" defaultValue={currentUser.role} size="small" fullWidth disabled />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="District" defaultValue={currentUser.district} size="small" fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Email" defaultValue="anil.kulkarni@jmsolutions.in" size="small" fullWidth />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" size="small">Save Changes</Button>
              </Grid>
            </Grid>
          </SectionCard>

          <SectionCard title="Notification Preferences" sx={{ mb: 3 }}>
            {NOTIF_PREFS.map((pref, idx) => (
              <React.Fragment key={pref.key}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ color: 'primary.main' }}>{pref.icon}</Box>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>{pref.label}</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>{pref.desc}</Typography>
                    </Box>
                  </Box>
                  <Switch
                    checked={prefs[pref.key]}
                    onChange={() => setPrefs((p) => ({ ...p, [pref.key]: !p[pref.key] }))}
                  />
                </Box>
                {idx < NOTIF_PREFS.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </SectionCard>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <SectionCard title="Location Permission">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <LocationOn sx={{ color: 'success.main' }} />
                  <Typography variant="body2">Location access granted</Typography>
                </Box>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Used for zone proximity alerts
                </Typography>
              </SectionCard>
            </Grid>
            <Grid item xs={12} sm={6}>
              <SectionCard title="Change Password">
                <TextField label="Current Password" type="password" size="small" fullWidth sx={{ mb: 1.5 }} />
                <TextField label="New Password" type="password" size="small" fullWidth sx={{ mb: 1.5 }} />
                <Button variant="outlined" size="small" startIcon={<Lock />}>Update Password</Button>
              </SectionCard>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfilePage;
