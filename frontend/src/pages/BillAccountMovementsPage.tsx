import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
import { useBillAccountMovements } from '../controllers/useBillAccountMovementsController';
import type { BillAccountMovement } from '../types/models';
import { formatDateTime } from '../utils/date';
import { formatCurrency } from '../utils/number';

function movementLabel(movementType: BillAccountMovement['movement_type']): string {
  return movementType === 'in' ? 'Ingreso' : 'Egreso';
}

export default function BillAccountMovementsPage() {
  const {
    loading,
    submitting,
    error,
    successMessage,
    account,
    movements,
    createDialogOpen,
    formData,
    formError,
    handleBack,
    openCreateDialog,
    closeCreateDialog,
    handleFormChange,
    handleCreateMovement,
  } = useBillAccountMovements();

  if (loading) {
    return (
      <Container maxWidth="xl">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !account) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Cuenta no encontrada'}
        </Alert>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleBack}>
          Volver a cuentas
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Box>
            <Typography variant="h4" component="h2" sx={{ fontWeight: 600 }}>
              Movimientos de cuenta
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {account.name} · {account.type}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleBack}>
              Volver
            </Button>
            <Button variant="contained" startIcon={<AddIcon />} onClick={openCreateDialog}>
              Nueva transacción
            </Button>
          </Stack>
        </Box>

        <Paper sx={{ p: 2.5 }}>
          <Typography variant="body2" color="text.secondary">
            Balance actual
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: Number(account.balance || 0) >= 0 ? 'success.main' : 'error.main',
            }}
          >
            {formatCurrency(account.balance || 0)}
          </Typography>
        </Paper>

        {successMessage && <Alert severity="success">{successMessage}</Alert>}

        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell>Fecha</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell align="right">Monto</TableCell>
                <TableCell>Origen</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {movements.length > 0 ? (
                movements.map((movement) => {
                  const signedAmount = movement.movement_type === 'in'
                    ? formatCurrency(movement.amount)
                    : formatCurrency(-movement.amount);

                  return (
                    <TableRow key={movement.id} hover>
                      <TableCell>{formatDateTime(movement.created_at)}</TableCell>
                      <TableCell>{movementLabel(movement.movement_type)}</TableCell>
                      <TableCell
                        align="right"
                        sx={{ color: movement.movement_type === 'in' ? 'success.main' : 'error.main', fontWeight: 600 }}
                      >
                        {signedAmount}
                      </TableCell>
                      <TableCell>{movement.order_id ? `Venta ${movement.order_id}` : 'Manual'}</TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                    <Typography color="text.secondary">No hay movimientos registrados.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>

      <Dialog open={createDialogOpen} onClose={closeCreateDialog} fullWidth maxWidth="xs">
        <DialogTitle>Nueva transacción</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <FormControl fullWidth>
              <InputLabel id="movement-type-label">Tipo de movimiento</InputLabel>
              <Select
                labelId="movement-type-label"
                value={formData.movementType}
                label="Tipo de movimiento"
                onChange={(event) => handleFormChange('movementType', event.target.value)}
              >
                <MenuItem value="in">Ingreso</MenuItem>
                <MenuItem value="out">Egreso</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Monto"
              type="number"
              value={formData.amount}
              onChange={(event) => handleFormChange('amount', event.target.value)}
              inputProps={{ min: 0.01, step: 0.01 }}
              fullWidth
            />

            {formError && <Alert severity="error">{formError}</Alert>}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeCreateDialog} disabled={submitting}>Cancelar</Button>
          <Button variant="contained" onClick={handleCreateMovement} disabled={submitting}>
            Registrar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
