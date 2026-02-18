import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../services/orderService';

export default function OrderFormPage() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    contact_id: '',
    total: 0,
    subtotal: 0,
    tax: 0,
    discount: 0,
    status: 'pending',
    payment_status: 'unpaid',
    payment_method: 'cash',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['total', 'subtotal', 'tax', 'discount'].includes(name) 
        ? parseFloat(value) 
        : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await orderService.create(formData);
      navigate('/orders');
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 max-w-2xl">
      <h2 className="text-2xl font-semibold mb-4">Crear orden</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Contacto */}
        <div>
          <label htmlFor="contact_id" className="block text-sm font-medium mb-1">
            Contacto
          </label>
          <input
            type="text"
            id="contact_id"
            name="contact_id"
            value={formData.contact_id}
            onChange={handleChange}
            placeholder="ID del contacto"
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Subtotal */}
        <div>
          <label htmlFor="subtotal" className="block text-sm font-medium mb-1">
            Subtotal
          </label>
          <input
            type="number"
            id="subtotal"
            name="subtotal"
            step="0.01"
            min="0"
            value={formData.subtotal}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Impuesto */}
        <div>
          <label htmlFor="tax" className="block text-sm font-medium mb-1">
            Impuesto
          </label>
          <input
            type="number"
            id="tax"
            name="tax"
            step="0.01"
            min="0"
            value={formData.tax}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Descuento */}
        <div>
          <label htmlFor="discount" className="block text-sm font-medium mb-1">
            Descuento
          </label>
          <input
            type="number"
            id="discount"
            name="discount"
            step="0.01"
            min="0"
            value={formData.discount}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Total */}
        <div>
          <label htmlFor="total" className="block text-sm font-medium mb-1">
            Total *
          </label>
          <input
            type="number"
            id="total"
            name="total"
            step="0.01"
            min="0"
            value={formData.total}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Estado */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium mb-1">
            Estado
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="pending">Pendiente</option>
            <option value="completed">Completada</option>
            <option value="cancelled">Cancelada</option>
          </select>
        </div>

        {/* Estado de pago */}
        <div>
          <label htmlFor="payment_status" className="block text-sm font-medium mb-1">
            Estado de pago
          </label>
          <select
            id="payment_status"
            name="payment_status"
            value={formData.payment_status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="unpaid">No pagada</option>
            <option value="paid">Pagada</option>
            <option value="partial">Parcial</option>
          </select>
        </div>

        {/* Método de pago */}
        <div>
          <label htmlFor="payment_method" className="block text-sm font-medium mb-1">
            Método de pago
          </label>
          <select
            id="payment_method"
            name="payment_method"
            value={formData.payment_method}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="cash">Efectivo</option>
            <option value="card">Tarjeta</option>
            <option value="transfer">Transferencia</option>
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
            Crear orden
          </button>
        </div>
      </form>
    </div>
  );
}
