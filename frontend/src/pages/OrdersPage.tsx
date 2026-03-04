
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
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useOrdersList } from '../controllers/useOrdersListController';

const getStatusColor = (status?: string | null) => {
  switch (status) {
    case 'completed':
      return 'success';
    case 'pending':
      return 'warning';
    case 'cancelled':
      return 'error';
    default:
      return 'default';
  }
};

const getStatusLabel = (status?: string | null) => {
  switch (status) {
    case 'completed':
      return 'Completada';
    case 'pending':
      return 'Pendiente';
    case 'cancelled':
      return 'Cancelada';
    default:
      return '-';
  }
};

const getPaymentColor = (status?: string | null) => {
  switch (status) {
    case 'paid':
      return 'success';
    case 'unpaid':
      return 'error';
    case 'partial':
      return 'warning';
    default:
      return 'default';
  }
};

const getPaymentLabel = (status?: string | null) => {
  switch (status) {
    case 'paid':
      return 'Pagado';
    case 'unpaid':
      return 'No pagado';
    case 'partial':
      return 'Parcial';
    case 'pending':
      return 'Pendiente';
    default:
      return '-';
  }
};

export default function OrdersPage() {
  const { orders, loading, error } = useOrdersList();

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

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>Contacto</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Pago</TableCell>
              <TableCell align="center">Detalle</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length > 0 ? (
              orders.map(order => (
                <TableRow key={order.id} hover>
                  <TableCell>{order.contact_name || '-'}</TableCell>
                  <TableCell align="right">${order.total}</TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(order.status)}
                      color={getStatusColor(order.status)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getPaymentLabel(order.payment_status)}
                      color={getPaymentColor(order.payment_status)}
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
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  <Typography color="textSecondary">No hay Ventas aún.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
