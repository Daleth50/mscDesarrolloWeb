import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import { useProductDetail } from '../view_models/useProductDetail';
import { useAuth } from '../context/AuthContext';

export default function ProductDetailPage() {
  const { product, loading, error, handleEdit, handleDelete, handleBack } = useProductDetail();
  const { canEditProducts } = useAuth();

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
          onClick={handleBack}
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
                {product.category_name || '-'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" color="textSecondary" display="block">
                Precio
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.main' }}>
                ${(product.price ?? 0).toFixed(2)}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" color="textSecondary" display="block">
                Costo
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                ${(product.cost ?? 0).toFixed(2)}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" color="textSecondary" display="block">
                Margen
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                ${((product.price ?? 0) - (product.cost ?? 0)).toFixed(2)}
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
            onClick={handleBack}
            startIcon={<ArrowBackIcon />}
            variant="outlined"
          >
            Volver
          </Button>
          <Box>
            {canEditProducts && (
              <>
                <Button
                  onClick={handleEdit}
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
              </>
            )}
          </Box>
        </CardActions>
      </Card>
    </Container>
  );
}
