import RefreshIcon from '@mui/icons-material/Refresh';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useReports } from '../controllers/useReportsController';
import type { ReportDailyTotal, ReportTopContact, ReportTopProduct } from '../types/models';

const REPORTS_LOCALE = 'es-ES';

function formatCurrency(value: number): string {
  return `$ ${new Intl.NumberFormat(REPORTS_LOCALE, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value || 0))}`;
}

function formatInteger(value: number): string {
  return new Intl.NumberFormat(REPORTS_LOCALE, {
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function formatDay(value: string): string {
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(REPORTS_LOCALE, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(parsed);
}

function paymentMethodLabel(value: string): string {
  if (!value || value === 'sin_metodo') {
    return 'Sin método';
  }

  if (value === 'cash') {
    return 'Efectivo';
  }

  if (value === 'transfer') {
    return 'Transferencia';
  }

  return value;
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <Paper sx={{ p: 2.5 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
        {label}
      </Typography>
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        {value}
      </Typography>
    </Paper>
  );
}

function TopProductsTable({ items }: { items: ReportTopProduct[] }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
          <TableRow>
            <TableCell>Producto</TableCell>
            <TableCell>SKU</TableCell>
            <TableCell align="right">Cantidad</TableCell>
            <TableCell align="right">Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.length > 0 ? (
            items.map((item) => (
              <TableRow key={item.product_id} hover>
                <TableCell>{item.product_name}</TableCell>
                <TableCell>{item.sku || '-'}</TableCell>
                <TableCell align="right">{formatInteger(item.quantity)}</TableCell>
                <TableCell align="right">{formatCurrency(item.total)}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} align="center" sx={{ py: 2.5 }}>
                <Typography color="text.secondary">No hay datos en el período seleccionado.</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function TopContactsTable({
  title,
  items,
}: {
  title: string;
  items: ReportTopContact[];
}) {
  return (
    <Stack spacing={1.5}>
      <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell align="right">Órdenes</TableCell>
              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.length > 0 ? (
              items.map((item, index) => (
                <TableRow key={`${item.contact_id || 'none'}-${index}`} hover>
                  <TableCell>{item.contact_name}</TableCell>
                  <TableCell align="right">{formatInteger(item.orders_count)}</TableCell>
                  <TableCell align="right">{formatCurrency(item.total)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 2.5 }}>
                  <Typography color="text.secondary">No hay datos en el período seleccionado.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}

function DailyTotalsTable({
  title,
  items,
}: {
  title: string;
  items: ReportDailyTotal[];
}) {
  return (
    <Stack spacing={1.5}>
      <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell align="right">Órdenes</TableCell>
              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.length > 0 ? (
              items.map((item) => (
                <TableRow key={item.date} hover>
                  <TableCell>{formatDay(item.date)}</TableCell>
                  <TableCell align="right">{formatInteger(item.orders_count)}</TableCell>
                  <TableCell align="right">{formatCurrency(item.total)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 2.5 }}>
                  <Typography color="text.secondary">No hay datos en el período seleccionado.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}

export default function ReportsPage() {
  const {
    loading,
    error,
    overview,
    fromDate,
    toDate,
    topLimit,
    setFromDate,
    setToDate,
    setTopLimit,
    applyFilters,
  } = useReports();

  if (loading && !overview) {
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
      <Stack spacing={3}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 600 }}>
            Reportes
          </Typography>
        </Box>

        <Paper sx={{ p: 2.5 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
            <TextField
              label="Desde"
              type="date"
              value={fromDate}
              onChange={(event) => setFromDate(event.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: { xs: '100%', md: 180 } }}
            />
            <TextField
              label="Hasta"
              type="date"
              value={toDate}
              onChange={(event) => setToDate(event.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: { xs: '100%', md: 180 } }}
            />
            <FormControl sx={{ minWidth: { xs: '100%', md: 180 } }}>
              <InputLabel id="top-limit-label">Top resultados</InputLabel>
              <Select
                labelId="top-limit-label"
                label="Top resultados"
                value={topLimit}
                onChange={(event) => setTopLimit(String(event.target.value))}
              >
                <MenuItem value="5">5</MenuItem>
                <MenuItem value="10">10</MenuItem>
                <MenuItem value="15">15</MenuItem>
                <MenuItem value="20">20</MenuItem>
                <MenuItem value="30">30</MenuItem>
                <MenuItem value="50">50</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={applyFilters}
              disabled={loading}
            >
              {loading ? 'Actualizando...' : 'Aplicar filtros'}
            </Button>
          </Stack>
        </Paper>

        {error && <Alert severity="error">{error}</Alert>}

        {overview && (
          <>
            <Box
              sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, minmax(0, 1fr))',
                  lg: 'repeat(4, minmax(0, 1fr))',
                },
              }}
            >
              <SummaryCard label="Ventas (total)" value={formatCurrency(overview.totals.sales_total)} />
              <SummaryCard label="Compras (total)" value={formatCurrency(overview.totals.purchases_total)} />
              <SummaryCard label="Neto ventas - compras" value={formatCurrency(overview.totals.net_total)} />
              <SummaryCard label="Ticket promedio venta" value={formatCurrency(overview.totals.sales_avg_ticket)} />
              <SummaryCard label="Cantidad de ventas" value={formatInteger(overview.totals.sales_count)} />
              <SummaryCard label="Cantidad de compras" value={formatInteger(overview.totals.purchases_count)} />
              <SummaryCard label="Flujo cuentas (ingresos)" value={formatCurrency(overview.bill_flow.in_total)} />
              <SummaryCard label="Flujo cuentas (egresos)" value={formatCurrency(overview.bill_flow.out_total)} />
            </Box>

            <Stack spacing={1.5}>
              <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                Top productos vendidos
              </Typography>
              <TopProductsTable items={overview.top_products} />
            </Stack>

            <Box
              sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, minmax(0, 1fr))' },
              }}
            >
              <TopContactsTable title="Top clientes" items={overview.top_customers} />
              <TopContactsTable title="Top proveedores" items={overview.top_suppliers} />
            </Box>

            <Stack spacing={1.5}>
              <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                Ventas por método de pago
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableRow>
                      <TableCell>Método</TableCell>
                      <TableCell align="right">Órdenes</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {overview.payment_methods.length > 0 ? (
                      overview.payment_methods.map((item) => (
                        <TableRow key={item.payment_method} hover>
                          <TableCell>{paymentMethodLabel(item.payment_method)}</TableCell>
                          <TableCell align="right">{formatInteger(item.orders_count)}</TableCell>
                          <TableCell align="right">{formatCurrency(item.total)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} align="center" sx={{ py: 2.5 }}>
                          <Typography color="text.secondary">No hay datos en el período seleccionado.</Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Stack>

            <Box
              sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, minmax(0, 1fr))' },
              }}
            >
              <DailyTotalsTable title="Ventas por día" items={overview.sales_by_day} />
              <DailyTotalsTable title="Compras por día" items={overview.purchases_by_day} />
            </Box>
          </>
        )}
      </Stack>
    </Container>
  );
}
