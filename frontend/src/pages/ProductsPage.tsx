import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  CircularProgress,
  Stack,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import { useProductsList } from '../view_models/useProductsList';
import { useAuth } from '../context/AuthContext';

export default function ProductsPage() {
  const { products, loading, error, handleView, handleEdit, handleDelete } = useProductsList();
  const { canEditProducts } = useAuth();

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h2" sx={{ fontWeight: 600 }}>
          Productos
        </Typography>
        {canEditProducts && (
          <Button
            component={Link}
            to="/products/new"
            variant="contained"
            startIcon={<AddIcon />}
          >
            Crear producto
          </Button>
        )}
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell align="right">Precio</TableCell>
              <TableCell align="right">Costo</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.length > 0 ? (
              products.map(product => (
                <TableRow key={product.id} hover>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.sku || '-'}</TableCell>
                  <TableCell align="right">${(product.price ?? 0).toFixed(2)}</TableCell>
                  <TableCell align="right">${(product.cost ?? 0).toFixed(2)}</TableCell>
                  <TableCell>{product.category_name || '-'}</TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <IconButton
                        onClick={() => handleView(product.id)}
                        size="small"
                        color="primary"
                        title="Ver"
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        onClick={() => handleEdit(product.id)}
                        size="small"
                        color="warning"
                        title="Editar"
                        disabled={!canEditProducts}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(product.id)}
                        size="small"
                        color="error"
                        title="Eliminar"
                        disabled={!canEditProducts}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  <Typography color="textSecondary">No hay productos aún.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
