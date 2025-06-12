import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Container,
  Tabs,
  Tab,
  IconButton,
  Tooltip
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LogoutIcon from '@mui/icons-material/Logout';

const Layout = ({ children }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  // Determine which tab is active based on current path
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.startsWith('/dashboard')) return 0;
    if (path.startsWith('/comments')) return 1;
    if (path.startsWith('/new-post') || path.startsWith('/edit/')) return 2;
    return 0; // Default to dashboard
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Blog Author Dashboard
          </Typography>
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ mr: 2 }}>
                Welcome, {user.name}
              </Typography>
              <Tooltip title="Logout">
                <IconButton color="inherit" onClick={handleLogout} edge="end">
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Toolbar>
        {user && (
          <Box sx={{ bgcolor: 'primary.dark' }}>
            <Tabs 
              value={getActiveTab()} 
              textColor="inherit"
              indicatorColor="secondary"
              variant="fullWidth"
              sx={{ maxWidth: 600, mx: 'auto' }}
            >
              <Tab label="Posts" onClick={() => handleNavigation('/dashboard')} />
              <Tab label="Comments" onClick={() => handleNavigation('/comments')} />
              <Tab label="New Post" onClick={() => handleNavigation('/new-post')} />
            </Tabs>
          </Box>
        )}
      </AppBar>
      <Container component="main" sx={{ mt: 4, mb: 4 }}>
        {children}
      </Container>
    </>
  );
};

export default Layout;

 