import React, { useEffect, useState } from 'react';
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
  IconButton,
  TablePagination,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { useProductsList } from '../controllers/useProductsListController';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/number';

export default function ProductsPage() {
  const { products, loading, error, handleView, handleEdit } = useProductsList();
  const { canEditProducts } = useAuth();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(products.length / rowsPerPage) - 1);
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [products.length, page, rowsPerPage]);

  const paginatedProducts = products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Container maxWidth="xl">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
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

      <Paper>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>SKU</TableCell>
                <TableCell align="right">Precio</TableCell>
                <TableCell align="right">Costo</TableCell>
                <TableCell align="right">Stock actual</TableCell>
                <TableCell>Categoría</TableCell>
                <TableCell align="center">Acciones</TableCell>
                <TableCell>Detalle</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.length > 0 ? (
                paginatedProducts.map(product => (
                  <TableRow key={product.id} hover>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.sku || '-'}</TableCell>
                    <TableCell align="right">{formatCurrency(product.price ?? 0)}</TableCell>
                    <TableCell align="right">{formatCurrency(product.cost ?? 0)}</TableCell>
                    <TableCell align="right">{(product.stock_available ?? 0).toFixed(2)}</TableCell>
                    <TableCell>{product.category_name || '-'}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={() => handleEdit(product.id)}
                        size="small"
                        color="warning"
                        title="Editar"
                        disabled={!canEditProducts}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleView(product.id)}
                        size="small"
                        variant="outlined"
                      >
                        Ver detalle
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                    <Typography color="textSecondary">No hay productos aún.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={products.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="Filas por página"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
      </Paper>
    </Container>
  );
}
