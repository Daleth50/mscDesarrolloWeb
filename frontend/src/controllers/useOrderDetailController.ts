import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { getErrorMessage } from '../utils/error';
import type { Order } from '../types/models';

export function useOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    if (!id) {
      setError('Id de venta no encontrado');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await orderService.getById(id);
      setOrder(data);
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err));
      setOrder(null);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/orders');
  };

  return {
    loading,
    error,
    order,
    handleBack,
  };
}
