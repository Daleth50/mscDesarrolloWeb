import { useEffect, useMemo, useState } from 'react';
import { contactService } from '../services/contactService';
import { orderService } from '../services/orderService';
import { posService } from '../services/posService';
import { getErrorMessage } from '../utils/error';
import type { BillAccount, CartItem, Contact, Order, PaymentMethod, PosProduct, UUID } from '../types/models';

const DEFAULT_PAYMENT_STATUS = 'pending';

type CreateCustomerPayload = {
  name: string;
  email: string;
  phone: string;
  address: string;
  kind: 'customer' | 'supplier';
};

export function usePosCart() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [products, setProducts] = useState<PosProduct[]>([]);
  const [cart, setCart] = useState<Order | null>(null);
  const [selectedContactId, setSelectedContactId] = useState<UUID | ''>('');
  const [pendingCarts, setPendingCarts] = useState<Order[]>([]);

  const cartItems = cart?.items || [];

  const summary = useMemo(() => {
    const subtotal = cart?.subtotal || 0;
    const tax = cart?.tax || 0;
    const discount = cart?.discount || 0;
    const total = cart?.total || 0;
    return { subtotal, tax, discount, total };
  }, [cart]);

  useEffect(() => {
    loadInitialData();
  }, []);

  const extractPendingPosCarts = (orders: Order[]) => (
    orders.filter((order) => order.type === 'cart' && order.status === 'pending')
  );

  const refreshPendingCartsSilently = async () => {
    try {
      const orders = await orderService.getAll();
      setPendingCarts(extractPendingPosCarts(orders));
    } catch (err) {
      console.error(err);
    }
  };

  const refreshProductsSilently = async () => {
    try {
      const posProducts = await posService.getProducts();
      setProducts(posProducts);
    } catch (err) {
      console.error(err);
    }
  };

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [contactsData, posProducts, orders] = await Promise.all([
        contactService.getAll('customer'),
        posService.getProducts(),
        orderService.getAll(),
      ]);
      setContacts(contactsData);
      setProducts(posProducts);
      setPendingCarts(extractPendingPosCarts(orders));
    } catch (err) {
      setError(getErrorMessage(err));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const ensureCart = async () => {
    if (cart?.id) {
      return cart.id;
    }

    const created = await posService.createCart({
      contact_id: selectedContactId || null,
      payment_status: DEFAULT_PAYMENT_STATUS,
    });
    setCart(created);
    refreshPendingCartsSilently();
    return created.id;
  };

  const loadPendingCart = async (cartId: UUID) => {
    try {
      setLoading(true);
      const loadedCart = await posService.getCart(cartId);
      setCart(loadedCart);
      setSelectedContactId(loadedCart.contact_id || '');
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err));
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleSelectContact = async (contactId: UUID | '') => {
    setSelectedContactId(contactId);

    if (!cart?.id) {
      return;
    }

    try {
      setLoading(true);
      const updated = await posService.updateCart(cart.id, {
        contact_id: contactId || null,
      });
      setCart(updated);
      refreshPendingCartsSilently();
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addProductToCart = async (productId: UUID, quantity: number) => {
    try {
      setLoading(true);
      const cartId = await ensureCart();
      const updated = await posService.addItem(cartId, { product_id: productId, quantity });
      setCart(updated);
      refreshPendingCartsSilently();
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err));
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateItemQuantity = async (item: CartItem, quantity: number) => {
    if (!cart?.id) {
      return;
    }

    try {
      setLoading(true);
      const updated = await posService.updateItem(cart.id, item.id, { quantity });
      setCart(updated);
      refreshPendingCartsSilently();
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err));
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (item: CartItem) => {
    if (!cart?.id) {
      return;
    }

    try {
      setLoading(true);
      const updated = await posService.removeItem(cart.id, item.id);
      setCart(updated);
      refreshPendingCartsSilently();
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err));
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getBillAccountsByPaymentMethod = async (paymentMethod: PaymentMethod): Promise<BillAccount[]> => {
    const expectedType = paymentMethod === 'cash' ? 'cash' : 'debt';
    return posService.getBillAccounts(expectedType);
  };

  const completeSale = async (paymentMethod: PaymentMethod, billAccountId: UUID) => {
    if (!cart?.id) {
      throw new Error('No hay carrito para completar');
    }

    let cartToComplete = cart;
    if (selectedContactId && cart.contact_id !== selectedContactId) {
      cartToComplete = await posService.updateCart(cart.id, {
        contact_id: selectedContactId,
      });
      setCart(cartToComplete);
    }

    const completed = await posService.completeCart(cartToComplete.id, {
      payment_method: paymentMethod,
      bill_account_id: billAccountId,
    });

    setCart(completed);
    setSelectedContactId('');

    await Promise.all([
      refreshPendingCartsSilently(),
      refreshProductsSilently(),
    ]);

    return completed;
  };

  const createCustomer = async (payload: CreateCustomerPayload): Promise<Contact> => {
    try {
      const createdContact = await contactService.create(payload);
      setContacts((current) => [...current, createdContact]);

      if (cart?.id) {
        const updated = await posService.updateCart(cart.id, {
          contact_id: createdContact.id,
        });
        setCart(updated);
        refreshPendingCartsSilently();
      }

      setSelectedContactId(createdContact.id);

      setError(null);
      return createdContact;
    } catch (err) {
      setError(getErrorMessage(err));
      console.error(err);
      throw err;
    }
  };

  const resetCurrentSale = () => {
    setCart(null);
    setSelectedContactId('');
    refreshPendingCartsSilently();
  };

  return {
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
  };
}
