import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { useProductDetail } from '../controllers/useProductDetailController';
import { useAuth } from '../context/AuthContext';
import { formatDateTime } from '../utils/date';
import { formatCurrency } from '../utils/number';

function formatQuantity(value: number): string {
  return new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

export default function ProductDetailPage() {
  const {
    product,
    movements,
    movementsError,
    loading,
    movementsLoading,
    error,
    movementsPage,
    movementsRowsPerPage,
    movementsTotal,
    handleMovementsPageChange,
    handleMovementsRowsPerPageChange,
    handleEdit,
    handleBack,
  } = useProductDetail();
  const { canEditProducts } = useAuth();

  if (loading) {
    return (
      <Container maxWidth="xl">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="xl">
        <Alert severity="error" sx={{ mt: 3, mb: 2 }}>
          {error || 'Producto no encontrado'}
        </Alert>
        <Button onClick={handleBack} startIcon={<ArrowBackIcon />} variant="outlined">
          Volver a productos
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h4" component="h2" sx={{ fontWeight: 600 }}>
              {product.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              SKU: {product.sku || '-'}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1}>
            <Button onClick={handleBack} startIcon={<ArrowBackIcon />} variant="outlined">
              Volver
            </Button>
            {canEditProducts && (
              <Button onClick={handleEdit} startIcon={<EditIcon />} variant="contained" color="warning">
                Editar
              </Button>
            )}
          </Stack>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: {
              xs: '1fr',
              lg: '380px minmax(0, 1fr)',
            },
            alignItems: 'start',
          }}
        >
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Información general
              </Typography>

              <Divider sx={{ my: 1.5 }} />

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Categoría
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {product.category_name || '-'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Stock actual
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {formatQuantity(product.stock_available ?? 0)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Precio
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700, color: 'success.main' }}>
                    {formatCurrency(product.price ?? 0)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Costo
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {formatCurrency(product.cost ?? 0)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Margen
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {formatCurrency((product.price ?? 0) - (product.cost ?? 0))}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Tasa de impuesto
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {product.tax_rate != null ? `${product.tax_rate}%` : '-'}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card elevation={2}>
            <CardContent sx={{ pb: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5 }}>
                Histórico de movimientos
              </Typography>

              {movementsError && (
                <Alert severity="warning" sx={{ mb: 1.5 }}>
                  No se pudo cargar el histórico de movimientos.
                </Alert>
              )}

              <TableContainer sx={{ maxHeight: { xs: 'none', lg: 520 } }}>
                <Table size="small" stickyHeader>
                  <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableRow>
                      <TableCell>Fecha</TableCell>
                      <TableCell>Movimiento</TableCell>
                      <TableCell align="right">Cantidad</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {movementsLoading ? (
                      <TableRow>
                        <TableCell colSpan={3} align="center" sx={{ py: 2.5 }}>
                          <Typography color="text.secondary">Cargando movimientos...</Typography>
                        </TableCell>
                      </TableRow>
                    ) : movements.length > 0 ? (
                      movements.map((movement) => {
                        const isInbound = movement.movement_type === 'in';

                        return (
                          <TableRow key={movement.id} hover>
                            <TableCell>{formatDateTime(movement.occurred_at)}</TableCell>
                            <TableCell>
                              <Chip
                                label={isInbound ? 'Entrada' : 'Salida'}
                                color={isInbound ? 'success' : 'error'}
                                size="small"
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{
                                color: isInbound ? 'success.main' : 'error.main',
                                fontWeight: 600,
                              }}
                            >
                              {isInbound ? '+' : '-'}{formatQuantity(Math.abs(movement.quantity || 0))}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} align="center" sx={{ py: 2.5 }}>
                          <Typography color="text.secondary">No hay movimientos registrados para este producto.</Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>

            <TablePagination
              component="div"
              count={movementsTotal}
              page={movementsPage}
              rowsPerPage={movementsRowsPerPage}
              onPageChange={handleMovementsPageChange}
              onRowsPerPageChange={handleMovementsRowsPerPageChange}
              rowsPerPageOptions={[5, 10, 25, 50]}
              labelRowsPerPage="Filas por página"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
            />
          </Card>
        </Box>
      </Stack>
    </Container>
  );
}
