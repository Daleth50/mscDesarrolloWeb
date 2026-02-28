import React from 'react';
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
import type { PaymentMethod, UUID } from '../types/models';
import { usePosController } from '../controllers/usePosController';

export default function PosPage() {
  const {
    loading,
    error,
    contacts,
    filteredProducts,
    cart,
    cartItems,
    selectedContactId,
    summary,

    isProductModalOpen,
    setProductModalOpen,
    productSearch,
    setProductSearch,
    quantityDialogOpen,
    quantityDialogMode,
    quantityInput,
    setQuantityInput,
    dialogError,
    checkoutModalOpen,
    setCheckoutModalOpen,
    paymentMethod,
    billAccounts,
    selectedBillAccountId,
    setSelectedBillAccountId,
    checkoutError,
    checkoutLoading,
    successMessage,

    handleSelectContact,
    openAddQuantityDialog,
    openEditQuantityDialog,
    closeQuantityDialog,
    handleConfirmQuantity,
    handleRemoveItem,
    openCheckoutModal,
    handleChangePaymentMethod,
    handleConfirmCheckout,
  } = usePosController();

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
      {checkoutError && <Alert severity="error" sx={{ mb: 2 }}>{checkoutError}</Alert>}
      {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

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
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckCircleIcon />}
              onClick={openCheckoutModal}
              disabled={cartItems.length === 0 || summary.total <= 0}
              sx={{ mt: 1 }}
            >
              Completar venta
            </Button>
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

      <Dialog open={checkoutModalOpen} onClose={() => setCheckoutModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Completar venta</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel id="payment-method-label">Método de pago</InputLabel>
              <Select
                labelId="payment-method-label"
                value={paymentMethod}
                label="Método de pago"
                onChange={(event) => handleChangePaymentMethod(event.target.value as PaymentMethod)}
              >
                <MenuItem value="cash">Efectivo</MenuItem>
                <MenuItem value="transfer">Transferencia</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="bill-account-label">Cuenta de banco</InputLabel>
              <Select
                labelId="bill-account-label"
                value={selectedBillAccountId}
                label="Cuenta de banco"
                onChange={(event) => setSelectedBillAccountId(event.target.value as UUID | '')}
              >
                {billAccounts.map((account) => (
                  <MenuItem key={account.id} value={account.id}>
                    {account.name} ({account.type})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography variant="body2" color="text.secondary">
              Total de venta: ${summary.total.toFixed(2)}
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCheckoutModalOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleConfirmCheckout} disabled={checkoutLoading}>
            {checkoutLoading ? <CircularProgress size={20} /> : 'Confirmar venta'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
