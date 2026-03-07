import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { getErrorMessage } from '../utils/error';
import type { Order } from '../types/models';

export function usePurchaseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchase, setPurchase] = useState<Order | null>(null);

  useEffect(() => {
    loadPurchase();
  }, [id]);

  const loadPurchase = async () => {
    if (!id) {
      setError('Id de compra no encontrado');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await orderService.getById(id);
      setPurchase(data);
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err));
      setPurchase(null);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/purchase-orders');
  };

  return {
    loading,
    error,
    purchase,
    handleBack,
  };
}
