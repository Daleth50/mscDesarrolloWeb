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
import { formatCurrency } from '../utils/number';

export default function PosPage() {
  const {
    loading,
    error,
    contacts,
    filteredProducts,
    cart,
    cartItems,
    pendingCarts,
    selectedContactId,
    summary,
    activeCartId,

    isProductModalOpen,
    setProductModalOpen,
    productSearch,
    setProductSearch,
    quantityDialogOpen,
    quantityDialogMode,
    editingStockAvailable,
    quantityInput,
    setQuantityInput,
    dialogError,
    checkoutModalOpen,
    setCheckoutModalOpen,
    paymentMethod,
    billAccounts,
    hasSingleBillAccount,
    hasMultipleBillAccounts,
    selectedBillAccountId,
    setSelectedBillAccountId,
    checkoutError,
    checkoutLoading,
    billAccountsLoading,
    successMessage,
    quickCustomerDialogOpen,
    quickCustomerForm,
    quickCustomerError,
    quickCustomerLoading,
    pendingCartLoadingId,

    handleSelectContact,
    openAddQuantityDialog,
    openEditQuantityDialog,
    closeQuantityDialog,
    handleConfirmQuantity,
    handleRemoveItem,
    openCheckoutModal,
    handleChangePaymentMethod,
    handleConfirmCheckout,
    openQuickCustomerDialog,
    closeQuickCustomerDialog,
    handleQuickCustomerFieldChange,
    handleCreateQuickCustomer,
    handleLoadPendingCart,
    handleStartNewCart,
  } = usePosController();

  const getContactNameById = (contactId?: UUID | null) => (
    contacts.find((contact) => contact.id === contactId)?.name || 'Sin cliente'
  );

  return (
    <Container
      maxWidth="xl"
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        py: 4,
      }}
    >
      <Paper elevation={2} sx={{ p: 3, mb: 2, flexShrink: 0 }}>
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

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={openQuickCustomerDialog}
              sx={{ minWidth: 220 }}
            >
              Alta rápida cliente
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
        {checkoutError && <Alert severity="error" sx={{ mb: 2 }}>{checkoutError}</Alert>}
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
            Carritos pendientes
          </Typography>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleStartNewCart}
            sx={{ mb: 1.5 }}
          >
            Nuevo carrito
          </Button>

          <Stack spacing={1} sx={{ flex: 1, minHeight: 0, overflowY: 'auto', overscrollBehavior: 'contain', pr: 0.5 }}>
            {pendingCarts.length > 0 ? (
              pendingCarts.map((pendingCart) => {
                const isActive = activeCartId === pendingCart.id;
                const isLoadingItem = pendingCartLoadingId === pendingCart.id;

                return (
                  <Button
                    key={pendingCart.id}
                    variant={isActive ? 'contained' : 'outlined'}
                    color={isActive ? 'primary' : 'inherit'}
                    onClick={() => handleLoadPendingCart(pendingCart.id)}
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
                        Carrito {pendingCart.id.slice(0, 8)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Cliente: {getContactNameById(pendingCart.contact_id)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Total: {formatCurrency(pendingCart.total || 0)}
                      </Typography>
                      {isLoadingItem && <Typography variant="caption">Cargando carrito...</Typography>}
                    </Stack>
                  </Button>
                );
              })
            ) : (
              <Typography variant="body2" color="text.secondary">
                No hay carritos pendientes.
              </Typography>
            )}
          </Stack>
        </Paper>

        <Paper
          elevation={1}
          sx={{ p: 2, display: 'flex', flexDirection: 'column', minHeight: 0, height: '100%', overflow: 'hidden' }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Productos en carrito
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
                        <TableCell align="right">{formatCurrency(item.price)}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">{formatCurrency(item.total)}</TableCell>
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
        </Paper>

        <Paper elevation={1} sx={{ p: 2, display: 'flex', flexDirection: 'column', minHeight: 0, height: '100%' }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Resumen
          </Typography>

          <Stack spacing={1} sx={{ height: '100%' }}>
            <Typography variant="body2">Subtotal: {formatCurrency(summary.subtotal)}</Typography>
            <Typography variant="body2">Impuestos: {formatCurrency(summary.tax)}</Typography>
            <Typography variant="body2">Descuento: {formatCurrency(summary.discount)}</Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Total: {formatCurrency(summary.total)}</Typography>
            <Typography variant="caption" color="text.secondary">
              Estado pago carrito: {cart?.payment_status || 'pending'}
            </Typography>

            <Button
              variant="contained"
              color="success"
              startIcon={<CheckCircleIcon />}
              onClick={openCheckoutModal}
              disabled={cartItems.length === 0 || summary.total <= 0 || !selectedContactId}
              fullWidth
              sx={{ mt: 'auto' }}
            >
              Completar venta
            </Button>

            {!selectedContactId && (
              <Typography variant="caption" color="error.main">
                Debes seleccionar un cliente para completar la venta.
              </Typography>
            )}
          </Stack>
        </Paper>
      </Box>

      <Dialog open={quickCustomerDialogOpen} onClose={closeQuickCustomerDialog} fullWidth maxWidth="sm">
        <DialogTitle>Alta rápida de cliente</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              autoFocus
              fullWidth
              label="Nombre"
              required
              value={quickCustomerForm.name}
              onChange={(event) => handleQuickCustomerFieldChange('name', event.target.value)}
            />

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={quickCustomerForm.email}
              onChange={(event) => handleQuickCustomerFieldChange('email', event.target.value)}
            />

            <TextField
              fullWidth
              label="Teléfono"
              value={quickCustomerForm.phone}
              onChange={(event) => handleQuickCustomerFieldChange('phone', event.target.value)}
            />

            <TextField
              fullWidth
              label="Dirección"
              multiline
              minRows={2}
              value={quickCustomerForm.address}
              onChange={(event) => handleQuickCustomerFieldChange('address', event.target.value)}
            />

            {quickCustomerError && <Alert severity="error">{quickCustomerError}</Alert>}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeQuickCustomerDialog} disabled={quickCustomerLoading}>Cancelar</Button>
          <Button variant="contained" onClick={handleCreateQuickCustomer} disabled={quickCustomerLoading}>
            {quickCustomerLoading ? <CircularProgress size={20} /> : 'Guardar y seleccionar'}
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
                    <TableCell align="right">{formatCurrency(product.price)}</TableCell>
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
          {quantityDialogMode === 'edit' && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Stock disponible: {editingStockAvailable ?? '-'}
            </Typography>
          )}
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
                disabled={checkoutLoading || billAccountsLoading}
              >
                <MenuItem value="cash">Efectivo</MenuItem>
                <MenuItem value="transfer">Transferencia</MenuItem>
              </Select>
            </FormControl>

            {billAccountsLoading && (
              <Alert severity="info">Cargando cuentas de banco...</Alert>
            )}

            {hasMultipleBillAccounts && (
              <FormControl fullWidth>
                <InputLabel id="bill-account-label">Cuenta de banco</InputLabel>
                <Select
                  labelId="bill-account-label"
                  value={selectedBillAccountId}
                  label="Cuenta de banco"
                  onChange={(event) => setSelectedBillAccountId(event.target.value as UUID | '')}
                  disabled={checkoutLoading || billAccountsLoading}
                >
                  {billAccounts.map((account) => (
                    <MenuItem key={account.id} value={account.id}>
                      {account.name} ({account.type})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {hasSingleBillAccount && billAccounts[0] && (
              <Alert severity="info">
                Se usará automáticamente la cuenta: {billAccounts[0].name} ({billAccounts[0].type})
              </Alert>
            )}

            {billAccounts.length === 0 && (
              <Alert severity="warning">
                No hay cuentas de banco disponibles para este método de pago.
              </Alert>
            )}

            <Typography variant="body2" color="text.secondary">
              Total de venta: {formatCurrency(summary.total)}
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCheckoutModalOpen(false)} disabled={checkoutLoading}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleConfirmCheckout}
            disabled={
              checkoutLoading
              || billAccountsLoading
              || !selectedContactId
              || billAccounts.length === 0
              || !selectedBillAccountId
            }
          >
            {checkoutLoading ? <CircularProgress size={20} /> : 'Confirmar venta'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
