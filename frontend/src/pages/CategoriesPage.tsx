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
import DeleteIcon from '@mui/icons-material/Delete';
import { useCategoriesList } from '../controllers/useCategoriesListController';
import CategoryFormDialog from '../components/CategoryFormDialog';
import { useAuth } from '../context/AuthContext';
import { type ChangeEvent, useEffect, useState } from 'react';

export default function CategoriesPage() {
  const { isAdmin } = useAuth();
  const {
    categories,
    loading,
    saving,
    error,
    isModalOpen,
    editingCategoryId,
    formData,
    openCreateModal,
    openEditModal,
    closeModal,
    handleChange,
    handleSave,
    handleDelete,
  } = useCategoriesList();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(categories.length / rowsPerPage) - 1);
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [categories.length, page, rowsPerPage]);

  const paginatedCategories = categories.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h2" sx={{ fontWeight: 600 }}>
          Categorías
        </Typography>
        {isAdmin && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreateModal}>
            Crear categoría
          </Button>
        )}
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.length > 0 ? (
                paginatedCategories.map((category) => (
                  <TableRow key={category.id} hover>
                    <TableCell>{category.name || category.label}</TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <IconButton
                          onClick={() => openEditModal(category)}
                          size="small"
                          color="warning"
                          title="Editar"
                          disabled={!isAdmin}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(category.id)}
                          size="small"
                          color="error"
                          title="Eliminar"
                          disabled={!isAdmin}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} align="center" sx={{ py: 3 }}>
                    <Typography color="textSecondary">No hay categorías aún.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={categories.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="Filas por página"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
      </Paper>

      <CategoryFormDialog
        open={isModalOpen}
        title={editingCategoryId ? 'Editar categoría' : 'Crear categoría'}
        confirmLabel={editingCategoryId ? 'Guardar cambios' : 'Crear categoría'}
        formData={formData}
        saving={saving}
        onClose={closeModal}
        onChange={handleChange}
        onConfirm={handleSave}
      />
    </Container>
  );
}
