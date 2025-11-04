import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './services/store/store';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { authService } from './services/api/auth';
import 'bootstrap/dist/css/bootstrap.min.css';

import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import BoardsList from './components/boards/BoardsList';
import BoardPage from './pages/BoardPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0052cc',
    },
    background: {
      default: '#f8f9fa',
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 390,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          height: '100%',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          margin: '16px',
          width: 'calc(100% - 32px)',
          maxWidth: '600px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          width: '100%',
        },
      },
    },
  },
});

const App: React.FC = () => {
  const handleLogin = async (username: string): Promise<void> => {
    try {
      await authService.login(username);
      window.location.href = '/boards';
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const handleRegister = async (username: string): Promise<void> => {
    try {
      await authService.register(username);
      window.location.href = '/boards';
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
            <Route path="/register" element={<RegisterForm onRegister={handleRegister} />} />
            <Route 
              path="/boards" 
              element={
                <ProtectedRoute>
                  <BoardsList />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/boards/:id" 
              element={
                <ProtectedRoute>
                  <BoardPage />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;