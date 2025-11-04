import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Container, 
  Alert,
  CircularProgress,
  Link,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

interface LoginFormProps {
  onLogin: (username: string) => Promise<void>;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
      setError('Please enter a username');
      return;
    }

    setError(null);
    setLoading(true);

    try {
  await onLogin(trimmedUsername);
  void navigate('/boards', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'white',
          padding: 3,
          borderRadius: 1,
          boxShadow: 1,
        }}
      >
        <Typography component="h1" variant="h5" gutterBottom>
          Sign in
        </Typography>
        
        <Alert severity="info" sx={{ width: '100%', mb: 2 }}>
          Note: This API doesn't have a login endpoint. Please register first.
        </Alert>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={(event) => {
            void handleSubmit(event);
          }}
          noValidate
          sx={{ mt: 1, width: '100%' }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, height: 40 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign In'}
          </Button>
          
          <Box sx={{ textAlign: 'center' }}>
            <Link component={RouterLink} to="/register" variant="body2">
              {"Don't have an account? Sign Up"}
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginForm;