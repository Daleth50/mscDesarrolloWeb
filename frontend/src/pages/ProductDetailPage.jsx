import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Typography,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { productService } from '../services/productService';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await productService.getById(id);
      if (data) {
        setProduct(data);
      } else {
        setError('Producto no encontrado');
      }
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Eliminar este producto?')) return;
    
    try {
      await productService.delete(id);
      navigate('/products');
    } catch (err) {
      setError(err.message);
      alert('Error al eliminar: ' + err.message);
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

  if (error || !product) {
    return (
      <Container maxWidth="sm">
        <Alert severity="error" sx={{ mt: 3, mb: 2 }}>
          {error || 'Producto no encontrado'}
        </Alert>
        <Button
          component={Link}
          to="/products"
          startIcon={<ArrowBackIcon />}
          variant="outlined"
        >
          Volver a productos
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Card elevation={2}>
        <CardContent>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Typography variant="h4" component="h2" sx={{ fontWeight: 600 }}>
              {product.name}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={3} sx={{ my: 2 }}>
            <Grid item xs={6}>
              <Typography variant="caption" color="textSecondary" display="block">
                SKU
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {product.sku || '-'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" color="textSecondary" display="block">
                Categoría
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {product.category || '-'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" color="textSecondary" display="block">
                Precio
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.main' }}>
                ${product.price}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" color="textSecondary" display="block">
                Costo
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                ${product.cost}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" color="textSecondary" display="block">
                Margen
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                ${(product.price - product.cost).toFixed(2)}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" color="textSecondary" display="block">
                Tasa de impuesto
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {product.tax_rate}%
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ gap: 1, justifyContent: 'space-between' }}>
          <Button
            component={Link}
            to="/products"
            startIcon={<ArrowBackIcon />}
            variant="outlined"
          >
            Volver
          </Button>
          <Box>
            <Button
              component={Link}
              to={`/products/${product.id}/edit`}
              startIcon={<EditIcon />}
              variant="contained"
              color="warning"
              sx={{ mr: 1 }}
            >
              Editar
            </Button>
            <Button
              onClick={handleDelete}
              startIcon={<DeleteIcon />}
              variant="contained"
              color="error"
            >
              Eliminar
            </Button>
          </Box>
        </CardActions>
      </Card>
    </Container>
  );
}
