import React from 'react';
import {
  Container,
  Box,
  TextField,
  Button,
  Alert,
  Stack,
  Typography,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useContactForm } from '../view_models/useContactForm';

export default function ContactFormPage() {
  const navigate = useNavigate();
  const { error, formData, handleChange, handleSubmit } = useContactForm();

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h4" component="h2" sx={{ mb: 3, fontWeight: 600 }}>
          Crear contacto
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

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

          <TextField
            label="Email"
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            variant="outlined"
          />

          <TextField
            label="Teléfono"
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
            variant="outlined"
          />

          <TextField
            label="Dirección"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            multiline
            rows={4}
          />

          <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end', pt: 2 }}>
            <Button
              type="button"
              variant="outlined"
              onClick={() => navigate(-1)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              Crear contacto
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
}
