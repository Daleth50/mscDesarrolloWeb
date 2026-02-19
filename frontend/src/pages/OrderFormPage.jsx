import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Alert,
  Stack,
  Typography,
  Paper,
  Grid,
} from '@mui/material';
import { orderService } from '../services/orderService';

export default function OrderFormPage() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    contact_id: '',
    total: 0,
    subtotal: 0,
    tax: 0,
    discount: 0,
    status: 'pending',
    payment_status: 'unpaid',
    payment_method: 'cash',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['total', 'subtotal', 'tax', 'discount'].includes(name) 
        ? parseFloat(value) 
        : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await orderService.create(formData);
      navigate('/orders');
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h4" component="h2" sx={{ mb: 3, fontWeight: 600 }}>
          Crear orden
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            label="Contacto ID"
            id="contact_id"
            name="contact_id"
            value={formData.contact_id}
            onChange={handleChange}
            fullWidth
            variant="outlined"
          />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Subtotal"
                id="subtotal"
                name="subtotal"
                type="number"
                inputProps={{ step: '0.01', min: '0' }}
                value={formData.subtotal}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Impuesto"
                id="tax"
                name="tax"
                type="number"
                inputProps={{ step: '0.01', min: '0' }}
                value={formData.tax}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Descuento"
                id="discount"
                name="discount"
                type="number"
                inputProps={{ step: '0.01', min: '0' }}
                value={formData.discount}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Total"
                id="total"
                name="total"
                type="number"
                inputProps={{ step: '0.01', min: '0' }}
                value={formData.total}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
              />
            </Grid>
          </Grid>

          <FormControl fullWidth>
            <InputLabel id="status-label">Estado</InputLabel>
            <Select
              labelId="status-label"
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              label="Estado"
            >
              <MenuItem value="pending">Pendiente</MenuItem>
              <MenuItem value="completed">Completada</MenuItem>
              <MenuItem value="cancelled">Cancelada</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="payment_status-label">Estado de pago</InputLabel>
            <Select
              labelId="payment_status-label"
              id="payment_status"
              name="payment_status"
              value={formData.payment_status}
              onChange={handleChange}
              label="Estado de pago"
            >
              <MenuItem value="unpaid">No pagada</MenuItem>
              <MenuItem value="paid">Pagada</MenuItem>
              <MenuItem value="partial">Parcial</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="payment_method-label">Método de pago</InputLabel>
            <Select
              labelId="payment_method-label"
              id="payment_method"
              name="payment_method"
              value={formData.payment_method}
              onChange={handleChange}
              label="Método de pago"
            >
              <MenuItem value="cash">Efectivo</MenuItem>
              <MenuItem value="card">Tarjeta</MenuItem>
              <MenuItem value="transfer">Transferencia</MenuItem>
            </Select>
          </FormControl>

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
              Crear orden
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
}
