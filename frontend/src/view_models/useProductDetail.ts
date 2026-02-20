import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import { getErrorMessage } from '../utils/error';
import type { Product } from '../types/models';

export function useProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    if (!id) {
      setError('Id de producto no encontrado');
      return;
    }

    try {
      setLoading(true);
      const data = await productService.getById(id);
      setProduct(data);
    } catch (err) {
      setError(getErrorMessage(err));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (!id) {
      setError('Id de producto no encontrado');
      return;
    }
    navigate(`/products/${id}/edit`);
  };

  const handleDelete = async () => {
    if (!id) {
      setError('Id de producto no encontrado');
      return;
    }
    if (!window.confirm('¿Estás seguro de que quieres eliminar este producto?')) return;

    try {
      await productService.delete(id);
      navigate('/products');
    } catch (err) {
      setError(getErrorMessage(err));
      console.error(err);
    }
  };

  const handleBack = () => {
    navigate('/products');
  };

  return {
    loading,
    error,
    product,
    handleEdit,
    handleDelete,
    handleBack,
  };
}
