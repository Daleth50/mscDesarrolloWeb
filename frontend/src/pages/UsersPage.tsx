import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  Paper,
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
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';
import { useUsersList } from '../controllers/useUsersListController';
import { type ChangeEvent, useEffect, useState } from 'react';

export default function UsersPage() {
  const { users, loading, error } = useUsersList();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(users.length / rowsPerPage) - 1);
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [users.length, page, rowsPerPage]);

  const paginatedUsers = users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
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

  const getRoleLabel = (role: string) => {
    return role === 'admin' ? 'Administrador' : 'Vendedor';
  };

  const getStatusLabel = (isActive: boolean) => {
    return isActive ? 'Activo' : 'Inactivo';
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h2" sx={{ fontWeight: 600 }}>
          Usuarios
        </Typography>
        <Button 
          component={Link}
          to="/users/new"
          variant="contained" 
          startIcon={<AddIcon />}
        >
          Crear usuario
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Paper>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Usuario</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length > 0 ? (
                paginatedUsers.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>{`${user.first_name} ${user.last_name}`}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{getRoleLabel(user.role)}</TableCell>
                    <TableCell>{getStatusLabel(user.is_active)}</TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <IconButton
                          component={Link}
                          to={`/users/${user.id}/edit`}
                          size="small"
                          color="warning"
                          title="Editar"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <Typography color="textSecondary">No hay usuarios aún.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={users.length}
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
