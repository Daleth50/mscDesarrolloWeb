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
import { buildContactPayload, validateContactForm, type ContactFormData } from '../models/contact';
import { getErrorMessage } from '../utils/error';
import type { CartItem, PosProduct, UUID } from '../types/models';
import { usePurchaseCart } from '../controllers/usePurchaseCartController';

const INITIAL_QUICK_SUPPLIER_FORM: ContactFormData = {
  name: '',
  email: '',
  phone: '',
  address: '',
};

export default function PurchasesPage() {
  const {
    loading,
    error,
    suppliers,
    products,
    cart,
    cartItems,
    pendingPurchaseCarts,
    selectedSupplierId,
    summary,
    loadPendingCart,
    handleSelectSupplier,
    addProductToCart,
    updateItemQuantity,
    removeItem,
    completePurchase,
    createSupplier,
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
  const [pendingCartLoadingId, setPendingCartLoadingId] = useState<UUID | ''>('');
  const [quickSupplierDialogOpen, setQuickSupplierDialogOpen] = useState(false);
  const [quickSupplierForm, setQuickSupplierForm] = useState<ContactFormData>(INITIAL_QUICK_SUPPLIER_FORM);
  const [quickSupplierError, setQuickSupplierError] = useState<string | null>(null);
  const [quickSupplierLoading, setQuickSupplierLoading] = useState(false);

  const activeCartId = cart?.id || '';

  const getSupplierNameById = (supplierId?: UUID | null) => (
    suppliers.find((supplier) => supplier.id === supplierId)?.name || 'Sin proveedor'
  );

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
    if ((summary.total || 0) <= 0) {
      setDialogError('El total de compra debe ser mayor a 0.');
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

  const handleLoadPendingPurchaseCart = async (cartId: UUID) => {
    if (!cartId || cartId === activeCartId) {
      return;
    }

    try {
      setPendingCartLoadingId(cartId);
      setDialogError(null);
      setSuccessMessage(null);
      await loadPendingCart(cartId);
    } catch (err) {
      console.error(err);
    } finally {
      setPendingCartLoadingId('');
    }
  };

  const handleStartNewPurchaseCart = () => {
    setProductModalOpen(false);
    setQuantityDialogOpen(false);
    setDialogError(null);
    setSuccessMessage(null);
    setPendingCartLoadingId('');
    resetCurrentPurchase();
  };

  const openQuickSupplierDialog = () => {
    setQuickSupplierForm(INITIAL_QUICK_SUPPLIER_FORM);
    setQuickSupplierError(null);
    setQuickSupplierDialogOpen(true);
  };

  const closeQuickSupplierDialog = () => {
    if (quickSupplierLoading) {
      return;
    }
    setQuickSupplierDialogOpen(false);
    setQuickSupplierError(null);
  };

  const handleQuickSupplierFieldChange = (field: keyof ContactFormData, value: string) => {
    setQuickSupplierForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleCreateQuickSupplier = async () => {
    const validationError = validateContactForm(quickSupplierForm);
    if (validationError) {
      setQuickSupplierError(validationError);
      return;
    }

    try {
      setQuickSupplierLoading(true);
      setQuickSupplierError(null);

      const payload = buildContactPayload(quickSupplierForm, 'supplier');
      await createSupplier(payload);

      setQuickSupplierDialogOpen(false);
      setDialogError(null);
      setSuccessMessage('Proveedor creado y seleccionado en la compra actual.');
    } catch (err) {
      setQuickSupplierError(getErrorMessage(err));
      console.error(err);
    } finally {
      setQuickSupplierLoading(false);
    }
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        py: 0,
      }}
    >
      <Paper elevation={2} sx={{ p: 3, mb: 2, flexShrink: 0 }}>
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

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={openQuickSupplierDialog}
              sx={{ minWidth: 220 }}
            >
              Alta rápida proveedor
            </Button>

            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={() => setProductModalOpen(true)}
              sx={{ minWidth: 220 }}
            >
              Buscar productos
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <Box sx={{ flexShrink: 0 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {dialogError && <Alert severity="error" sx={{ mb: 2 }}>{dialogError}</Alert>}
        {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
      </Box>

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: 'grid',
          gap: 2,
          alignItems: 'stretch',
          gridTemplateColumns: { xs: '1fr', lg: '280px minmax(0, 1fr) 320px' },
        }}
      >
        <Paper
          elevation={1}
          sx={{ p: 2, display: 'flex', flexDirection: 'column', minHeight: 0, height: '100%', overflow: 'hidden' }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Carritos de compra
          </Typography>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleStartNewPurchaseCart}
            sx={{ mb: 1.5 }}
          >
            Nuevo carrito
          </Button>

          <Stack spacing={1} sx={{ flex: 1, minHeight: 0, overflowY: 'auto', overscrollBehavior: 'contain', pr: 0.5 }}>
            {pendingPurchaseCarts.length > 0 ? (
              pendingPurchaseCarts.map((pendingCart) => {
                const isActive = activeCartId === pendingCart.id;
                const isLoadingItem = pendingCartLoadingId === pendingCart.id;

                return (
                  <Button
                    key={pendingCart.id}
                    variant={isActive ? 'contained' : 'outlined'}
                    color={isActive ? 'primary' : 'inherit'}
                    onClick={() => handleLoadPendingPurchaseCart(pendingCart.id)}
                    disabled={isLoadingItem}
                    sx={{
                      justifyContent: 'flex-start',
                      textTransform: 'none',
                      px: 1.5,
                      py: 1,
                    }}
                  >
                    <Stack spacing={0.25} alignItems="flex-start">
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Compra {pendingCart.id.slice(0, 8)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Proveedor: {getSupplierNameById(pendingCart.contact_id)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Total: ${(pendingCart.total || 0).toFixed(2)}
                      </Typography>
                      {isLoadingItem && <Typography variant="caption">Cargando carrito...</Typography>}
                    </Stack>
                  </Button>
                );
              })
            ) : (
              <Typography variant="body2" color="text.secondary">
                No hay carritos de compra pendientes.
              </Typography>
            )}
          </Stack>
        </Paper>

        <Paper
          elevation={1}
          sx={{ p: 2, display: 'flex', flexDirection: 'column', minHeight: 0, height: '100%', overflow: 'hidden' }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Productos de la compra
          </Typography>

          {loading && cartItems.length === 0 ? (
            <Box display="flex" justifyContent="center" alignItems="center" sx={{ flex: 1, minHeight: 140 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer
              sx={{
                flex: 1,
                minHeight: 0,
                overflowY: 'auto',
                overflowX: 'auto',
                overscrollBehavior: 'contain',
              }}
            >
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
        </Paper>

        <Paper elevation={1} sx={{ p: 2, display: 'flex', flexDirection: 'column', minHeight: 0, height: '100%' }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Resumen
          </Typography>

          <Stack spacing={1} sx={{ height: '100%' }}>
            <Typography variant="body2">Subtotal: ${summary.subtotal.toFixed(2)}</Typography>
            <Typography variant="body2">Impuestos: ${summary.tax.toFixed(2)}</Typography>
            <Typography variant="body2">Descuento: ${summary.discount.toFixed(2)}</Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Total: ${summary.total.toFixed(2)}</Typography>

            <Button
              variant="contained"
              color="success"
              startIcon={<CheckCircleIcon />}
              onClick={handleCompletePurchase}
              disabled={cartItems.length === 0 || !selectedSupplierId || summary.total <= 0}
              fullWidth
              sx={{ mt: 'auto' }}
            >
              Registrar compra
            </Button>

            {!selectedSupplierId && (
              <Typography variant="caption" color="error.main">
                Debes seleccionar un proveedor para completar la compra.
              </Typography>
            )}
          </Stack>
        </Paper>
      </Box>

      <Dialog open={quickSupplierDialogOpen} onClose={closeQuickSupplierDialog} fullWidth maxWidth="sm">
        <DialogTitle>Alta rápida de proveedor</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              autoFocus
              fullWidth
              label="Nombre"
              required
              value={quickSupplierForm.name}
              onChange={(event) => handleQuickSupplierFieldChange('name', event.target.value)}
            />

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={quickSupplierForm.email}
              onChange={(event) => handleQuickSupplierFieldChange('email', event.target.value)}
            />

            <TextField
              fullWidth
              label="Teléfono"
              value={quickSupplierForm.phone}
              onChange={(event) => handleQuickSupplierFieldChange('phone', event.target.value)}
            />

            <TextField
              fullWidth
              label="Dirección"
              multiline
              minRows={2}
              value={quickSupplierForm.address}
              onChange={(event) => handleQuickSupplierFieldChange('address', event.target.value)}
            />

            {quickSupplierError && <Alert severity="error">{quickSupplierError}</Alert>}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeQuickSupplierDialog} disabled={quickSupplierLoading}>Cancelar</Button>
          <Button variant="contained" onClick={handleCreateQuickSupplier} disabled={quickSupplierLoading}>
            {quickSupplierLoading ? <CircularProgress size={20} /> : 'Guardar y seleccionar'}
          </Button>
        </DialogActions>
      </Dialog>

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
