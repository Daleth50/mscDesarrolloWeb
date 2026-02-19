import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  CircularProgress,
  Alert,
  Stack,
  Typography,
  Paper,
} from '@mui/material';
import { productService, categoryService } from '../services/productService';

export default function ProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: 0,
    cost: 0,
    tax_rate: 0,
    taxonomy_id: '',
  });

  useEffect(() => {
    loadPage();
  }, [id]);

  const loadPage = async () => {
    try {
      setLoading(true);
      
      // Cargar categorías
      const cats = await categoryService.getAll();
      setCategories(cats);

      // Si es edición, cargar el producto
      if (isEdit) {
        const product = await productService.getById(id);
        if (product) {
          setFormData({
            name: product.name || '',
            sku: product.sku || '',
            price: product.price || 0,
            cost: product.cost || 0,
            tax_rate: product.tax_rate || 0,
            taxonomy_id: product.taxonomy_id || '',
          });
        }
      }
      
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'cost' || name === 'tax_rate' 
        ? parseFloat(value) 
        : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let result;
      if (isEdit) {
        result = await productService.update(id, formData);
      } else {
        result = await productService.create(formData);
      }
      navigate(`/products/${result.id}`);
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  if (loading) {
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
          {isEdit ? 'Editar producto' : 'Crear producto'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            label="Nombre del producto"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            fullWidth
            variant="outlined"
          />
          <TextField
            label="SKU"
            id="sku"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            label="Precio"
            id="price"
            name="price"
            type="number"
            inputProps={{ step: '0.01', min: '0' }}
            value={formData.price}
            onChange={handleChange}
            required
            fullWidth
            variant="outlined"
          />
          <TextField
            label="Costo"
            id="cost"
            name="cost"
            type="number"
            inputProps={{ step: '0.01', min: '0' }}
            value={formData.cost}
            onChange={handleChange}
            required
            fullWidth
            variant="outlined"
          />
          <FormControl fullWidth>
            <InputLabel id="taxonomy_id-label">Categoría</InputLabel>
            <Select
              labelId="taxonomy_id-label"
              id="taxonomy_id"
              name="taxonomy_id"
              value={formData.taxonomy_id}
              onChange={handleChange}
              label="Categoría"
            >
              <MenuItem value="">Sin categoría</MenuItem>
              {categories.map(cat => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="tax_rate-label">Tasa de impuesto</InputLabel>
            <Select
              labelId="tax_rate-label"
              id="tax_rate"
              name="tax_rate"
              value={formData.tax_rate}
              onChange={handleChange}
              label="Tasa de impuesto"
              required
            >
              <MenuItem value="0">0%</MenuItem>
              <MenuItem value="8">8%</MenuItem>
              <MenuItem value="16">16%</MenuItem>
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
              {isEdit ? 'Guardar cambios' : 'Crear producto'}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
}

