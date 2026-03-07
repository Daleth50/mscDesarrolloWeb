import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { useProductForm } from '../controllers/useProductFormController';
import CategoryFormDialog from '../components/CategoryFormDialog';

export default function ProductFormPage() {
  const navigate = useNavigate();
  const {
    categories,
    loading,
    error,
    formData,
    isEdit,
    categoryModalOpen,
    categoryFormData,
    savingCategory,
    handleChange,
    handleSubmit,
    openCategoryModal,
    closeCategoryModal,
    handleCategoryFormChange,
    handleCreateCategory,
  } = useProductForm();

  if (loading) {
    return (
      <Container maxWidth="sm">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h4" component="h2" sx={{ mb: 3, fontWeight: 600 }}>
          {isEdit ? 'Editar producto' : 'Crear producto'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            label="Nombre del producto"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            fullWidth
            variant="outlined"
          />
          <TextField
            label="SKU"
            id="sku"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            label="Precio"
            id="price"
            name="price"
            type="number"
            inputProps={{ step: '0.01', min: '0' }}
            value={formData.price}
            onChange={handleChange}
            required
            fullWidth
            variant="outlined"
          />
          <TextField
            label="Costo"
            id="cost"
            name="cost"
            type="number"
            inputProps={{ step: '0.01', min: '0' }}
            value={formData.cost}
            onChange={handleChange}
            required
            fullWidth
            variant="outlined"
          />
          <Box display="flex" gap={2} flexDirection={'row'}>
            <FormControl fullWidth>
              <InputLabel id="category_id-label">Categoría</InputLabel>
              <Select
                labelId="category_id-label"
                id="category_id"
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                label="Categoría"
              >
                <MenuItem value="">Sin categoría</MenuItem>
                {categories.map(cat => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <IconButton onClick={openCategoryModal} title="Crear categoría">
              <AddIcon />
            </IconButton>
          </Box>
          <FormControl fullWidth>
            <InputLabel id="tax_rate-label">Tasa de impuesto</InputLabel>
            <Select
              labelId="tax_rate-label"
              id="tax_rate"
              name="tax_rate"
              value={String(formData.tax_rate)}
              onChange={handleChange}
              label="Tasa de impuesto"
              required
            >
              <MenuItem value="0">0%</MenuItem>
              <MenuItem value="8">8%</MenuItem>
              <MenuItem value="16">16%</MenuItem>
            </Select>
          </FormControl>
          <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end', pt: 2 }}>
            <Button
              type="button"
              variant="outlined"
              onClick={() => navigate(-1)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              {isEdit ? 'Guardar cambios' : 'Crear producto'}
            </Button>
          </Stack>
        </Box>

        <CategoryFormDialog
          open={categoryModalOpen}
          title="Crear categoría"
          confirmLabel="Crear categoría"
          formData={categoryFormData}
          saving={savingCategory}
          onClose={closeCategoryModal}
          onChange={handleCategoryFormChange}
          onConfirm={handleCreateCategory}
        />
      </Paper>
    </Container>
  );
}
