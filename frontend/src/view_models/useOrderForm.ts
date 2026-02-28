import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { productService } from '../services/productService';
import { contactService } from '../services/contactService';
import { getErrorMessage } from '../utils/error';
import type { Contact, Product, OrderStatus, PaymentStatus, UUID } from '../types/models';

type OrderFormData = {
  contact_id: UUID | '';
  product_id: UUID | '';
  quantity: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
};

type OrderFormChangeEvent = {
  target: {
    name: string;
    value: string;
  };
};

const numericFields = new Set<keyof OrderFormData>([
  'quantity',
  'subtotal',
  'tax',
  'discount',
  'total',
]);

export function useOrderForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState<OrderFormData>({
    contact_id: '',
    product_id: '',
    quantity: 1,
    status: 'pending',
    payment_status: 'pending',
    subtotal: 0,
    tax: 0,
    discount: 0,
    total: 0,
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (id) {
      loadOrder();
    }
  }, [id]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [productsData, contactsData] = await Promise.all([
        productService.getAll(),
        contactService.getAll('customer'),
      ]);
      setProducts(productsData);
      setContacts(contactsData);
    } catch (err) {
      setError(getErrorMessage(err));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadOrder = async () => {
    if (!id) {
      setError('Id de orden no encontrado');
      return;
    }

    try {
      setLoading(true);
      const orderData = await orderService.getById(id);
      setFormData(prev => ({
        ...prev,
        ...(orderData as Partial<OrderFormData>),
      }));
      setIsEdit(true);
    } catch (err) {
      setError(getErrorMessage(err));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: OrderFormChangeEvent) => {
    const { name, value } = e.target;
    const field = name as keyof OrderFormData;
    const nextValue = numericFields.has(field) ? Number(value) : value;

    setFormData(prev => ({
      ...prev,
      [field]: nextValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (isEdit) {
        if (!id) {
          setError('Id de orden no encontrado');
          return;
        }
        await orderService.update(id, formData);
      } else {
        await orderService.create(formData);
      }
      navigate('/orders');
    } catch (err) {
      setError(getErrorMessage(err));
      console.error(err);
    }
  };

  return {
    loading,
    error,
    products,
    contacts,
    formData,
    isEdit,
    handleChange,
    handleSubmit,
  };
}
