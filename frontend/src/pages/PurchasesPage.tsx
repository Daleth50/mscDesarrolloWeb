import React, { useMemo, useState } from 'react';
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
  IconButton,
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
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { getErrorMessage } from '../utils/error';
import type { CartItem, PosProduct, UUID } from '../types/models';
import { usePurchaseCart } from '../view_models/usePurchaseCart';

export default function PurchasesPage() {
  const {
    loading,
    error,
    suppliers,
    products,
    cart,
    cartItems,
    selectedSupplierId,
    summary,
    handleSelectSupplier,
    addProductToCart,
    updateItemQuantity,
    removeItem,
    completePurchase,
    resetCurrentPurchase,
  } = usePurchaseCart();

  const [isProductModalOpen, setProductModalOpen] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [quantityDialogOpen, setQuantityDialogOpen] = useState(false);
  const [quantityDialogMode, setQuantityDialogMode] = useState<'add' | 'edit'>('add');
  const [selectedProduct, setSelectedProduct] = useState<PosProduct | null>(null);
  const [selectedItem, setSelectedItem] = useState<CartItem | null>(null);
  const [quantityInput, setQuantityInput] = useState('1');
  const [dialogError, setDialogError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    const term = productSearch.trim().toLowerCase();
    if (!term) {
      return products;
    }
    return products.filter(product => {
      const name = product.name.toLowerCase();
      const sku = (product.sku || '').toLowerCase();
      return name.includes(term) || sku.includes(term);
    });
  }, [products, productSearch]);

  const parseQuantity = (value: string): number => {
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed <= 0) {
      throw new Error('La cantidad debe ser un entero mayor a 0.');
    }
    return parsed;
  };

  const openAddQuantityDialog = (product: PosProduct) => {
    setQuantityDialogMode('add');
    setSelectedProduct(product);
    setSelectedItem(null);
    setQuantityInput('1');
    setDialogError(null);
    setQuantityDialogOpen(true);
  };

  const openEditQuantityDialog = (item: CartItem) => {
    setQuantityDialogMode('edit');
    setSelectedItem(item);
    setSelectedProduct(null);
    setQuantityInput(String(item.quantity));
    setDialogError(null);
    setQuantityDialogOpen(true);
  };

  const closeQuantityDialog = () => {
    setQuantityDialogOpen(false);
    setDialogError(null);
  };

  const handleConfirmQuantity = async () => {
    try {
      const quantity = parseQuantity(quantityInput);

      if (quantityDialogMode === 'add' && selectedProduct) {
        await addProductToCart(selectedProduct.id as UUID, quantity);
        setQuantityDialogOpen(false);
        setProductModalOpen(false);
        return;
      }

      if (quantityDialogMode === 'edit' && selectedItem) {
        await updateItemQuantity(selectedItem, quantity);
        setQuantityDialogOpen(false);
      }
    } catch (err) {
      setDialogError(getErrorMessage(err));
      console.error(err);
    }
  };

  const handleRemoveItem = async (item: CartItem) => {
    if (!window.confirm('¿Eliminar este producto de la compra?')) {
      return;
    }
    try {
      await removeItem(item);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCompletePurchase = async () => {
    if (!selectedSupplierId) {
      setDialogError('Debes seleccionar un proveedor.');
      return;
    }
    if (cartItems.length === 0) {
      setDialogError('Agrega al menos un producto.');
      return;
    }

    if (!window.confirm('¿Confirmar compra y actualizar inventario?')) {
      return;
    }

    try {
      await completePurchase();
      setSuccessMessage('Compra registrada y stock actualizado correctamente.');
      resetCurrentPurchase();
      setDialogError(null);
    } catch (err) {
      setDialogError(getErrorMessage(err));
      console.error(err);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
          <FormControl fullWidth>
            <InputLabel id="purchase-supplier-label">Proveedor</InputLabel>
            <Select
              labelId="purchase-supplier-label"
              value={selectedSupplierId}
              label="Proveedor"
              onChange={(event) => handleSelectSupplier(event.target.value as UUID | '')}
            >
              <MenuItem value="">Seleccionar proveedor</MenuItem>
              {suppliers.map((supplier) => (
                <MenuItem key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={() => setProductModalOpen(true)}
            sx={{ minWidth: 220 }}
          >
            Buscar productos
          </Button>

          <Button
            variant="contained"
            color="success"
            startIcon={<CheckCircleIcon />}
            onClick={handleCompletePurchase}
            sx={{ minWidth: 260 }}
          >
            Registrar compra
          </Button>
        </Stack>
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {dialogError && <Alert severity="error" sx={{ mb: 2 }}>{dialogError}</Alert>}
      {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

      <Paper elevation={1} sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Productos de la compra
        </Typography>

        {loading && cartItems.length === 0 ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={140}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Producto</TableCell>
                  <TableCell align="right">Costo</TableCell>
                  <TableCell align="right">Cantidad</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell>{item.product_name || item.product_id}</TableCell>
                      <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">${item.total.toFixed(2)}</TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <IconButton color="warning" size="small" onClick={() => openEditQuantityDialog(item)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton color="error" size="small" onClick={() => handleRemoveItem(item)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">Aún no hay productos en la compra.</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Stack spacing={0.5} sx={{ minWidth: 260 }}>
            <Typography variant="body2">Subtotal: ${summary.subtotal.toFixed(2)}</Typography>
            <Typography variant="body2">Impuestos: ${summary.tax.toFixed(2)}</Typography>
            <Typography variant="body2">Descuento: ${summary.discount.toFixed(2)}</Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Total: ${summary.total.toFixed(2)}</Typography>
          </Stack>
        </Box>
      </Paper>

      <Dialog open={isProductModalOpen} onClose={() => setProductModalOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Buscar productos</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            autoFocus
            margin="dense"
            label="Buscar por nombre o SKU"
            value={productSearch}
            onChange={(event) => setProductSearch(event.target.value)}
          />

          <TableContainer sx={{ mt: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Producto</TableCell>
                  <TableCell>SKU</TableCell>
                  <TableCell align="right">Costo</TableCell>
                  <TableCell align="right">Stock actual</TableCell>
                  <TableCell align="center">Agregar</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id} hover>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.sku || '-'}</TableCell>
                    <TableCell align="right">${product.price.toFixed(2)}</TableCell>
                    <TableCell align="right">{product.stock_available}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => openAddQuantityDialog(product)}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredProducts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                      <Typography color="text.secondary">No se encontraron productos.</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProductModalOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={quantityDialogOpen} onClose={closeQuantityDialog} fullWidth maxWidth="xs">
        <DialogTitle>
          {quantityDialogMode === 'add' ? 'Cantidad a agregar' : 'Editar cantidad'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Cantidad"
            type="number"
            inputProps={{ min: 1, step: 1 }}
            value={quantityInput}
            onChange={(event) => setQuantityInput(event.target.value)}
          />
          {dialogError && <Alert severity="error" sx={{ mt: 2 }}>{dialogError}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeQuantityDialog}>Cancelar</Button>
          <Button variant="contained" onClick={handleConfirmQuantity}>Confirmar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
