import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';
import { useBillAccountsList } from '../controllers/useBillAccountsListController';
import { formatCurrency } from '../utils/number';

export default function BillAccountsPage() {
  const { billAccounts, loading, error } = useBillAccountsList();

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
          Cuentas de banco
        </Typography>
        <Button
          component={Link}
          to="/bill-accounts/new"
          variant="contained"
          startIcon={<AddIcon />}
        >
          Crear cuenta
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell align="right">Balance</TableCell>
              <TableCell align="center">Acciones</TableCell>
              <TableCell>Detalle</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {billAccounts.length > 0 ? (
              billAccounts.map((account) => (
                <TableRow key={account.id} hover>
                  <TableCell>{account.name}</TableCell>
                  <TableCell>{account.type}</TableCell>
                  <TableCell align="right">{formatCurrency(account.balance || 0)}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      component={Link}
                      to={`/bill-accounts/${account.id}/edit`}
                      size="small"
                      color="warning"
                      title="Editar"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <Button
                      component={Link}
                      to={`/bill-accounts/${account.id}/movements`}
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
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  <Typography color="textSecondary">No hay cuentas de banco aún.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
