import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
} from '@mui/material';

const Profile = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar
            sx={{ width: 100, height: 100, mb: 2 }}
          />
          <Typography variant="h4" gutterBottom>
            User Profile
          </Typography>
          <Typography variant="body1" gutterBottom>
            Email: user@example.com
          </Typography>
          <Typography variant="body1" gutterBottom>
            Games Played: 0
          </Typography>
          <Typography variant="body1" gutterBottom>
            Member Since: {new Date().toLocaleDateString()}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile; 