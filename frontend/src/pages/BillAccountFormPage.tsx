import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useBillAccountForm } from '../controllers/useBillAccountFormController';

export default function BillAccountFormPage() {
  const navigate = useNavigate();
  const {
    loading,
    error,
    formData,
    isEdit,
    handleChange,
    handleSubmit,
  } = useBillAccountForm();

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
          {isEdit ? 'Editar cuenta de banco' : 'Crear cuenta de banco'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            label="Nombre"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            fullWidth
            variant="outlined"
          />

          <FormControl fullWidth>
            <InputLabel id="bill-account-type-label">Tipo</InputLabel>
            <Select
              labelId="bill-account-type-label"
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              label="Tipo"
              required
            >
              <MenuItem value="cash">cash</MenuItem>
              <MenuItem value="debt">debt</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Balance"
            id="balance"
            name="balance"
            type="number"
            value={formData.balance}
            onChange={handleChange}
            fullWidth
            variant="outlined"
          />

          <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end', pt: 2 }}>
            <Button
              type="button"
              variant="outlined"
              onClick={() => navigate('/bill-accounts')}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {isEdit ? 'Guardar cambios' : 'Crear cuenta'}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
}
