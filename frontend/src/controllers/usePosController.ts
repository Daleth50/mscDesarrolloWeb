import { useMemo, useRef, useState } from 'react';
import { usePosCart } from './usePosCartController';
import { getErrorMessage } from '../utils/error';
import { buildContactPayload, validateContactForm, type ContactFormData } from '../models/contact';
import { filterPosProducts, parsePositiveInteger } from '../models/pos';
import type { BillAccount, CartItem, PaymentMethod, PosProduct, UUID } from '../types/models';

const INITIAL_QUICK_CUSTOMER_FORM: ContactFormData = {
  name: '',
  email: '',
  phone: '',
  address: '',
};

export function usePosController() {
  const {
    loading,
    error,
    contacts,
    products,
    cart,
    cartItems,
    pendingCarts,
    selectedContactId,
    summary,
    loadPendingCart,
    handleSelectContact,
    addProductToCart,
    updateItemQuantity,
    removeItem,
    getBillAccountsByPaymentMethod,
    completeSale,
    createCustomer,
    resetCurrentSale,
  } = usePosCart();

  const [isProductModalOpen, setProductModalOpen] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [quantityDialogOpen, setQuantityDialogOpen] = useState(false);
  const [quantityDialogMode, setQuantityDialogMode] = useState<'add' | 'edit'>('add');
  const [selectedProduct, setSelectedProduct] = useState<PosProduct | null>(null);
  const [selectedItem, setSelectedItem] = useState<CartItem | null>(null);
  const [quantityInput, setQuantityInput] = useState('1');
  const [dialogError, setDialogError] = useState<string | null>(null);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [billAccounts, setBillAccounts] = useState<BillAccount[]>([]);
  const [selectedBillAccountId, setSelectedBillAccountId] = useState<UUID | ''>('');
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [billAccountsLoading, setBillAccountsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [quickCustomerDialogOpen, setQuickCustomerDialogOpen] = useState(false);
  const [quickCustomerForm, setQuickCustomerForm] = useState<ContactFormData>(INITIAL_QUICK_CUSTOMER_FORM);
  const [quickCustomerError, setQuickCustomerError] = useState<string | null>(null);
  const [quickCustomerLoading, setQuickCustomerLoading] = useState(false);
  const [pendingCartLoadingId, setPendingCartLoadingId] = useState<UUID | ''>('');
  const checkoutInFlightRef = useRef(false);

  const activeCartId = cart?.id || '';
  const editingStockAvailable = quantityDialogMode === 'edit'
    ? (selectedItem?.stock_available ?? null)
    : null;

  const getPaymentMethodLabel = (method: PaymentMethod) => (
    method === 'cash' ? 'efectivo' : 'transferencia'
  );

  const filteredProducts = useMemo(
    () => filterPosProducts(products, productSearch),
    [products, productSearch]
  );

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
      const quantity = parsePositiveInteger(quantityInput);

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

  const loadBillAccountsForMethod = async (method: PaymentMethod) => {
    try {
      setBillAccountsLoading(true);
      const accounts = await getBillAccountsByPaymentMethod(method);
      setBillAccounts(accounts);
      setSelectedBillAccountId((current) => {
        if (accounts.length === 0) {
          return '';
        }
        if (accounts.length === 1) {
          return accounts[0].id;
        }
        if (current && accounts.some((account) => account.id === current)) {
          return current;
        }
        return accounts[0].id;
      });
      return accounts;
    } finally {
      setBillAccountsLoading(false);
    }
  };

  const openCheckoutModal = async () => {
    if (!cart || cartItems.length === 0) {
      setCheckoutError('Agrega productos antes de completar la venta.');
      return;
    }

    if (!selectedContactId) {
      setCheckoutError('Selecciona un cliente antes de completar la venta.');
      return;
    }

    if ((summary.total || 0) <= 0) {
      setCheckoutError('El total de venta debe ser mayor a 0.');
      return;
    }

    try {
      setSuccessMessage(null);
      setBillAccounts([]);
      setSelectedBillAccountId('');
      setPaymentMethod('cash');
      const accounts = await loadBillAccountsForMethod('cash');
      if (accounts.length === 0) {
        setCheckoutError('No hay cuentas de banco disponibles para efectivo.');
      } else {
        setCheckoutError(null);
      }
      setCheckoutModalOpen(true);
    } catch (err) {
      setCheckoutError(getErrorMessage(err));
      console.error(err);
    }
  };

  const handleChangePaymentMethod = async (method: PaymentMethod) => {
    try {
      setPaymentMethod(method);
      setBillAccounts([]);
      setSelectedBillAccountId('');
      const accounts = await loadBillAccountsForMethod(method);
      if (accounts.length === 0) {
        setCheckoutError(`No hay cuentas de banco disponibles para ${getPaymentMethodLabel(method)}.`);
      } else {
        setCheckoutError(null);
      }
    } catch (err) {
      setCheckoutError(getErrorMessage(err));
      console.error(err);
    }
  };

  const handleConfirmCheckout = async () => {
    if (checkoutInFlightRef.current || checkoutLoading) {
      return;
    }

    if (billAccountsLoading) {
      setCheckoutError('Cargando cuentas de banco, espera un momento e intenta de nuevo.');
      return;
    }

    if (!selectedContactId) {
      setCheckoutError('Selecciona un cliente antes de completar la venta.');
      return;
    }

    if (billAccounts.length === 0) {
      setCheckoutError(`No hay cuentas de banco disponibles para ${getPaymentMethodLabel(paymentMethod)}.`);
      return;
    }

    if (!selectedBillAccountId) {
      setCheckoutError('Selecciona una cuenta de banco para registrar la transacción.');
      return;
    }

    try {
      checkoutInFlightRef.current = true;
      setCheckoutLoading(true);
      const completedSale = await completeSale(paymentMethod, selectedBillAccountId);
      setCheckoutModalOpen(false);
      const shortId = String(completedSale?.id || '').slice(0, 8);
      setSuccessMessage(
        shortId
          ? `Venta registrada correctamente (ID: ${shortId}).`
          : 'Venta registrada correctamente.'
      );
      resetCurrentSale();
      setCheckoutError(null);
    } catch (err) {
      setCheckoutError(getErrorMessage(err));
      console.error(err);
    } finally {
      setCheckoutLoading(false);
      checkoutInFlightRef.current = false;
    }
  };

  const openQuickCustomerDialog = () => {
    setQuickCustomerForm(INITIAL_QUICK_CUSTOMER_FORM);
    setQuickCustomerError(null);
    setQuickCustomerDialogOpen(true);
  };

  const closeQuickCustomerDialog = () => {
    if (quickCustomerLoading) {
      return;
    }
    setQuickCustomerDialogOpen(false);
    setQuickCustomerError(null);
  };

  const handleQuickCustomerFieldChange = (field: keyof ContactFormData, value: string) => {
    setQuickCustomerForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleCreateQuickCustomer = async () => {
    const validationError = validateContactForm(quickCustomerForm);
    if (validationError) {
      setQuickCustomerError(validationError);
      return;
    }

    try {
      setQuickCustomerLoading(true);
      setQuickCustomerError(null);

      const payload = buildContactPayload(quickCustomerForm, 'customer');
      await createCustomer(payload);

      setQuickCustomerDialogOpen(false);
      setSuccessMessage('Cliente creado y seleccionado en la venta actual.');
    } catch (err) {
      setQuickCustomerError(getErrorMessage(err));
      console.error(err);
    } finally {
      setQuickCustomerLoading(false);
    }
  };

  const handleLoadPendingCart = async (cartId: UUID) => {
    if (!cartId || cartId === activeCartId) {
      return;
    }

    try {
      setPendingCartLoadingId(cartId);
      setCheckoutError(null);
      setSuccessMessage(null);
      await loadPendingCart(cartId);
    } catch (err) {
      console.error(err);
    } finally {
      setPendingCartLoadingId('');
    }
  };

  const handleStartNewCart = () => {
    setCheckoutModalOpen(false);
    setCheckoutError(null);
    setSuccessMessage(null);
    setPendingCartLoadingId('');
    resetCurrentSale();
  };

  return {
    loading,
    error,
    contacts,
    products,
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
    hasSingleBillAccount: billAccounts.length === 1,
    hasMultipleBillAccounts: billAccounts.length > 1,
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
  };
}
