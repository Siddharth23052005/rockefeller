import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { CloudUpload as UploadIcon, CameraAlt } from '@mui/icons-material';

export const PhotoUploader = ({ onFileSelect, preview }) => {
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      onFileSelect?.(file);
    }
  };

  return (
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
        transition: 'all 0.2s',
        '&:hover': { borderColor: 'primary.main', bgcolor: '#F0F7FF' },
      }}
      onClick={() => document.getElementById('uploader-input')?.click()}
    >
      <input
        id="uploader-input"
        type="file"
        accept="image/jpeg,image/png"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileSelect?.(file);
        }}
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
  );
};

export default PhotoUploader;
