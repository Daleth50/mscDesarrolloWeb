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
  TableRow,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCategoriesList } from '../view_models/useCategoriesList';
import CategoryFormDialog from '../components/CategoryFormDialog';

export default function CategoriesPage() {
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

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h2" sx={{ fontWeight: 600 }}>
          Categorías
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreateModal}>
          Crear categoría
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.length > 0 ? (
              categories.map((category) => (
                <TableRow key={category.id} hover>
                  <TableCell>{category.name || category.label}</TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <IconButton
                        onClick={() => openEditModal(category)}
                        size="small"
                        color="warning"
                        title="Editar"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(category.id)}
                        size="small"
                        color="error"
                        title="Eliminar"
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

      <CategoryFormDialog
        open={isModalOpen}
        title={editingCategoryId ? 'Editar categoría' : 'Crear categoría'}
        confirmLabel={editingCategoryId ? 'Guardar cambios' : 'Crear categoría'}
        value={formData.name}
        saving={saving}
        onClose={closeModal}
        onChange={handleChange}
        onConfirm={handleSave}
      />
    </Container>
  );
}
