import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { getErrorMessage } from '../utils/error';
import type { Order, UUID } from '../types/models';

export function useOrdersList() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getAll();
      setOrders(data);
    } catch (err) {
      setError(getErrorMessage(err));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: UUID) => {
    navigate(`/orders/edit/${id}`);
  };

  const handleDelete = async (id: UUID) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta orden?')) {
      try {
        await orderService.delete(id);
        loadOrders();
      } catch (err) {
        setError(getErrorMessage(err));
        console.error(err);
      }
    }
  };

  return {
    loading,
    error,
    orders,
    handleEdit,
    handleDelete,
  };
}
