import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useUserForm } from '../view_models/useUserForm';

export default function UserFormPage() {
  const navigate = useNavigate();
  const {
    loading,
    error,
    formData,
    isEdit,
    handleChange,
    handleSubmit,
  } = useUserForm();

  if (loading && isEdit) {
    return (
      <Container maxWidth="sm">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h4" component="h2" sx={{ mb: 3, fontWeight: 600 }}>
          {isEdit ? 'Editar usuario' : 'Crear usuario'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            label="Nombre"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
            fullWidth
            variant="outlined"
          />

          <TextField
            label="Apellido"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
            fullWidth
            variant="outlined"
          />

          <TextField
            label="Email"
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            fullWidth
            variant="outlined"
          />

          <TextField
            label="Usuario"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            fullWidth
            variant="outlined"
          />

          {!isEdit && (
            <TextField
              label="Contraseña"
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
            />
          )}

          {isEdit && (
            <Typography variant="caption" color="textSecondary" sx={{ mb: -1 }}>
              Deja la contraseña en blanco para mantener la actual
            </Typography>
          )}

          {isEdit && (
            <TextField
              label="Contraseña (opcional)"
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              placeholder="Deja en blanco para mantener la actual"
            />
          )}

          <FormControl fullWidth>
            <InputLabel id="role-label">Rol</InputLabel>
            <Select
              labelId="role-label"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              label="Rol"
              required
            >
              <MenuItem value="seller">Vendedor</MenuItem>
              <MenuItem value="admin">Administrador</MenuItem>
            </Select>
          </FormControl>

          <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end', pt: 2 }}>
            <Button
              type="button"
              variant="outlined"
              onClick={() => navigate('/users')}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {isEdit ? 'Guardar cambios' : 'Crear usuario'}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
}
