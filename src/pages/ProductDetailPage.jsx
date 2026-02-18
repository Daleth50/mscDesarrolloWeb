import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productService } from '../services/productService';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await productService.getById(id);
      if (data) {
        setProduct(data);
      } else {
        setError('Producto no encontrado');
      }
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Eliminar este producto?')) return;
    
    try {
      await productService.delete(id);
      navigate('/products');
    } catch (err) {
      setError(err.message);
      alert('Error al eliminar: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <p className="text-slate-600">Cargando...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <p className="text-red-600">{error || 'Producto no encontrado'}</p>
        <Link to="/products" className="text-blue-600 hover:underline mt-4 block">
          Volver a productos
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">{product.name}</h2>
        <div className="flex gap-2">
          <Link
            to={`/products/${product.id}/edit`}
            className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
          >
            Editar
          </Link>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Eliminar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-slate-600 text-sm">SKU</p>
          <p className="text-lg font-semibold">{product.sku || '-'}</p>
        </div>
        <div>
          <p className="text-slate-600 text-sm">Categoría</p>
          <p className="text-lg font-semibold">{product.category || '-'}</p>
        </div>
        <div>
          <p className="text-slate-600 text-sm">Precio</p>
          <p className="text-lg font-semibold text-green-600">${product.price}</p>
        </div>
        <div>
          <p className="text-slate-600 text-sm">Costo</p>
          <p className="text-lg font-semibold">${product.cost}</p>
        </div>
        <div>
          <p className="text-slate-600 text-sm">Margen</p>
          <p className="text-lg font-semibold">
            ${(product.price - product.cost).toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-slate-600 text-sm">Tasa de impuesto</p>
          <p className="text-lg font-semibold">{product.tax_rate}%</p>
        </div>
      </div>

      <Link
        to="/products"
        className="text-blue-600 hover:underline"
      >
        ← Volver a productos
      </Link>
    </div>
  );
}
