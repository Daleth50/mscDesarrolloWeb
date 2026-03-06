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
  Chip,
  TablePagination,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useOrdersList } from '../controllers/useOrdersListController';
import { formatDateTime } from '../utils/date';
import {
  getOrderStatusColor,
  getOrderStatusLabel,
  getPaymentStatusColor,
  getPaymentStatusLabel,
} from '../utils/orderPresentation';

export default function OrdersPage() {
  const { orders, loading, error } = useOrdersList();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(orders.length / rowsPerPage) - 1);
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [orders.length, page, rowsPerPage]);

  const paginatedOrders = orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
          Ventas
        </Typography>
        <Button
          component={Link}
          to="/pos"
          variant="contained"
          startIcon={<AddIcon />}
        >
          Crear venta
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Paper>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell>Contacto</TableCell>
                <TableCell>Fecha creación</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Pago</TableCell>
                <TableCell align="center">Detalle</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.length > 0 ? (
                paginatedOrders.map(order => (
                  <TableRow key={order.id} hover>
                    <TableCell>{order.contact_name || '-'}</TableCell>
                    <TableCell>{formatDateTime(order.created_at)}</TableCell>
                    <TableCell align="right">${order.total}</TableCell>
                    <TableCell>
                      <Chip
                        label={getOrderStatusLabel(order.status)}
                        color={getOrderStatusColor(order.status)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getPaymentStatusLabel(order.payment_status)}
                        color={getPaymentStatusColor(order.payment_status)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Button component={Link} to={`/orders/${order.id}`} size="small" variant="outlined">
                        Ver detalle
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <Typography color="textSecondary">No hay Ventas aún.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={orders.length}
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
