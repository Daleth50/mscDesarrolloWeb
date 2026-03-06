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
import { usePurchasesList } from '../controllers/usePurchasesListController';
import { formatDateTime } from '../utils/date';
import {
  getOrderStatusColor,
  getOrderStatusLabel,
  getPaymentStatusColor,
  getPaymentStatusLabel,
} from '../utils/orderPresentation';

export default function PurchasesListPage() {
  const { purchases, loading, error } = usePurchasesList();

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
          Compras
        </Typography>
        <Button
          component={Link}
          to="/purchases"
          variant="contained"
          startIcon={<AddIcon />}
        >
          Comprar
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: 'action.hover' }}>
            <TableRow>
              <TableCell>Proveedor</TableCell>
              <TableCell>Fecha creación</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Pago</TableCell>
              <TableCell align="center">Detalle</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {purchases.length > 0 ? (
              purchases.map((purchase) => (
                <TableRow key={purchase.id} hover>
                  <TableCell>{purchase.contact_name || '-'}</TableCell>
                  <TableCell>{formatDateTime(purchase.created_at)}</TableCell>
                  <TableCell align="right">${purchase.total}</TableCell>
                  <TableCell>
                    <Chip
                      label={getOrderStatusLabel(purchase.status)}
                      color={getOrderStatusColor(purchase.status)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getPaymentStatusLabel(purchase.payment_status)}
                      color={getPaymentStatusColor(purchase.payment_status)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Button component={Link} to={`/purchase-orders/${purchase.id}`} size="small" variant="outlined">
                      Ver detalle
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <Typography color="text.secondary">No hay compras aún.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
