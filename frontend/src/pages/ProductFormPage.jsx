import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService, categoryService } from '../services/productService';

export default function ProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: 0,
    cost: 0,
    tax_rate: 0,
    taxonomy_id: '',
  });

  useEffect(() => {
    loadPage();
  }, [id]);

  const loadPage = async () => {
    try {
      setLoading(true);
      
      // Cargar categorías
      const cats = await categoryService.getAll();
      setCategories(cats);

      // Si es edición, cargar el producto
      if (isEdit) {
        const product = await productService.getById(id);
        if (product) {
          setFormData({
            name: product.name || '',
            sku: product.sku || '',
            price: product.price || 0,
            cost: product.cost || 0,
            tax_rate: product.tax_rate || 0,
            taxonomy_id: product.taxonomy_id || '',
          });
        }
      }
      
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'cost' || name === 'tax_rate' 
        ? parseFloat(value) 
        : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let result;
      if (isEdit) {
        result = await productService.update(id, formData);
      } else {
        result = await productService.create(formData);
      }
      navigate(`/products/${result.id}`);
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-6 max-w-2xl">
        <p className="text-slate-600">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 max-w-2xl">
      <h2 className="text-2xl font-semibold mb-4">
        {isEdit ? 'Editar producto' : 'Crear producto'}
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Nombre del producto *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* SKU */}
        <div>
          <label htmlFor="sku" className="block text-sm font-medium mb-1">
            SKU
          </label>
          <input
            type="text"
            id="sku"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Precio */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium mb-1">
            Precio *
          </label>
          <input
            type="number"
            id="price"
            name="price"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Costo */}
        <div>
          <label htmlFor="cost" className="block text-sm font-medium mb-1">
            Costo *
          </label>
          <input
            type="number"
            id="cost"
            name="cost"
            step="0.01"
            min="0"
            value={formData.cost}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Categoría */}
        <div>
          <label htmlFor="taxonomy_id" className="block text-sm font-medium mb-1">
            Categoría
          </label>
          <select
            id="taxonomy_id"
            name="taxonomy_id"
            value={formData.taxonomy_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sin categoría</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Tasa de impuesto */}
        <div>
          <label htmlFor="tax_rate" className="block text-sm font-medium mb-1">
            Tasa de impuesto *
          </label>
          <select
            id="tax_rate"
            name="tax_rate"
            value={formData.tax_rate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="0">0%</option>
            <option value="8">8%</option>
            <option value="16">16%</option>
          </select>
        </div>

        {/* Botones */}
        <div className="flex gap-2 justify-end pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-slate-300 rounded-md hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {isEdit ? 'Guardar cambios' : 'Crear producto'}
          </button>
        </div>
      </form>
    </div>
  );
}

