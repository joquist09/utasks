import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/api/auth';

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
  };

  return (
    <AppBar position="static" sx={{ mb: 2 }}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ cursor: 'pointer' }}
          onClick={() => {
            void navigate('/boards');
          }}
        >
          UTasks
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Button color="inherit" onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;