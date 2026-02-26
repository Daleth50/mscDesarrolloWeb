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
import { getErrorMessage } from '../utils/error';
import type { CartItem, PosProduct, UUID } from '../types/models';
import { usePosCart } from '../view_models/usePosCart';

export default function PosPage() {
  const {
    loading,
    error,
    contacts,
    products,
    cart,
    cartItems,
    selectedContactId,
    summary,
    handleSelectContact,
    addProductToCart,
    updateItemQuantity,
    removeItem,
  } = usePosCart();

  const [isProductModalOpen, setProductModalOpen] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [quantityDialogOpen, setQuantityDialogOpen] = useState(false);
  const [quantityDialogMode, setQuantityDialogMode] = useState<'add' | 'edit'>('add');
  const [selectedProduct, setSelectedProduct] = useState<PosProduct | null>(null);
  const [selectedItem, setSelectedItem] = useState<CartItem | null>(null);
  const [quantityInput, setQuantityInput] = useState('1');
  const [dialogError, setDialogError] = useState<string | null>(null);

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
        if (quantity > selectedProduct.stock_available) {
          setDialogError(`Stock insuficiente. Disponible: ${selectedProduct.stock_available}`);
          return;
        }
        await addProductToCart(selectedProduct.id as UUID, quantity);
        setQuantityDialogOpen(false);
        setProductModalOpen(false);
        return;
      }

      if (quantityDialogMode === 'edit' && selectedItem) {
        const stockAvailable = selectedItem.stock_available ?? 0;
        if (quantity > stockAvailable) {
          setDialogError(`Stock insuficiente. Disponible: ${stockAvailable}`);
          return;
        }
        await updateItemQuantity(selectedItem, quantity);
        setQuantityDialogOpen(false);
      }
    } catch (err) {
      setDialogError(getErrorMessage(err));
      console.error(err);
    }
  };

  const handleRemoveItem = async (item: CartItem) => {
    if (!window.confirm('¿Eliminar este producto del carrito?')) {
      return;
    }
    try {
      await removeItem(item);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
          <FormControl fullWidth>
            <InputLabel id="pos-contact-label">Cliente</InputLabel>
            <Select
              labelId="pos-contact-label"
              value={selectedContactId}
              label="Cliente"
              onChange={(event) => handleSelectContact(event.target.value as UUID | '')}
            >
              <MenuItem value="">Sin cliente</MenuItem>
              {contacts.map(contact => (
                <MenuItem key={contact.id} value={contact.id}>
                  {contact.name}
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
        </Stack>
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper elevation={1} sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Productos en carrito
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
                  <TableCell align="right">Precio</TableCell>
                  <TableCell align="right">Cantidad</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cartItems.length > 0 ? (
                  cartItems.map(item => (
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
                      <Typography color="text.secondary">Aún no hay productos en el carrito.</Typography>
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
            <Typography variant="caption" color="text.secondary">
              Estado pago carrito: {cart?.payment_status || 'pending'}
            </Typography>
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
                  <TableCell align="right">Precio</TableCell>
                  <TableCell align="right">Stock</TableCell>
                  <TableCell align="center">Agregar</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProducts.map(product => (
                  <TableRow key={product.id} hover>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.sku || '-'}</TableCell>
                    <TableCell align="right">${product.price.toFixed(2)}</TableCell>
                    <TableCell align="right">{product.stock_available}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        size="small"
                        disabled={product.stock_available <= 0}
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
