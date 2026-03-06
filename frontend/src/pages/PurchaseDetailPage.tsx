import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { usePurchaseDetail } from '../controllers/usePurchaseDetailController';
import { formatDateTime } from '../utils/date';
import { formatCurrency } from '../utils/number';
import {
  getOrderStatusColor,
  getOrderStatusLabel,
  getPaymentStatusColor,
  getPaymentStatusLabel,
} from '../utils/orderPresentation';

export default function PurchaseDetailPage() {
  const { loading, error, purchase, handleBack } = usePurchaseDetail();

  if (loading) {
    return (
      <Container maxWidth="xl">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !purchase) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Compra no encontrada'}
        </Alert>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleBack}>
          Volver a compras
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" component="h2" sx={{ fontWeight: 600 }}>
              Detalle de compra
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ID: {purchase.id}
            </Typography>
          </Box>
          <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleBack}>
            Volver
          </Button>
        </Box>

        <Paper sx={{ p: 2.5 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
            <Box>
              <Typography variant="body2" color="text.secondary">Proveedor</Typography>
              <Typography variant="body1">{purchase.contact_name || '-'}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">Estado</Typography>
              <Chip
                label={getOrderStatusLabel(purchase.status)}
                color={getOrderStatusColor(purchase.status)}
                size="small"
                variant="outlined"
              />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">Pago</Typography>
              <Chip
                label={getPaymentStatusLabel(purchase.payment_status)}
                color={getPaymentStatusColor(purchase.payment_status)}
                size="small"
                variant="outlined"
              />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">Fecha de creación</Typography>
              <Typography variant="body1">{formatDateTime(purchase.created_at)}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">Total</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {formatCurrency(purchase.total || 0)}
              </Typography>
            </Box>
          </Stack>
        </Paper>

        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: 'action.hover' }}>
              <TableRow>
                <TableCell>Producto</TableCell>
                <TableCell align="right">Cantidad</TableCell>
                <TableCell align="right">Precio</TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(purchase.items || []).length > 0 ? (
                (purchase.items || []).map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>{item.product_name || item.product_id}</TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                    <TableCell align="right">{formatCurrency(item.price || 0)}</TableCell>
                    <TableCell align="right">{formatCurrency(item.total || 0)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                    <Typography color="text.secondary">Esta compra no tiene ítems registrados.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Container>
  );
}
