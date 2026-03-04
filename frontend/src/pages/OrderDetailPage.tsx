import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Alert,
  Box,
  Button,
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
import { useOrderDetail } from '../controllers/useOrderDetailController';

export default function OrderDetailPage() {
  const { loading, error, order, handleBack } = useOrderDetail();

  if (loading) {
    return (
      <Container maxWidth="xl">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !order) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Venta no encontrada'}
        </Alert>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleBack}>
          Volver a ventas
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
              Detalle de venta
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ID: {order.id}
            </Typography>
          </Box>
          <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleBack}>
            Volver
          </Button>
        </Box>

        <Paper sx={{ p: 2.5 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
            <Box>
              <Typography variant="body2" color="text.secondary">Contacto</Typography>
              <Typography variant="body1">{order.contact_name || '-'}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">Estado</Typography>
              <Typography variant="body1">{order.status || '-'}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">Pago</Typography>
              <Typography variant="body1">{order.payment_status || '-'}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">Total</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                ${Number(order.total || 0).toFixed(2)}
              </Typography>
            </Box>
          </Stack>
        </Paper>

        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell>Producto</TableCell>
                <TableCell align="right">Cantidad</TableCell>
                <TableCell align="right">Precio</TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(order.items || []).length > 0 ? (
                (order.items || []).map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>{item.product_name || item.product_id}</TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                    <TableCell align="right">${Number(item.price || 0).toFixed(2)}</TableCell>
                    <TableCell align="right">${Number(item.total || 0).toFixed(2)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                    <Typography color="text.secondary">Esta venta no tiene ítems registrados.</Typography>
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
