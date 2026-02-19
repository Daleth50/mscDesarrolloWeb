import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/productService';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAll();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este producto?')) return;
    
    try {
      await productService.delete(id);
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      setError(err.message);
      alert('Error al eliminar: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <p className="text-slate-600">Cargando productos...</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Productos</h2>
        <Link to="/products/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Crear producto
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-slate-200 text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-4 py-2 text-left border-b border-slate-200">ID</th>
              <th className="px-4 py-2 text-left border-b border-slate-200">Nombre</th>
              <th className="px-4 py-2 text-left border-b border-slate-200">SKU</th>
              <th className="px-4 py-2 text-left border-b border-slate-200">Precio</th>
              <th className="px-4 py-2 text-left border-b border-slate-200">Costo</th>
              <th className="px-4 py-2 text-left border-b border-slate-200">Categoría</th>
              <th className="px-4 py-2 text-left border-b border-slate-200">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map(product => (
                <tr key={product.id} className="hover:bg-slate-50">
                  <td className="px-4 py-2 border-b border-slate-200">{product.id}</td>
                  <td className="px-4 py-2 border-b border-slate-200">{product.name}</td>
                  <td className="px-4 py-2 border-b border-slate-200">{product.sku || '-'}</td>
                  <td className="px-4 py-2 border-b border-slate-200">${product.price}</td>
                  <td className="px-4 py-2 border-b border-slate-200">${product.cost}</td>
                  <td className="px-4 py-2 border-b border-slate-200">{product.category || '-'}</td>
                  <td className="px-4 py-2 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                      <Link to={`/products/${product.id}`} className="text-blue-600 hover:text-blue-700 hover:underline">
                        Ver
                      </Link>
                      <Link to={`/products/${product.id}/edit`} className="text-amber-600 hover:text-amber-700 hover:underline">
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-700 hover:underline cursor-pointer"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-4 text-slate-500 text-center" colSpan="7">
                  No hay productos aún.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

