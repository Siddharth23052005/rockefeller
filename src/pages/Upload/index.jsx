import React, { useState } from 'react';
import {
  Box, Typography, Grid, TextField, Button, Card, CardContent, CardMedia,
  FormControl, InputLabel, Select, MenuItem, Chip, Alert,
  useMediaQuery, useTheme,
} from '@mui/material';
import { CloudUpload, Send, CameraAlt } from '@mui/icons-material';
import { RiskBadge } from '../../components/common/RiskBadge';
import { zones } from '../../data/zones';

const CRACK_TYPES = ['Parallel Crack', 'Perpendicular Crack', 'Surface Fracture', 'Tension Crack', 'Rockfall Sign', 'Other'];
const SEVERITY_LEVELS = ['Low', 'Medium', 'High', 'Critical'];

const UploadPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [form, setForm] = useState({
    zoneId: '',
    crackType: '',
    severity: '',
    remarks: '',
    lat: '',
    lng: '',
  });
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);

  const selectedZone = zones.find((z) => z.id === form.zoneId);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    }, 1500);
  };

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const updateForm = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>Upload Crack Report</Typography>

      {submitted && (
        <Alert severity="success" sx={{ mb: 2, borderRadius: '8px' }}>
          Report submitted successfully. AI risk assessment will be available in Phase 2.
        </Alert>
      )}

      <Grid container spacing={3} direction={isMobile ? 'column-reverse' : 'row'}>
        {/* Form */}
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              {/* Photo Upload */}
              <Box
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                sx={{
                  border: '2px dashed',
                  borderColor: preview ? 'primary.main' : 'divider',
                  borderRadius: '12px',
                  p: 4,
                  textAlign: 'center',
                  cursor: 'pointer',
                  bgcolor: preview ? 'primary.50' : '#FAFAFA',
                  mb: 3,
                  transition: 'all 0.2s',
                  '&:hover': { borderColor: 'primary.main', bgcolor: '#F0F7FF' },
                }}
                onClick={() => document.getElementById('photo-input').click()}
              >
                <input
                  id="photo-input"
                  type="file"
                  accept="image/jpeg,image/png"
                  hidden
                  onChange={handlePhotoChange}
                />
                {preview ? (
                  <Box component="img" src={preview} sx={{ maxHeight: 200, borderRadius: '8px' }} />
                ) : (
                  <>
                    <CameraAlt sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                    <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                      Drag and drop photo or click to browse
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      JPG or PNG, max 10MB
                    </Typography>
                  </>
                )}
              </Box>

              {/* Zone Selector */}
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel>Zone</InputLabel>
                <Select
                  value={form.zoneId}
                  label="Zone"
                  onChange={(e) => updateForm('zoneId', e.target.value)}
                >
                  {zones.map((z) => (
                    <MenuItem key={z.id} value={z.id}>
                      {z.name} — {z.mineName} ({z.district})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Crack Type Tags */}
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Crack Type
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {CRACK_TYPES.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    onClick={() => toggleTag(tag)}
                    variant={selectedTags.includes(tag) ? 'filled' : 'outlined'}
                    color={selectedTags.includes(tag) ? 'primary' : 'default'}
                    sx={{ fontWeight: 500 }}
                  />
                ))}
              </Box>

              {/* Severity */}
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel>Severity</InputLabel>
                <Select
                  value={form.severity}
                  label="Severity"
                  onChange={(e) => updateForm('severity', e.target.value)}
                >
                  {SEVERITY_LEVELS.map((s) => (
                    <MenuItem key={s} value={s.toLowerCase()}>{s}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Remarks */}
              <TextField
                label="Remarks"
                multiline
                rows={3}
                fullWidth
                size="small"
                value={form.remarks}
                onChange={(e) => updateForm('remarks', e.target.value)}
                sx={{ mb: 2 }}
              />

              {/* Coordinates */}
              <Grid container spacing={1.5} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <TextField
                    label="Latitude"
                    size="small"
                    fullWidth
                    value={form.lat}
                    onChange={(e) => updateForm('lat', e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Longitude"
                    size="small"
                    fullWidth
                    value={form.lng}
                    onChange={(e) => updateForm('lng', e.target.value)}
                  />
                </Grid>
              </Grid>

              <Button
                variant="contained"
                fullWidth
                startIcon={submitting ? null : <Send />}
                onClick={handleSubmit}
                disabled={submitting}
                sx={{ py: 1.2 }}
              >
                {submitting ? 'Submitting...' : 'Submit Report'}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Preview Card */}
        <Grid item xs={12} md={5}>
          <Card sx={{ position: 'sticky', top: 80 }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                Report Preview
              </Typography>

              {preview ? (
                <CardMedia
                  component="img"
                  image={preview}
                  sx={{ borderRadius: '8px', mb: 2, maxHeight: 200, objectFit: 'cover' }}
                />
              ) : (
                <Box
                  sx={{
                    height: 150,
                    bgcolor: '#F5F5F5',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    No photo selected
                  </Typography>
                </Box>
              )}

              {selectedZone && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                    {selectedZone.name}
                  </Typography>
                  <RiskBadge level={selectedZone.riskLevel} />
                </Box>
              )}

              {selectedZone?.riskLevel === 'red' && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>
                  This zone is already at CRITICAL risk level
                </Alert>
              )}

              <Chip
                label="AI Risk Score: Pending"
                sx={{
                  width: '100%',
                  bgcolor: '#E3F2FD',
                  color: '#1565C0',
                  fontWeight: 500,
                  py: 1,
                }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UploadPage;
