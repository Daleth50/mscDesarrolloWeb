import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../services/orderService';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getAll();
      setOrders(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <p className="text-slate-600">Cargando órdenes...</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Órdenes</h2>
        <Link to="/orders/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Crear orden
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
              <th className="px-4 py-2 text-left border-b border-slate-200">Contacto</th>
              <th className="px-4 py-2 text-left border-b border-slate-200">Total</th>
              <th className="px-4 py-2 text-left border-b border-slate-200">Estado</th>
              <th className="px-4 py-2 text-left border-b border-slate-200">Pago</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map(order => (
                <tr key={order.id} className="hover:bg-slate-50">
                  <td className="px-4 py-2 border-b border-slate-200">{order.id}</td>
                  <td className="px-4 py-2 border-b border-slate-200">{order.contact_id || '-'}</td>
                  <td className="px-4 py-2 border-b border-slate-200">${order.total}</td>
                  <td className="px-4 py-2 border-b border-slate-200">{order.status || '-'}</td>
                  <td className="px-4 py-2 border-b border-slate-200">{order.payment_status || '-'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-4 text-slate-500 text-center" colSpan="5">
                  No hay órdenes aún.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
