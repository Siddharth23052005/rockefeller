import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, TextField, Chip, Avatar } from '@mui/material';
import { CloudUpload, Tune, Group, History } from '@mui/icons-material';
import { SectionCard } from '../../components/common/SectionCard';
import { DataTable } from '../../components/common/DataTable';
import { StatusChip } from '../../components/common/StatusChip';
import { zones } from '../../data/zones';
import { users } from '../../data/users';

const DATASET_CARDS = [
  { title: 'Historical Landslides CSV', icon: <CloudUpload />, desc: 'Upload past landslide event records' },
  { title: 'Blast Log CSV', icon: <CloudUpload />, desc: 'Upload blast operation records' },
  { title: 'Soil Conditions CSV', icon: <CloudUpload />, desc: 'Upload soil analysis data by zone' },
  { title: 'Weather/Rainfall CSV', icon: <CloudUpload />, desc: 'Upload meteorological records' },
  { title: 'Mine Zone GeoJSON', icon: <CloudUpload />, desc: 'Upload zone polygon boundaries' },
];

const AdminPage = () => {
  const zoneColumns = [
    { id: 'name', label: 'Zone Name' },
    { id: 'mineName', label: 'Mine' },
    { id: 'district', label: 'District' },
    { id: 'status', label: 'Status', render: (val) => <StatusChip status={val === 'Critical' ? 'active' : val === 'Warning' ? 'acknowledged' : 'resolved'} /> },
  ];

  const userColumns = [
    { id: 'name', label: 'Name', render: (val, row) => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Avatar src={row.avatar} sx={{ width: 28, height: 28 }} />
        {val}
      </Box>
    )},
    { id: 'role', label: 'Role', render: (val) => <Chip label={val} size="small" sx={{ fontWeight: 500, fontSize: '0.7rem' }} /> },
    { id: 'district', label: 'District' },
  ];

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>Admin Panel</Typography>

      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, fontSize: '1rem' }}>Dataset Uploads</Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {DATASET_CARDS.map((ds) => (
          <Grid item xs={12} sm={6} md={4} key={ds.title}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Box sx={{ color: 'primary.main', mb: 1 }}>{ds.icon}</Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>{ds.title}</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>{ds.desc}</Typography>
                <Button variant="outlined" size="small" startIcon={<CloudUpload />} disabled>Upload</Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, fontSize: '1rem' }}>Threshold Settings</Typography>
      <SectionCard sx={{ mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <TextField label="Yellow Threshold (mm)" defaultValue="80" size="small" fullWidth />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField label="Orange Threshold (mm)" defaultValue="150" size="small" fullWidth />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField label="Red Threshold (mm)" defaultValue="200" size="small" fullWidth />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField label="Blast Escalation Count" defaultValue="7" size="small" fullWidth />
          </Grid>
        </Grid>
      </SectionCard>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <SectionCard title="Zone Management" action={<Chip icon={<Tune />} label={`${zones.length} Zones`} size="small" />}>
            <DataTable columns={zoneColumns} rows={zones} />
          </SectionCard>
        </Grid>
        <Grid item xs={12} md={5}>
          <SectionCard title="User Roles" action={<Chip icon={<Group />} label={`${users.length} Users`} size="small" />}>
            <DataTable columns={userColumns} rows={users} />
          </SectionCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminPage;
