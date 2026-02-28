import { useEffect, useMemo, useState } from 'react';
import { contactService } from '../services/contactService';
import { posService } from '../services/posService';
import { getErrorMessage } from '../utils/error';
import type { BillAccount, CartItem, Contact, Order, PaymentMethod, PosProduct, UUID } from '../types/models';

const DEFAULT_PAYMENT_STATUS = 'pending';

export function usePosCart() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [products, setProducts] = useState<PosProduct[]>([]);
  const [cart, setCart] = useState<Order | null>(null);
  const [selectedContactId, setSelectedContactId] = useState<UUID | ''>('');

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

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [contactsData, posProducts] = await Promise.all([
        contactService.getAll('customer'),
        posService.getProducts(),
      ]);
      setContacts(contactsData);
      setProducts(posProducts);
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
    return created.id;
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

    const completed = await posService.completeCart(cart.id, {
      payment_method: paymentMethod,
      bill_account_id: billAccountId,
    });
    setCart(completed);
    setSelectedContactId('');
    return completed;
  };

  const resetCurrentSale = () => {
    setCart(null);
    setSelectedContactId('');
  };

  return {
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
    getBillAccountsByPaymentMethod,
    completeSale,
    resetCurrentSale,
  };
}
