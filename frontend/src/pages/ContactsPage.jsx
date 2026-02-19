import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { contactService } from '../services/contactService';

export default function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const data = await contactService.getAll();
      setContacts(data);
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
        <p className="text-slate-600">Cargando contactos...</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Contactos</h2>
        <Link to="/contacts/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Crear contacto
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
              <th className="px-4 py-2 text-left border-b border-slate-200">Email</th>
              <th className="px-4 py-2 text-left border-b border-slate-200">Teléfono</th>
              <th className="px-4 py-2 text-left border-b border-slate-200">Dirección</th>
            </tr>
          </thead>
          <tbody>
            {contacts.length > 0 ? (
              contacts.map(contact => (
                <tr key={contact.id} className="hover:bg-slate-50">
                  <td className="px-4 py-2 border-b border-slate-200">{contact.id}</td>
                  <td className="px-4 py-2 border-b border-slate-200">{contact.name}</td>
                  <td className="px-4 py-2 border-b border-slate-200">{contact.email || '-'}</td>
                  <td className="px-4 py-2 border-b border-slate-200">{contact.phone || '-'}</td>
                  <td className="px-4 py-2 border-b border-slate-200">{contact.address || '-'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-4 text-slate-500 text-center" colSpan="5">
                  No hay contactos aún.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
