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
import { useMemo, useState } from 'react';
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { getErrorMessage } from '../utils/error';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryIdentifier = useMemo(() => (searchParams.get('identifier') || '').trim(), [searchParams]);

  const [identifier, setIdentifier] = useState(queryIdentifier);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!identifier.trim()) {
      setError('El usuario o email es requerido.');
      return;
    }
    if (!password || password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/auth/password/reset', {
        identifier: identifier.trim(),
        new_password: password,
      });
      setMessage(response.message || 'Contraseña actualizada correctamente.');
      setTimeout(() => navigate('/login'), 1000);
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
          Nueva contraseña
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Define una nueva contraseña para tu cuenta.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {message && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {message}
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
          <TextField
            label="Nueva contraseña"
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            fullWidth
            variant="outlined"
          />
          <TextField
            label="Confirmar nueva contraseña"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
            fullWidth
            variant="outlined"
          />

          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={20} /> : 'Actualizar contraseña'}
          </Button>

          <Button component={RouterLink} to="/login" variant="text">
            Ir al login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
