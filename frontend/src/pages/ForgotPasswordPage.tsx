import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { getErrorMessage } from '../utils/error';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!identifier.trim()) {
      setError('Usuario o email es requerido');
      return;
    }

    try {
      setLoading(true);
      await api.post('/auth/password/forgot', {
        identifier: identifier.trim(),
      });
      navigate(`/reset-password?identifier=${encodeURIComponent(identifier.trim())}`);
    } catch (err) {
      setError(getErrorMessage(err));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h4" component="h2" sx={{ mb: 2, fontWeight: 600 }}>
          Restaurar contraseña
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Ingresa tu usuario o email para solicitar un enlace de restauración.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            label="Usuario o email"
            id="identifier"
            name="identifier"
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
            required
            fullWidth
            variant="outlined"
          />

          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={20} /> : 'Enviar solicitud'}
          </Button>

          <Button component={RouterLink} to="/login" variant="text">
            Volver al login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
