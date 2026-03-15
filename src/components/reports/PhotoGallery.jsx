import React from 'react';
import { Grid, Box } from '@mui/material';

export const PhotoGallery = ({ children }) => {
  return (
    <Grid container spacing={2}>
      {React.Children.map(children, (child) => (
        <Grid item xs={12} sm={6} md={4}>
          {child}
        </Grid>
      ))}
    </Grid>
  );
};

export default PhotoGallery;
